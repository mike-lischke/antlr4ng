/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { LL1Analyzer } from "./LL1Analyzer.js";
import { IntervalSet } from "../misc/IntervalSet.js";
import { ATNState } from "./ATNState.js";
import { DecisionState } from "./DecisionState.js";
import { RuleStartState } from "./RuleStartState.js";
import { RuleStopState } from "./RuleStopState.js";
import { LexerAction } from "./LexerAction.js";
import { TokensStartState } from "./TokensStartState.js";
import { Token } from "../Token.js";
import { RuleTransition } from "./RuleTransition.js";
import type { ParserRuleContext } from "../ParserRuleContext.js";

export class ATN {
    public static INVALID_ALT_NUMBER = 0;

    /** Represents the type of recognizer an ATN applies to */
    public static readonly LEXER = 0;
    public static readonly PARSER = 1;

    public static readonly analyzer = new LL1Analyzer();

    /**
     * Used for runtime deserialization of ATNs from strings
     * The type of the ATN.
     */
    public readonly grammarType: number;

    /** The maximum value for any symbol recognized by a transition in the ATN. */
    public readonly maxTokenType: number;

    public readonly states: Array<ATNState | null> = [];

    /**
     * Each subrule/rule is a decision point and we must track them so we
     * can go back later and build DFA predictors for them.  This includes
     * all the rules, subrules, optional blocks, ()+, ()* etc...
     */
    public readonly decisionToState: DecisionState[] = [];

    /** Maps from rule index to starting state number. */
    public ruleToStartState: Array<RuleStartState | null> = []; // Initialized by the ATN deserializer.

    /** Maps from rule index to stop state number. */
    public ruleToStopState: Array<RuleStopState | null> = []; // Initialized by the ATN deserializer.

    public readonly modeNameToStartState = new Map<string, TokensStartState>();

    /**
     * For lexer ATNs, this maps the rule index to the resulting token type.
     * For parser ATNs, this maps the rule index to the generated bypass token
     * type if the {@link ATNDeserializationOptions//isGenerateRuleBypassTransitions}
     * deserialization option was specified; otherwise, this is `null`
     */
    public ruleToTokenType: number[] = []; // Initialized by the ATN deserializer.

    /**
     * For lexer ATNs, this is an array of {@link LexerAction} objects which may
     * be referenced by action transitions in the ATN
     */
    public lexerActions: LexerAction[] = [];

    public readonly modeToStartState: Array<TokensStartState | null> = [];

    public constructor(grammarType: number, maxTokenType: number) {
        this.grammarType = grammarType;
        this.maxTokenType = maxTokenType;
    }

    /**
     * Compute the set of valid tokens that can occur starting in state `s`.
     * If `ctx` is null, the set of tokens will not include what can follow
     * the rule surrounding `s`. In other words, the set will be
     * restricted to tokens reachable staying within `s`'s rule.
     */
    public nextTokens(atnState: ATNState, ctx?: ParserRuleContext): IntervalSet {
        if (!ctx && atnState.nextTokenWithinRule) {
            return atnState.nextTokenWithinRule;
        }

        const next = ATN.analyzer.look(this, atnState, undefined, ctx);
        if (!ctx) {
            atnState.nextTokenWithinRule = next;
        }

        return next;
    }

    public addState(state: ATNState | null): void {
        if (state) {
            state.stateNumber = this.states.length;
        }
        this.states.push(state);
    }

    public removeState(state: ATNState): void {
        this.states[state.stateNumber] = null; // just free mem, don't shift states in list
    }

    public defineDecisionState(s: DecisionState): number {
        this.decisionToState.push(s);
        s.decision = this.decisionToState.length - 1;

        return s.decision;
    }

    public getDecisionState(decision: number): DecisionState | null {
        if (this.decisionToState.length === 0) {
            return null;
        } else {
            return this.decisionToState[decision];
        }
    }

    public getNumberOfDecisions(): number {
        return this.decisionToState.length;
    }

    /**
     * Computes the set of input symbols which could follow ATN state number
     * `stateNumber` in the specified full `context`. This method
     * considers the complete parser context, but does not evaluate semantic
     * predicates (i.e. all predicates encountered during the calculation are
     * assumed true). If a path in the ATN exists from the starting state to the
     * {@link RuleStopState} of the outermost context without matching any
     * symbols, {@link Token//EOF} is added to the returned set.
     *
     * If `context` is `null`, it is treated as
     * {@link ParserRuleContext//EMPTY}.
     *
     * @param stateNumber the ATN state number
     * @param context the full parse context
     *
     * @returns {IntervalSet} The set of potentially valid input symbols which could follow the
     * specified state in the specified context.
     *
     * @throws IllegalArgumentException if the ATN does not contain a state with
     * number `stateNumber`
     */
    public getExpectedTokens(stateNumber: number, context: ParserRuleContext | null): IntervalSet {
        if (stateNumber < 0 || stateNumber >= this.states.length) {
            throw new Error("Invalid state number.");
        }

        const s = this.states[stateNumber]!;
        let following = this.nextTokens(s);
        if (!following.contains(Token.EPSILON)) {
            return following;
        }

        let ctx: ParserRuleContext | null = context;
        const expected = new IntervalSet();
        expected.addSet(following);
        expected.removeOne(Token.EPSILON);
        while (ctx !== null && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
            const invokingState = this.states[ctx.invokingState]!;
            const rt = invokingState.transitions[0] as RuleTransition;
            following = this.nextTokens(rt.followState);
            expected.addSet(following);
            expected.removeOne(Token.EPSILON);
            ctx = ctx.parent;
        }

        if (following.contains(Token.EPSILON)) {
            expected.addOne(Token.EOF);
        }

        return expected;
    }

}
