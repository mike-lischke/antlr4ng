/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from "../Token.js";
import { IntervalSet } from "../misc/IntervalSet.js";
import { RuleTransition } from "./RuleTransition.js";
import { NotSetTransition } from "./NotSetTransition.js";
import { predictionContextFromRuleContext } from "./PredictionContextUtils.js";
import { PredictionContext } from "./PredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";
import { BitSet } from "../misc/BitSet.js";
import { ATNState } from "./ATNState.js";
import { ATN } from "./ATN.js";
import { ParserRuleContext } from "../ParserRuleContext.js";
import { Transition } from "./Transition.js";
import { HashSet } from "../misc/HashSet.js";
import { ATNConfig } from "./ATNConfig.js";

export class LL1Analyzer {
    /**
     * Special value added to the lookahead sets to indicate that we hit
     * a predicate during analysis if `seeThruPreds==false`.
     */
    private static readonly hitPredicate = Token.INVALID_TYPE;

    #atn: ATN;

    /**
     * Calculates the SLL(1) expected lookahead set for each outgoing transition
     * of an {@link ATNState}. The returned array has one element for each
     * outgoing transition in `s`. If the closure from transition
     * _i_ leads to a semantic predicate before matching a symbol, the
     * element at index *i* of the result will be `null`.
     *
     * @param s the ATN state
     * @returns the expected symbols for each outgoing transition of `s`.
     */
    public getDecisionLookahead(s?: ATNState): Array<IntervalSet | null> | undefined {
        if (!s) {
            return undefined;
        }

        const count = s.transitions.length;
        const look = new Array<IntervalSet>(count);
        for (let alt = 0; alt < count; alt++) {
            const set = new IntervalSet();
            const lookBusy = new HashSet<ATNConfig>();
            this.doLook(s.transitions[alt].target, undefined, PredictionContext.EMPTY, set, lookBusy, new BitSet(),
                false, false);

            // Add lookahead for this alternative if we found something
            // and we had no predicate when we !seeThruPreds.
            if (set.length > 0 && !set.contains(LL1Analyzer.hitPredicate)) {
                look[alt] = set;
            }
        }

        return look;
    }

    /**
     * Compute set of tokens that can follow `s` in the ATN in the
     * specified `ctx`.
     *
     * If `ctx` is `null` and the end of the rule containing
     * `s` is reached, {@link Token//EPSILON} is added to the result set.
     * If `ctx` is not `null` and the end of the outermost rule is
     * reached, {@link Token//EOF} is added to the result set.
     *
     * @param atn the ATN
     * @param s the ATN state
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx the complete parser context, or `null` if the context
     * should be ignored
     *
     * @returns The set of tokens that can follow `s` in the ATN in the
     * specified `ctx`.
     */
    public look(atn: ATN, s: ATNState, stopState?: ATNState, ctx?: ParserRuleContext): IntervalSet {
        this.#atn = atn;
        const r = new IntervalSet();

        const lookContext = ctx ? predictionContextFromRuleContext(atn, ctx) : null;
        this.doLook(s, stopState, lookContext, r, new HashSet(), new BitSet(), true, true);

        return r;
    }

    /**
     * Compute set of tokens that can follow `s` in the ATN in the
     * specified `ctx`.
     *
     * If `ctx` is `null` and `stopState` or the end of the
     * rule containing `s` is reached, {@link Token//EPSILON} is added to
     * the result set. If `ctx` is not `null` and `addEOF` is
     * `true` and `stopState` or the end of the outermost rule is
     * reached, {@link Token//EOF} is added to the result set.
     *
     * @param s the ATN state.
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx The outer context, or `null` if the outer context should
     * not be used.
     * @param look The result lookahead set.
     * @param lookBusy A set used for preventing epsilon closures in the ATN
     * from causing a stack overflow. Outside code should pass
     * `new CustomizedSet<ATNConfig>` for this argument.
     * @param calledRuleStack A set used for preventing left recursion in the
     * ATN from causing a stack overflow. Outside code should pass
     * `new BitSet()` for this argument.
     * @param seeThruPreds `true` to true semantic predicates as
     * implicitly `true` and "see through them", otherwise `false`
     * to treat semantic predicates as opaque and add {@link hitPredicate} to the
     * result if one is encountered.
     * @param addEOF Add {@link Token//EOF} to the result if the end of the
     * outermost context is reached. This parameter has no effect if `ctx`
     * is `null`.
     */
    private doLook(s: ATNState, stopState: ATNState | undefined, ctx: PredictionContext | null, look: IntervalSet,
        lookBusy: HashSet<ATNConfig>, calledRuleStack: BitSet, seeThruPreds: boolean, addEOF: boolean): void {
        const c = ATNConfig.createWithContext(s, 0, ctx);
        if (lookBusy.get(c)) {
            return;
        }
        lookBusy.add(c);

        if (s === stopState) {
            if (!ctx) {
                look.addOne(Token.EPSILON);

                return;
            } else if (ctx.isEmpty() && addEOF) {
                look.addOne(Token.EOF);

                return;
            }
        }
        if ((s.constructor as typeof ATNState).stateType === ATNState.RULE_STOP) {
            if (!ctx) {
                look.addOne(Token.EPSILON);

                return;
            } else if (ctx.isEmpty() && addEOF) {
                look.addOne(Token.EOF);

                return;
            }

            if (ctx !== PredictionContext.EMPTY) {
                const removed = calledRuleStack.get(s.ruleIndex);
                try {
                    calledRuleStack.clear(s.ruleIndex);

                    // run thru all possible stack tops in ctx
                    for (let i = 0; i < ctx.length; i++) {
                        const returnState = this.#atn.states[ctx.getReturnState(i)]!;
                        this.doLook(returnState, stopState, ctx.getParent(i), look, lookBusy, calledRuleStack,
                            seeThruPreds, addEOF);
                    }
                } finally {
                    if (removed) {
                        calledRuleStack.set(s.ruleIndex);
                    }
                }

                return;
            }
        }

        for (const t of s.transitions) {
            switch (t.transitionType) {
                case Transition.RULE: {
                    if (calledRuleStack.get(t.target.ruleIndex)) {
                        continue;
                    }

                    const newContext = SingletonPredictionContext.create(ctx ?? undefined,
                        (t as RuleTransition).followState.stateNumber);
                    try {
                        calledRuleStack.set(t.target.ruleIndex);
                        this.doLook(t.target, stopState, newContext, look, lookBusy, calledRuleStack, seeThruPreds,
                            addEOF);
                    } finally {
                        calledRuleStack.clear(t.target.ruleIndex);
                    }
                    break;
                }

                case Transition.PREDICATE:
                case Transition.PRECEDENCE: {
                    if (seeThruPreds) {
                        this.doLook(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                    } else {
                        look.addOne(LL1Analyzer.hitPredicate);
                    }
                    break;
                }

                case Transition.WILDCARD: {
                    look.addRange(Token.MIN_USER_TOKEN_TYPE, this.#atn.maxTokenType);
                    break;
                }

                default: {
                    if (t.isEpsilon) {
                        this.doLook(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                    } else {
                        let set = t.label;
                        if (set) {
                            if (t instanceof NotSetTransition) {
                                set = set.complement(Token.MIN_USER_TOKEN_TYPE, this.#atn.maxTokenType);
                            }
                            look.addSet(set);
                        }
                    }

                    break;
                }
            }
        }
    }
}
