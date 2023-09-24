/* eslint-disable jsdoc/require-returns, jsdoc/no-undefined-types, jsdoc/check-tag-names, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from '../Token.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ATNConfig } from './ATNConfig.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { IntervalSet } from '../misc/IntervalSet.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { RuleStopState } from './RuleStopState.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { RuleTransition } from './RuleTransition.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { NotSetTransition } from './NotSetTransition.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { WildcardTransition } from './WildcardTransition.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { AbstractPredicateTransition } from './AbstractPredicateTransition.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { predictionContextFromRuleContext } from './PredictionContextUtils.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { PredictionContext } from './PredictionContext.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { SingletonPredictionContext } from './SingletonPredictionContext.js';
import { BitSet } from "../misc/BitSet.js";
import { HashSet } from "../misc/HashSet.js";

export class LL1Analyzer {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    atn: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(atn: any) {
        this.atn = atn;
    }

    /**
     * Calculates the SLL(1) expected lookahead set for each outgoing transition
     * of an {@link ATNState}. The returned array has one element for each
     * outgoing transition in {@code s}. If the closure from transition
     * <em>i</em> leads to a semantic predicate before matching a symbol, the
     * element at index <em>i</em> of the result will be {@code null}.
     *
     * @param s the ATN state
     * @return the expected symbols for each outgoing transition of {@code s}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getDecisionLookahead(s: any) {
        if (s === null) {
            return null;
        }
        const count = s.transitions.length;
        const look = [];
        for (let alt = 0; alt < count; alt++) {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            look[alt] = new IntervalSet();
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
            const lookBusy = new HashSet();
            const seeThruPreds = false; // fail to get lookahead upon pred
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-call
            this._LOOK(s.transition(alt).target, null, PredictionContext.EMPTY,
                look[alt], lookBusy, new BitSet(), seeThruPreds, false);
            // Wipe out lookahead for this alternative if we found nothing
            // or we had a predicate when we !seeThruPreds
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            if (look[alt].length === 0 || look[alt].contains(LL1Analyzer.HIT_PRED)) {
                look[alt] = null;
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return look;
    }

    /**
     * Compute set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     *
     * <p>If {@code ctx} is {@code null} and the end of the rule containing
     * {@code s} is reached, {@link Token//EPSILON} is added to the result set.
     * If {@code ctx} is not {@code null} and the end of the outermost rule is
     * reached, {@link Token//EOF} is added to the result set.</p>
     *
     * @param s the ATN state
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx the complete parser context, or {@code null} if the context
     * should be ignored
     *
     * @return The set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    LOOK(s: any, stopState: any, ctx: any) {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const r = new IntervalSet();
        const seeThruPreds = true; // ignore preds; get all lookahead
        ctx = ctx || null;
        const lookContext = ctx !== null ? predictionContextFromRuleContext(s.atn, ctx) : null;
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        // eslint-disable-next-line no-underscore-dangle
        this._LOOK(s, stopState, lookContext, r, new HashSet(), new BitSet(), seeThruPreds, true);
        // eslint-disable-next-line padding-line-between-statements
        return r;
    }

    /**
     * Compute set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     *
     * <p>If {@code ctx} is {@code null} and {@code stopState} or the end of the
     * rule containing {@code s} is reached, {@link Token//EPSILON} is added to
     * the result set. If {@code ctx} is not {@code null} and {@code addEOF} is
     * {@code true} and {@code stopState} or the end of the outermost rule is
     * reached, {@link Token//EOF} is added to the result set.</p>
     *
     * @param s the ATN state.
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx The outer context, or {@code null} if the outer context should
     * not be used.
     * @param look The result lookahead set.
     * @param lookBusy A set used for preventing epsilon closures in the ATN
     * from causing a stack overflow. Outside code should pass
     * {@code new CustomizedSet<ATNConfig>} for this argument.
     * @param calledRuleStack A set used for preventing left recursion in the
     * ATN from causing a stack overflow. Outside code should pass
     * {@code new BitSet()} for this argument.
     * @param seeThruPreds {@code true} to true semantic predicates as
     * implicitly {@code true} and "see through them", otherwise {@code false}
     * to treat semantic predicates as opaque and add {@link //HIT_PRED} to the
     * result if one is encountered.
     * @param addEOF Add {@link Token//EOF} to the result if the end of the
     * outermost context is reached. This parameter has no effect if {@code ctx}
     * is {@code null}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _LOOK(s: any, stopState: any, ctx: any, look: any, lookBusy: any, calledRuleStack: any, seeThruPreds: any, addEOF: any) {
        const c = new ATNConfig({ state: s, alt: 0, context: ctx }, null);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (lookBusy.has(c)) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        lookBusy.add(c);
        if (s === stopState) {
            if (ctx === null) {
                // @ts-expect-error TS(2339): Property 'EPSILON' does not exist on type 'typeof ... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                look.addOne(Token.EPSILON);
                // eslint-disable-next-line padding-line-between-statements
                return;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            } else if (ctx.isEmpty() && addEOF) {
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                look.addOne(Token.EOF);
                // eslint-disable-next-line padding-line-between-statements
                return;
            }
        }
        if (s instanceof RuleStopState) {
            if (ctx === null) {
                // @ts-expect-error TS(2339): Property 'EPSILON' does not exist on type 'typeof ... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                look.addOne(Token.EPSILON);
                // eslint-disable-next-line padding-line-between-statements
                return;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            } else if (ctx.isEmpty() && addEOF) {
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                look.addOne(Token.EOF);
                // eslint-disable-next-line padding-line-between-statements
                return;
            }
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            if (ctx !== PredictionContext.EMPTY) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const removed = calledRuleStack.get(s.ruleIndex);
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    calledRuleStack.clear(s.ruleIndex);
                    // run thru all possible stack tops in ctx
                    for (let i = 0; i < ctx.length; i++) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        const returnState = this.atn.states[ctx.getReturnState(i)];
                        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-call
                        this._LOOK(returnState, stopState, ctx.getParent(i), look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                    }
                } finally {
                    if (removed) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        calledRuleStack.set(s.ruleIndex);
                    }
                }
                // eslint-disable-next-line padding-line-between-statements
                return;
            }
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let j = 0; j < s.transitions.length; j++) {
            const t = s.transitions[j];
            if (t.constructor === RuleTransition) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (calledRuleStack.get(t.target.ruleIndex)) {
                    continue;
                }
                const newContext = SingletonPredictionContext.create(ctx, t.followState.stateNumber);
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    calledRuleStack.set(t.target.ruleIndex);
                    // eslint-disable-next-line no-underscore-dangle
                    this._LOOK(t.target, stopState, newContext, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                } finally {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    calledRuleStack.clear(t.target.ruleIndex);
                }
            } else if (t instanceof AbstractPredicateTransition) {
                if (seeThruPreds) {
                    // eslint-disable-next-line no-underscore-dangle
                    this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
                } else {
                    // @ts-expect-error TS(2339): Property 'HIT_PRED' does not exist on type 'typeof... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    look.addOne(LL1Analyzer.HIT_PRED);
                }
            } else if (t.isEpsilon) {
                // eslint-disable-next-line no-underscore-dangle
                this._LOOK(t.target, stopState, ctx, look, lookBusy, calledRuleStack, seeThruPreds, addEOF);
            } else if (t.constructor === WildcardTransition) {
                // @ts-expect-error TS(2339): Property 'MIN_USER_TOKEN_TYPE' does not exist on t... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                look.addRange(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
            } else {
                let set = t.label;
                if (set !== null) {
                    if (t instanceof NotSetTransition) {
                        // @ts-expect-error TS(2339): Property 'MIN_USER_TOKEN_TYPE' does not exist on t... Remove this comment to see the full error message
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        set = set.complement(Token.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    look.addSet(set);
                }
            }
        }
    }
}

/**
 * Special value added to the lookahead sets to indicate that we hit
 * a predicate during analysis if {@code seeThruPreds==false}.
 */
// @ts-expect-error TS(2339): Property 'HIT_PRED' does not exist on type 'typeof... Remove this comment to see the full error message
LL1Analyzer.HIT_PRED = Token.INVALID_TYPE;
