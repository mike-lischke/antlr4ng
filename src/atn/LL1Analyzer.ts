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
import { MurmurHash } from "../utils/MurmurHash.js";
import { Transition } from "./Transition.js";

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
            const lookBusy = new Set<number>();
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

        const lookContext = ctx ? predictionContextFromRuleContext(atn, ctx) : undefined;
        this.doLook(s, stopState, lookContext, r, new Set(), new BitSet(), true, true);

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
    private doLook(s: ATNState, stopState: ATNState | undefined, ctx: PredictionContext | undefined, look: IntervalSet,
        lookBusy: Set<number>, calledRuleStack: BitSet, seeThruPreds: boolean, addEOF: boolean): void {

        // `lookBusy` is essentially a standard recursion stopper. It's based on the given configuration details.
        // The original code created an instance of `ATNConfig` just for that purpose. However, some of the details
        // are always the same (e.g. `alt` is always 0 and the semantic context is alway `NONE`). With this in mind,
        // we can just create a local hash code and use it to check if we've already visited the current state with
        // the current context.
        // There's a small risk here: if the hash code is the same for two different configurations, we might end up
        // not visiting a state that we should visit. However, the probability of that happening is very low and the
        // runtime tests all succeed, so we're good to go.

        let hashCode = MurmurHash.initialize(7);
        hashCode = MurmurHash.update(hashCode, s.stateNumber);
        hashCode = MurmurHash.updateFromComparable(hashCode, ctx);
        hashCode = MurmurHash.finish(hashCode, 2);

        const size = lookBusy.size;
        lookBusy.add(hashCode);
        if (size === lookBusy.size) { // Size didn't change, so we've already visited this state with this context.
            return;
        }

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
                        this.doLook(returnState, stopState, ctx.getParent(i) ?? undefined, look, lookBusy,
                            calledRuleStack, seeThruPreds, addEOF);
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

                    const newContext = SingletonPredictionContext.create(ctx,
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
