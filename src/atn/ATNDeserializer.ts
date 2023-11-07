/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { Token } from "../Token.js";
import { ATN } from "./ATN.js";
import { ATNType } from "./ATNType.js";

import { BasicState } from "./BasicState.js";
import { DecisionState } from "./DecisionState.js";
import { BlockStartState } from "./BlockStartState.js";
import { BlockEndState } from "./BlockEndState.js";
import { LoopEndState } from "./LoopEndState.js";
import { RuleStartState } from "./RuleStartState.js";
import { RuleStopState } from "./RuleStopState.js";
import { TokensStartState } from "./TokensStartState.js";
import { PlusLoopbackState } from "./PlusLoopbackState.js";
import { StarLoopbackState } from "./StarLoopbackState.js";
import { StarLoopEntryState } from "./StarLoopEntryState.js";
import { PlusBlockStartState } from "./PlusBlockStartState.js";
import { StarBlockStartState } from "./StarBlockStartState.js";
import { BasicBlockStartState } from "./BasicBlockStartState.js";

import { AtomTransition } from "./AtomTransition.js";
import { SetTransition } from "./SetTransition.js";
import { NotSetTransition } from "./NotSetTransition.js";
import { RuleTransition } from "./RuleTransition.js";
import { RangeTransition } from "./RangeTransition.js";
import { ActionTransition } from "./ActionTransition.js";
import { EpsilonTransition } from "./EpsilonTransition.js";
import { WildcardTransition } from "./WildcardTransition.js";
import { PredicateTransition } from "./PredicateTransition.js";
import { PrecedencePredicateTransition } from "./PrecedencePredicateTransition.js";

import { IntervalSet } from "../misc/IntervalSet.js";
import { ATNDeserializationOptions } from "./ATNDeserializationOptions.js";

import { LexerActionType } from "./LexerActionType.js";
import { LexerSkipAction } from "./LexerSkipAction.js";
import { LexerChannelAction } from "./LexerChannelAction.js";
import { LexerCustomAction } from "./LexerCustomAction.js";
import { LexerMoreAction } from "./LexerMoreAction.js";
import { LexerTypeAction } from "./LexerTypeAction.js";
import { LexerPushModeAction } from "./LexerPushModeAction.js";
import { LexerPopModeAction } from "./LexerPopModeAction.js";
import { LexerModeAction } from "./LexerModeAction.js";
import { ATNStateType } from "./ATNStateType.js";
import { TransitionType } from "./TransitionType.js";
import { ATNState } from "./ATNState.js";
import { LexerAction } from "./LexerAction.js";
import { Transition } from "./Transition.js";

const initArray = <T>(length: number, value: T) => {
    const tmp = new Array<T>(length - 1);
    tmp[length - 1] = value;

    return tmp.map(() => { return value; });
};

export class ATNDeserializer {
    public static readonly SERIALIZED_VERSION = 4;

    private data: number[] = [];
    private pos = 0;

    private readonly deserializationOptions: ATNDeserializationOptions;
    private stateFactories: Array<(() => ATNState) | null> | null = null;
    private actionFactories: Array<(data1: number, data2: number) => LexerAction> | null = null;

    public constructor(options?: ATNDeserializationOptions) {
        if (!options) {
            options = ATNDeserializationOptions.defaultOptions;
        }

        this.deserializationOptions = options;
        this.stateFactories = null;
        this.actionFactories = null;
    }

    public deserialize(data: number[]): ATN {
        this.reset(data);
        this.checkVersion();

        const atn = this.readATN();
        this.readStates(atn);
        this.readRules(atn);
        this.readModes(atn);

        const sets: IntervalSet[] = [];
        this.readSets(atn, sets);
        this.readEdges(atn, sets);
        this.readDecisions(atn);
        this.readLexerActions(atn);
        this.markPrecedenceDecisions(atn);
        this.verifyATN(atn);

        if (this.deserializationOptions.generateRuleBypassTransitions && atn.grammarType === ATNType.PARSER) {
            this.generateRuleBypassTransitions(atn);
            // re-verify after modification
            this.verifyATN(atn);
        }

        return atn;
    }

    public reset(data: number[]): boolean {
        this.data = data;
        this.pos = 0;

        return false;
    }

    public checkVersion(): void {
        const version = this.readInt();
        if (version !== ATNDeserializer.SERIALIZED_VERSION) {
            throw new Error("Could not deserialize ATN with version " + version + " (expected " +
                ATNDeserializer.SERIALIZED_VERSION + ").");
        }
    }

    public readATN(): ATN {
        const grammarType = this.readInt();
        const maxTokenType = this.readInt();

        return new ATN(grammarType, maxTokenType);
    }

    public readStates(atn: ATN): void {
        let j;
        let stateNumber;

        const loopBackStateNumbers: Array<[LoopEndState, number]> = [];
        const endStateNumbers: Array<[BlockStartState, number]> = [];
        const stateCount = this.readInt();
        for (let i = 0; i < stateCount; i++) {
            const stateType = this.readInt();
            // ignore bad type of states
            if (stateType === ATNStateType.INVALID_TYPE) {
                atn.addState(null);
                continue;
            }
            const ruleIndex = this.readInt();
            const s = this.stateFactory(stateType, ruleIndex);
            if (stateType === ATNStateType.LOOP_END) { // special case
                const loopBackStateNumber = this.readInt();
                loopBackStateNumbers.push([s as LoopEndState, loopBackStateNumber]);
            } else if (s instanceof BlockStartState) {
                const endStateNumber = this.readInt();
                endStateNumbers.push([s, endStateNumber]);
            }
            atn.addState(s);
        }
        // delay the assignment of loop back and end states until we know all the
        // state instances have been initialized
        for (j = 0; j < loopBackStateNumbers.length; j++) {
            const pair = loopBackStateNumbers[j];
            pair[0].loopBackState = atn.states[pair[1]];
        }

        for (j = 0; j < endStateNumbers.length; j++) {
            const pair = endStateNumbers[j];
            pair[0].endState = atn.states[pair[1]] as BlockEndState;
        }

        const numNonGreedyStates = this.readInt();
        for (j = 0; j < numNonGreedyStates; j++) {
            stateNumber = this.readInt();
            (atn.states[stateNumber] as DecisionState).nonGreedy = true;
        }

        const numPrecedenceStates = this.readInt();
        for (j = 0; j < numPrecedenceStates; j++) {
            stateNumber = this.readInt();
            (atn.states[stateNumber] as RuleStartState).isPrecedenceRule = true;
        }
    }

    public readRules(atn: ATN): void {
        let i;
        const ruleCount = this.readInt();
        if (atn.grammarType === ATNType.LEXER) {
            atn.ruleToTokenType = initArray(ruleCount, 0);
        }
        atn.ruleToStartState = initArray<RuleStartState | null>(ruleCount, null);
        for (i = 0; i < ruleCount; i++) {
            const s = this.readInt();
            atn.ruleToStartState[i] = atn.states[s] as RuleStartState;
            if (atn.grammarType === ATNType.LEXER) {
                const tokenType = this.readInt();
                atn.ruleToTokenType[i] = tokenType;
            }
        }
        atn.ruleToStopState = initArray<RuleStopState | null>(ruleCount, null);
        for (i = 0; i < atn.states.length; i++) {
            const state = atn.states[i];
            if (!(state instanceof RuleStopState)) {
                continue;
            }
            atn.ruleToStopState[state.ruleIndex] = state;
            atn.ruleToStartState[state.ruleIndex]!.stopState = state;
        }
    }

    public readModes(atn: ATN): void {
        const modeCount = this.readInt();
        for (let i = 0; i < modeCount; i++) {
            const s = this.readInt();
            atn.modeToStartState.push(atn.states[s] as RuleStartState);
        }
    }

    public readSets(atn: ATN, sets: IntervalSet[]): void {
        const m = this.readInt();
        for (let i = 0; i < m; i++) {
            const intervalSet = new IntervalSet();
            sets.push(intervalSet);
            const n = this.readInt();
            const containsEof = this.readInt();
            if (containsEof !== 0) {
                intervalSet.addOne(-1);
            }
            for (let j = 0; j < n; j++) {
                const i1 = this.readInt();
                const i2 = this.readInt();
                intervalSet.addRange(i1, i2);
            }
        }
    }

    public readEdges(atn: ATN, sets: IntervalSet[]): void {
        let i; let j; let state; let trans; let target;
        const edgeCount = this.readInt();
        for (i = 0; i < edgeCount; i++) {
            const src = this.readInt();
            const trg = this.readInt();
            const ttype = this.readInt();
            const arg1 = this.readInt();
            const arg2 = this.readInt();
            const arg3 = this.readInt();
            trans = this.edgeFactory(atn, ttype, trg, arg1, arg2, arg3, sets);
            const srcState = atn.states[src]!;
            srcState.addTransition(trans);
        }

        // edges for rule stop states can be derived, so they aren't serialized
        for (i = 0; i < atn.states.length; i++) {
            state = atn.states[i]!;
            for (j = 0; j < state.transitions.length; j++) {
                const t = state.transitions[j];
                if (!(t instanceof RuleTransition)) {
                    continue;
                }
                let outermostPrecedenceReturn = -1;
                if (atn.ruleToStartState[t.target.ruleIndex]!.isPrecedenceRule) {
                    if (t.precedence === 0) {
                        outermostPrecedenceReturn = t.target.ruleIndex;
                    }
                }

                trans = new EpsilonTransition(t.followState, outermostPrecedenceReturn);
                atn.ruleToStopState[t.target.ruleIndex]!.addTransition(trans);
            }
        }

        for (i = 0; i < atn.states.length; i++) {
            state = atn.states[i];
            if (state instanceof BlockStartState) {
                // we need to know the end state to set its start state
                if (state.endState === null) {
                    throw new Error("IllegalState");
                }
                // block end states can only be associated to a single block start
                // state
                if (state.endState.startState) {
                    throw new Error("IllegalState");
                }
                state.endState.startState = state;
            }
            if (state instanceof PlusLoopbackState) {
                for (j = 0; j < state.transitions.length; j++) {
                    target = state.transitions[j].target;
                    if (target instanceof PlusBlockStartState) {
                        target.loopBackState = state;
                    }
                }
            } else if (state instanceof StarLoopbackState) {
                for (j = 0; j < state.transitions.length; j++) {
                    target = state.transitions[j].target;
                    if (target instanceof StarLoopEntryState) {
                        target.loopBackState = state;
                    }
                }
            }
        }
    }

    public readDecisions(atn: ATN): void {
        const decisionCount = this.readInt();
        for (let i = 0; i < decisionCount; i++) {
            const s = this.readInt();
            const decState = atn.states[s] as DecisionState;
            atn.decisionToState.push(decState);
            decState.decision = i;
        }
    }

    public readLexerActions(atn: ATN): void {
        if (atn.grammarType === ATNType.LEXER) {
            const count = this.readInt();
            atn.lexerActions = [];
            for (let i = 0; i < count; i++) {
                const actionType = this.readInt();
                const data1 = this.readInt();
                const data2 = this.readInt();
                atn.lexerActions.push(this.lexerActionFactory(actionType, data1, data2));
            }
        }
    }

    public generateRuleBypassTransitions(atn: ATN): void {
        let i;
        const count = atn.ruleToStartState.length;
        for (i = 0; i < count; i++) {
            atn.ruleToTokenType[i] = atn.maxTokenType + i + 1;
        }
        for (i = 0; i < count; i++) {
            this.generateRuleBypassTransition(atn, i);
        }
    }

    public generateRuleBypassTransition(atn: ATN, idx: number): void {
        let i; let state;
        const bypassStart = new BasicBlockStartState();
        bypassStart.ruleIndex = idx;
        atn.addState(bypassStart);

        const bypassStop = new BlockEndState();
        bypassStop.ruleIndex = idx;
        atn.addState(bypassStop);

        bypassStart.endState = bypassStop;
        atn.defineDecisionState(bypassStart);

        bypassStop.startState = bypassStart;

        let excludeTransition = null;
        let endState = null;

        if (atn.ruleToStartState[idx]!.isPrecedenceRule) {
            // wrap from the beginning of the rule to the StarLoopEntryState
            endState = null;
            for (i = 0; i < atn.states.length; i++) {
                state = atn.states[i] as LoopEndState;
                if (this.stateIsEndStateFor(state, idx)) {
                    endState = state;
                    excludeTransition = state.loopBackState!.transitions[0];
                    break;
                }
            }
            if (excludeTransition === null) {
                throw new Error("Couldn't identify final state of the precedence rule prefix section.");
            }
        } else {
            endState = atn.ruleToStopState[idx]!;
        }

        // all non-excluded transitions that currently target end state need to
        // target blockEnd instead
        for (i = 0; i < atn.states.length; i++) {
            state = atn.states[i]!;
            for (const transition of state.transitions) {
                if (transition === excludeTransition) {
                    continue;
                }
                if (transition.target === endState) {
                    transition.target = bypassStop;
                }
            }
        }

        // all transitions leaving the rule start state need to leave blockStart
        // instead
        const ruleToStartState = atn.ruleToStartState[idx]!;
        const count = ruleToStartState.transitions.length;
        while (count > 0) {
            bypassStart.addTransition(ruleToStartState.transitions[count - 1]);
            ruleToStartState.transitions = ruleToStartState.transitions.slice(-1);
        }
        // link the new states
        atn.ruleToStartState[idx]!.addTransition(new EpsilonTransition(bypassStart));
        if (endState) {
            bypassStop.addTransition(new EpsilonTransition(endState));
        }

        const matchState = new BasicState();
        atn.addState(matchState);
        matchState.addTransition(new AtomTransition(bypassStop, atn.ruleToTokenType[idx]));
        bypassStart.addTransition(new EpsilonTransition(matchState));
    }

    public stateIsEndStateFor(state: ATNState, idx: number): ATNState | null {
        if (state.ruleIndex !== idx) {
            return null;
        }
        if (!(state instanceof StarLoopEntryState)) {
            return null;
        }
        const maybeLoopEndState = state.transitions[state.transitions.length - 1].target;
        if (!(maybeLoopEndState instanceof LoopEndState)) {
            return null;
        }
        if (maybeLoopEndState.epsilonOnlyTransitions &&
            (maybeLoopEndState.transitions[0].target instanceof RuleStopState)) {
            return state;
        } else {
            return null;
        }
    }

    /**
     * Analyze the {@link StarLoopEntryState} states in the specified ATN to set
     * the {@link StarLoopEntryState} field to the correct value.
     *
     * @param atn The ATN.
     */
    public markPrecedenceDecisions(atn: ATN): void {
        for (const state of atn.states) {
            if (!(state instanceof StarLoopEntryState)) {
                continue;
            }
            // We analyze the ATN to determine if this ATN decision state is the
            // decision for the closure block that determines whether a
            // precedence rule should continue or complete.
            if (atn.ruleToStartState[state.ruleIndex]!.isPrecedenceRule) {
                const maybeLoopEndState = state.transitions[state.transitions.length - 1].target;
                if (maybeLoopEndState instanceof LoopEndState) {
                    if (maybeLoopEndState.epsilonOnlyTransitions &&
                        (maybeLoopEndState.transitions[0].target instanceof RuleStopState)) {
                        state.precedenceRuleDecision = true;
                    }
                }
            }
        }
    }

    public verifyATN(atn: ATN): void {
        if (!this.deserializationOptions.verifyATN) {
            return;
        }

        // verify assumptions
        for (const state of atn.states) {
            if (state === null) {
                continue;
            }

            this.checkCondition(state.epsilonOnlyTransitions || state.transitions.length <= 1);
            if (state instanceof PlusBlockStartState) {
                this.checkCondition(state.loopBackState !== null);
            } else if (state instanceof StarLoopEntryState) {
                this.checkCondition(state.loopBackState !== null);
                this.checkCondition(state.transitions.length === 2);
                if (state.transitions[0].target instanceof StarBlockStartState) {
                    this.checkCondition(state.transitions[1].target instanceof LoopEndState);
                    this.checkCondition(!state.nonGreedy);
                } else if (state.transitions[0].target instanceof LoopEndState) {
                    this.checkCondition(state.transitions[1].target instanceof StarBlockStartState);
                    this.checkCondition(state.nonGreedy);
                } else {
                    throw new Error("IllegalState");
                }
            } else if (state instanceof StarLoopbackState) {
                this.checkCondition(state.transitions.length === 1);
                this.checkCondition(state.transitions[0].target instanceof StarLoopEntryState);
            } else if (state instanceof LoopEndState) {
                this.checkCondition(state.loopBackState !== null);
            } else if (state instanceof RuleStartState) {
                this.checkCondition(state.stopState !== null);
            } else if (state instanceof BlockStartState) {
                this.checkCondition(state.endState !== null);
            } else if (state instanceof BlockEndState) {
                this.checkCondition(state.startState !== null);
            } else if (state instanceof DecisionState) {
                this.checkCondition(state.transitions.length <= 1 || state.decision >= 0);
            } else {
                this.checkCondition(state.transitions.length <= 1 || (state instanceof RuleStopState));
            }
        }
    }

    public checkCondition(condition: boolean, message?: string): void {
        if (!condition) {
            if (message === undefined || message === null) {
                message = "IllegalState";
            }
            throw (message);
        }
    }

    public readInt(): number {
        return this.data[this.pos++];
    }

    public edgeFactory(atn: ATN, type: number, trg: number, arg1: number, arg2: number,
        arg3: number, sets: IntervalSet[]): Transition {
        const target = atn.states[trg]!;
        switch (type) {
            case TransitionType.EPSILON:
                return new EpsilonTransition(target);
            case TransitionType.RANGE:
                return arg3 !== 0
                    ? new RangeTransition(target, Token.EOF, arg2)
                    : new RangeTransition(target, arg1, arg2);
            case TransitionType.RULE:
                return new RuleTransition(atn.states[arg1]!, arg2, arg3, target);
            case TransitionType.PREDICATE:
                return new PredicateTransition(target, arg1, arg2, arg3 !== 0);
            case TransitionType.PRECEDENCE:
                return new PrecedencePredicateTransition(target, arg1);
            case TransitionType.ATOM:
                return arg3 !== 0 ? new AtomTransition(target, Token.EOF) : new AtomTransition(target, arg1);
            case TransitionType.ACTION:
                return new ActionTransition(target, arg1, arg2, arg3 !== 0);
            case TransitionType.SET:
                return new SetTransition(target, sets[arg1]);
            case TransitionType.NOT_SET:
                return new NotSetTransition(target, sets[arg1]);
            case TransitionType.WILDCARD:
                return new WildcardTransition(target);
            default:
                throw new Error("The specified transition type: " + type + " is not valid.");
        }
    }

    public stateFactory(type: number, ruleIndex: number): ATNState | null {
        if (this.stateFactories === null) {
            const sf: Array<(() => ATNState) | null> = [];
            sf[ATNStateType.INVALID_TYPE] = null;
            sf[ATNStateType.BASIC] = () => { return new BasicState(); };
            sf[ATNStateType.RULE_START] = () => { return new RuleStartState(); };
            sf[ATNStateType.BLOCK_START] = () => { return new BasicBlockStartState(); };
            sf[ATNStateType.PLUS_BLOCK_START] = () => { return new PlusBlockStartState(); };
            sf[ATNStateType.STAR_BLOCK_START] = () => { return new StarBlockStartState(); };
            sf[ATNStateType.TOKEN_START] = () => { return new TokensStartState(); };
            sf[ATNStateType.RULE_STOP] = () => { return new RuleStopState(); };
            sf[ATNStateType.BLOCK_END] = () => { return new BlockEndState(); };
            sf[ATNStateType.STAR_LOOP_BACK] = () => { return new StarLoopbackState(); };
            sf[ATNStateType.STAR_LOOP_ENTRY] = () => { return new StarLoopEntryState(); };
            sf[ATNStateType.PLUS_LOOP_BACK] = () => { return new PlusLoopbackState(); };
            sf[ATNStateType.LOOP_END] = () => { return new LoopEndState(); };
            this.stateFactories = sf;
        }

        if (type > this.stateFactories.length || this.stateFactories[type] === null) {
            throw new Error("The specified state type " + type + " is not valid.");
        } else {
            const s = this.stateFactories[type]?.() ?? null;
            if (s !== null) {
                s.ruleIndex = ruleIndex;

                return s;
            }
        }

        return null;
    }

    public lexerActionFactory(type: number, data1: number, data2: number): LexerAction {
        if (this.actionFactories === null) {
            const af = [];
            af[LexerActionType.CHANNEL] = (data1: number, _data2: number) => {
                return new LexerChannelAction(data1);
            };
            af[LexerActionType.CUSTOM] = (data1: number, data2: number) => {
                return new LexerCustomAction(data1, data2);
            };
            af[LexerActionType.MODE] = (data1: number, _data2: number) => {
                return new LexerModeAction(data1);
            };
            af[LexerActionType.MORE] = (_data1: number, _data2: number) => {
                return LexerMoreAction.INSTANCE;
            };
            af[LexerActionType.POP_MODE] = (_data1: number, _data2: number) => {
                return LexerPopModeAction.INSTANCE;
            };
            af[LexerActionType.PUSH_MODE] = (data1: number, _data2: number) => {
                return new LexerPushModeAction(data1);
            };
            af[LexerActionType.SKIP] = (_data1: number, _data2: number) => {
                return LexerSkipAction.INSTANCE;
            };
            af[LexerActionType.TYPE] = (data1: number, _data2: number) => {
                return new LexerTypeAction(data1);
            };
            this.actionFactories = af;
        }

        if (type > this.actionFactories.length || this.actionFactories[type] === null) {
            throw new Error("The specified lexer action type " + type + " is not valid.");
        } else {
            return this.actionFactories[type](data1, data2);
        }
    }
}
