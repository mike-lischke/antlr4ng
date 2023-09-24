/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from '../Token.js';
import { ATN } from './ATN.js';
import { ATNType } from './ATNType.js';

import { BasicState } from './BasicState.js';
import { DecisionState } from './DecisionState.js';
import { BlockStartState } from './BlockStartState.js';
import { BlockEndState } from './BlockEndState.js';
import { LoopEndState } from './LoopEndState.js';
import { RuleStartState } from './RuleStartState.js';
import { RuleStopState } from './RuleStopState.js';
import { TokensStartState } from './TokensStartState.js';
import { PlusLoopbackState } from './PlusLoopbackState.js';
import { StarLoopbackState } from './StarLoopbackState.js';
import { StarLoopEntryState } from './StarLoopEntryState.js';
import { PlusBlockStartState } from './PlusBlockStartState.js';
import { StarBlockStartState } from './StarBlockStartState.js';
import { BasicBlockStartState } from './BasicBlockStartState.js';

import { AtomTransition } from './AtomTransition.js';
import { SetTransition } from './SetTransition.js';
import { NotSetTransition } from './NotSetTransition.js';
import { RuleTransition } from './RuleTransition.js';
import { RangeTransition } from './RangeTransition.js';
import { ActionTransition } from './ActionTransition.js';
import { EpsilonTransition } from './EpsilonTransition.js';
import { WildcardTransition } from './WildcardTransition.js';
import { PredicateTransition } from './PredicateTransition.js';
import { PrecedencePredicateTransition } from './PrecedencePredicateTransition.js';

import { IntervalSet } from '../misc/IntervalSet.js';
import { ATNDeserializationOptions } from './ATNDeserializationOptions.js';

import { LexerActionType } from './LexerActionType.js';
import { LexerSkipAction } from './LexerSkipAction.js';
import { LexerChannelAction } from './LexerChannelAction.js';
import { LexerCustomAction } from './LexerCustomAction.js';
import { LexerMoreAction } from './LexerMoreAction.js';
import { LexerTypeAction } from './LexerTypeAction.js';
import { LexerPushModeAction } from './LexerPushModeAction.js';
import { LexerPopModeAction } from './LexerPopModeAction.js';
import { LexerModeAction } from './LexerModeAction.js';
import { ATNStateType } from "./ATNStateType.js";
import { TransitionType } from "./TransitionType.js";

const SERIALIZED_VERSION = 4;

function initArray(length: any, value: any) {
    const tmp = [];
    tmp[length - 1] = value;
    return tmp.map(function (i) { return value; });
}

export class ATNDeserializer {
    actionFactories: any;
    data: any;
    deserializationOptions: any;
    pos: any;
    stateFactories: any;
    constructor(options: any) {
        if (options === undefined || options === null) {
            // @ts-expect-error TS(2339): Property 'defaultOptions' does not exist on type '... Remove this comment to see the full error message
            options = ATNDeserializationOptions.defaultOptions;
        }
        this.deserializationOptions = options;
        this.stateFactories = null;
        this.actionFactories = null;
    }

    deserialize(data: any) {
        const legacy = this.reset(data);
        this.checkVersion(legacy);
        if (legacy)
            this.skipUUID();
        const atn = this.readATN();
        this.readStates(atn, legacy);
        this.readRules(atn, legacy);
        this.readModes(atn);
        const sets: any = [];
        this.readSets(atn, sets, this.readInt.bind(this));
        if (legacy)
            this.readSets(atn, sets, this.readInt32.bind(this));
        this.readEdges(atn, sets);
        this.readDecisions(atn);
        this.readLexerActions(atn, legacy);
        this.markPrecedenceDecisions(atn);
        this.verifyATN(atn);
        if (this.deserializationOptions.generateRuleBypassTransitions && atn.grammarType === ATNType.PARSER) {
            this.generateRuleBypassTransitions(atn);
            // re-verify after modification
            this.verifyATN(atn);
        }
        return atn;
    }

    reset(data: any) {
        const version = data.charCodeAt ? data.charCodeAt(0) : data[0];
        if (version === SERIALIZED_VERSION - 1) {
            const adjust = function (c: any) {
                const v = c.charCodeAt(0);
                return v > 1 ? v - 2 : v + 65534;
            };
            const temp = data.split("").map(adjust);
            // don't adjust the first value since that's the version number
            temp[0] = data.charCodeAt(0);
            this.data = temp;
            this.pos = 0;
            return true;
        } else {
            this.data = data;
            this.pos = 0;
            return false;
        }
    }

    skipUUID() {
        let count = 0;
        while (count++ < 8)
            this.readInt();
    }

    checkVersion(legacy: any) {
        const version = this.readInt();
        if (!legacy && version !== SERIALIZED_VERSION) {
            throw ("Could not deserialize ATN with version " + version + " (expected " + SERIALIZED_VERSION + ").");
        }
    }

    readATN() {
        const grammarType = this.readInt();
        const maxTokenType = this.readInt();
        return new ATN(grammarType, maxTokenType);
    }

    readStates(atn: any, legacy: any) {
        let j, pair, stateNumber;
        const loopBackStateNumbers = [];
        const endStateNumbers = [];
        const nstates = this.readInt();
        for (let i = 0; i < nstates; i++) {
            const stype = this.readInt();
            // ignore bad type of states
            if (stype === ATNStateType.INVALID_TYPE) {
                atn.addState(null);
                continue;
            }
            let ruleIndex = this.readInt();
            if (legacy && ruleIndex === 0xFFFF) {
                ruleIndex = -1;
            }
            const s = this.stateFactory(stype, ruleIndex);
            if (stype === ATNStateType.LOOP_END) { // special case
                const loopBackStateNumber = this.readInt();
                loopBackStateNumbers.push([s, loopBackStateNumber]);
            } else if (s instanceof BlockStartState) {
                const endStateNumber = this.readInt();
                endStateNumbers.push([s, endStateNumber]);
            }
            atn.addState(s);
        }
        // delay the assignment of loop back and end states until we know all the
        // state instances have been initialized
        for (j = 0; j < loopBackStateNumbers.length; j++) {
            pair = loopBackStateNumbers[j];
            pair[0].loopBackState = atn.states[pair[1]];
        }

        for (j = 0; j < endStateNumbers.length; j++) {
            pair = endStateNumbers[j];
            pair[0].endState = atn.states[pair[1]];
        }

        let numNonGreedyStates = this.readInt();
        for (j = 0; j < numNonGreedyStates; j++) {
            stateNumber = this.readInt();
            atn.states[stateNumber].nonGreedy = true;
        }

        let numPrecedenceStates = this.readInt();
        for (j = 0; j < numPrecedenceStates; j++) {
            stateNumber = this.readInt();
            atn.states[stateNumber].isPrecedenceRule = true;
        }
    }

    readRules(atn: any, legacy: any) {
        let i;
        const nrules = this.readInt();
        if (atn.grammarType === ATNType.LEXER) {
            atn.ruleToTokenType = initArray(nrules, 0);
        }
        atn.ruleToStartState = initArray(nrules, 0);
        for (i = 0; i < nrules; i++) {
            const s = this.readInt();
            atn.ruleToStartState[i] = atn.states[s];
            if (atn.grammarType === ATNType.LEXER) {
                let tokenType = this.readInt();
                if (legacy && tokenType === 0xFFFF) {
                    // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                    tokenType = Token.EOF;
                }
                atn.ruleToTokenType[i] = tokenType;
            }
        }
        atn.ruleToStopState = initArray(nrules, 0);
        for (i = 0; i < atn.states.length; i++) {
            const state = atn.states[i];
            if (!(state instanceof RuleStopState)) {
                continue;
            }
            atn.ruleToStopState[state.ruleIndex] = state;
            atn.ruleToStartState[state.ruleIndex].stopState = state;
        }
    }

    readModes(atn: any) {
        const nmodes = this.readInt();
        for (let i = 0; i < nmodes; i++) {
            let s = this.readInt();
            atn.modeToStartState.push(atn.states[s]);
        }
    }

    readSets(atn: any, sets: any, reader: any) {
        const m = this.readInt();
        for (let i = 0; i < m; i++) {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            const iset = new IntervalSet();
            sets.push(iset);
            const n = this.readInt();
            const containsEof = this.readInt();
            if (containsEof !== 0) {
                iset.addOne(-1);
            }
            for (let j = 0; j < n; j++) {
                const i1 = reader();
                const i2 = reader();
                iset.addRange(i1, i2);
            }
        }
    }

    readEdges(atn: any, sets: any) {
        let i, j, state, trans, target;
        const nedges = this.readInt();
        for (i = 0; i < nedges; i++) {
            const src = this.readInt();
            const trg = this.readInt();
            const ttype = this.readInt();
            const arg1 = this.readInt();
            const arg2 = this.readInt();
            const arg3 = this.readInt();
            trans = this.edgeFactory(atn, ttype, src, trg, arg1, arg2, arg3, sets);
            const srcState = atn.states[src];
            srcState.addTransition(trans);
        }
        // edges for rule stop states can be derived, so they aren't serialized
        for (i = 0; i < atn.states.length; i++) {
            state = atn.states[i];
            for (j = 0; j < state.transitions.length; j++) {
                const t = state.transitions[j];
                if (!(t instanceof RuleTransition)) {
                    continue;
                }
                let outermostPrecedenceReturn = -1;
                if (atn.ruleToStartState[t.target.ruleIndex].isPrecedenceRule) {
                    if (t.precedence === 0) {
                        outermostPrecedenceReturn = t.target.ruleIndex;
                    }
                }

                trans = new EpsilonTransition(t.followState, outermostPrecedenceReturn);
                atn.ruleToStopState[t.target.ruleIndex].addTransition(trans);
            }
        }

        for (i = 0; i < atn.states.length; i++) {
            state = atn.states[i];
            if (state instanceof BlockStartState) {
                // we need to know the end state to set its start state
                if (state.endState === null) {
                    throw ("IllegalState");
                }
                // block end states can only be associated to a single block start
                // state
                if (state.endState.startState) {
                    throw ("IllegalState");
                }
                state.endState.startState = state;
            }
            if (state instanceof PlusLoopbackState) {
                for (j = 0; j < state.transitions.length; j++) {
                    target = state.transitions[j].target;
                    if (target instanceof PlusBlockStartState) {
                        // @ts-expect-error TS(2339): Property 'loopBackState' does not exist on type 'P... Remove this comment to see the full error message
                        target.loopBackState = state;
                    }
                }
            } else if (state instanceof StarLoopbackState) {
                for (j = 0; j < state.transitions.length; j++) {
                    target = state.transitions[j].target;
                    if (target instanceof StarLoopEntryState) {
                        // @ts-expect-error TS(2339): Property 'loopBackState' does not exist on type 'S... Remove this comment to see the full error message
                        target.loopBackState = state;
                    }
                }
            }
        }
    }

    readDecisions(atn: any) {
        const ndecisions = this.readInt();
        for (let i = 0; i < ndecisions; i++) {
            const s = this.readInt();
            const decState = atn.states[s];
            atn.decisionToState.push(decState);
            decState.decision = i;
        }
    }

    readLexerActions(atn: any, legacy: any) {
        if (atn.grammarType === ATNType.LEXER) {
            const count = this.readInt();
            atn.lexerActions = initArray(count, null);
            for (let i = 0; i < count; i++) {
                const actionType = this.readInt();
                let data1 = this.readInt();
                if (legacy && data1 === 0xFFFF) {
                    data1 = -1;
                }
                let data2 = this.readInt();
                if (legacy && data2 === 0xFFFF) {
                    data2 = -1;
                }
                atn.lexerActions[i] = this.lexerActionFactory(actionType, data1, data2);
            }
        }
    }

    generateRuleBypassTransitions(atn: any) {
        let i;
        const count = atn.ruleToStartState.length;
        for (i = 0; i < count; i++) {
            atn.ruleToTokenType[i] = atn.maxTokenType + i + 1;
        }
        for (i = 0; i < count; i++) {
            this.generateRuleBypassTransition(atn, i);
        }
    }

    generateRuleBypassTransition(atn: any, idx: any) {
        let i, state;
        const bypassStart = new BasicBlockStartState();
        bypassStart.ruleIndex = idx;
        atn.addState(bypassStart);

        const bypassStop = new BlockEndState();
        bypassStop.ruleIndex = idx;
        atn.addState(bypassStop);

        bypassStart.endState = bypassStop;
        atn.defineDecisionState(bypassStart);

        // @ts-expect-error TS(2339): Property 'startState' does not exist on type 'Bloc... Remove this comment to see the full error message
        bypassStop.startState = bypassStart;

        let excludeTransition = null;
        let endState = null;

        if (atn.ruleToStartState[idx].isPrecedenceRule) {
            // wrap from the beginning of the rule to the StarLoopEntryState
            endState = null;
            for (i = 0; i < atn.states.length; i++) {
                state = atn.states[i];
                if (this.stateIsEndStateFor(state, idx)) {
                    endState = state;
                    excludeTransition = state.loopBackState.transitions[0];
                    break;
                }
            }
            if (excludeTransition === null) {
                throw ("Couldn't identify final state of the precedence rule prefix section.");
            }
        } else {
            endState = atn.ruleToStopState[idx];
        }

        // all non-excluded transitions that currently target end state need to
        // target blockEnd instead
        for (i = 0; i < atn.states.length; i++) {
            state = atn.states[i];
            for (let j = 0; j < state.transitions.length; j++) {
                const transition = state.transitions[j];
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
        const ruleToStartState = atn.ruleToStartState[idx];
        const count = ruleToStartState.transitions.length;
        while (count > 0) {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            bypassStart.addTransition(ruleToStartState.transitions[count - 1]);
            ruleToStartState.transitions = ruleToStartState.transitions.slice(-1);
        }
        // link the new states
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        atn.ruleToStartState[idx].addTransition(new EpsilonTransition(bypassStart));
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        bypassStop.addTransition(new EpsilonTransition(endState));

        const matchState = new BasicState();
        atn.addState(matchState);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        matchState.addTransition(new AtomTransition(bypassStop, atn.ruleToTokenType[idx]));
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        bypassStart.addTransition(new EpsilonTransition(matchState));
    }

    stateIsEndStateFor(state: any, idx: any) {
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
     * @param atn The ATN.
     */
    markPrecedenceDecisions(atn: any) {
        for (let i = 0; i < atn.states.length; i++) {
            const state = atn.states[i];
            if (!(state instanceof StarLoopEntryState)) {
                continue;
            }
            // We analyze the ATN to determine if this ATN decision state is the
            // decision for the closure block that determines whether a
            // precedence rule should continue or complete.
            if (atn.ruleToStartState[state.ruleIndex].isPrecedenceRule) {
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

    verifyATN(atn: any) {
        if (!this.deserializationOptions.verifyATN) {
            return;
        }
        // verify assumptions
        for (let i = 0; i < atn.states.length; i++) {
            const state = atn.states[i];
            if (state === null) {
                continue;
            }
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            this.checkCondition(state.epsilonOnlyTransitions || state.transitions.length <= 1);
            if (state instanceof PlusBlockStartState) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.loopBackState !== null);
            } else if (state instanceof StarLoopEntryState) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.loopBackState !== null);
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.transitions.length === 2);
                if (state.transitions[0].target instanceof StarBlockStartState) {
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                    this.checkCondition(state.transitions[1].target instanceof LoopEndState);
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                    this.checkCondition(!state.nonGreedy);
                } else if (state.transitions[0].target instanceof LoopEndState) {
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                    this.checkCondition(state.transitions[1].target instanceof StarBlockStartState);
                    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                    this.checkCondition(state.nonGreedy);
                } else {
                    throw ("IllegalState");
                }
            } else if (state instanceof StarLoopbackState) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.transitions.length === 1);
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.transitions[0].target instanceof StarLoopEntryState);
            } else if (state instanceof LoopEndState) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.loopBackState !== null);
            } else if (state instanceof RuleStartState) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.stopState !== null);
            } else if (state instanceof BlockStartState) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.endState !== null);
            } else if (state instanceof BlockEndState) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.startState !== null);
            } else if (state instanceof DecisionState) {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.transitions.length <= 1 || state.decision >= 0);
            } else {
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                this.checkCondition(state.transitions.length <= 1 || (state instanceof RuleStopState));
            }
        }
    }

    checkCondition(condition: any, message: any) {
        if (!condition) {
            if (message === undefined || message === null) {
                message = "IllegalState";
            }
            throw (message);
        }
    }

    readInt() {
        return this.data[this.pos++];
    }

    readInt32() {
        const low = this.readInt();
        const high = this.readInt();
        return low | (high << 16);
    }

    edgeFactory(atn: any, type: any, src: any, trg: any, arg1: any, arg2: any, arg3: any, sets: any) {
        const target = atn.states[trg];
        switch (type) {
            case TransitionType.EPSILON:
                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
                return new EpsilonTransition(target);
            case TransitionType.RANGE:
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                return arg3 !== 0 ? new RangeTransition(target, Token.EOF, arg2) : new RangeTransition(target, arg1, arg2);
            case TransitionType.RULE:
                return new RuleTransition(atn.states[arg1], arg2, arg3, target);
            case TransitionType.PREDICATE:
                return new PredicateTransition(target, arg1, arg2, arg3 !== 0);
            case TransitionType.PRECEDENCE:
                return new PrecedencePredicateTransition(target, arg1);
            case TransitionType.ATOM:
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
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
                throw "The specified transition type: " + type + " is not valid.";
        }
    }

    stateFactory(type: any, ruleIndex: any) {
        if (this.stateFactories === null) {
            const sf = [];
            sf[ATNStateType.INVALID_TYPE] = null;
            sf[ATNStateType.BASIC] = () => new BasicState();
            sf[ATNStateType.RULE_START] = () => new RuleStartState();
            sf[ATNStateType.BLOCK_START] = () => new BasicBlockStartState();
            sf[ATNStateType.PLUS_BLOCK_START] = () => new PlusBlockStartState();
            sf[ATNStateType.STAR_BLOCK_START] = () => new StarBlockStartState();
            sf[ATNStateType.TOKEN_START] = () => new TokensStartState();
            sf[ATNStateType.RULE_STOP] = () => new RuleStopState();
            sf[ATNStateType.BLOCK_END] = () => new BlockEndState();
            sf[ATNStateType.STAR_LOOP_BACK] = () => new StarLoopbackState();
            sf[ATNStateType.STAR_LOOP_ENTRY] = () => new StarLoopEntryState();
            sf[ATNStateType.PLUS_LOOP_BACK] = () => new PlusLoopbackState();
            sf[ATNStateType.LOOP_END] = () => new LoopEndState();
            this.stateFactories = sf;
        }

        if (type > this.stateFactories.length || this.stateFactories[type] === null) {
            throw ("The specified state type " + type + " is not valid.");
        } else {
            const s = this.stateFactories[type]();
            if (s !== null) {
                s.ruleIndex = ruleIndex;
                return s;
            }
        }
    }

    lexerActionFactory(type: any, data1: any, data2: any) {
        if (this.actionFactories === null) {
            const af = [];
            af[LexerActionType.CHANNEL] = (data1: any, data2: any) => new LexerChannelAction(data1);
            af[LexerActionType.CUSTOM] = (data1: any, data2: any) => new LexerCustomAction(data1, data2);
            af[LexerActionType.MODE] = (data1: any, data2: any) => new LexerModeAction(data1);
            // @ts-expect-error TS(2339): Property 'INSTANCE' does not exist on type 'typeof... Remove this comment to see the full error message
            af[LexerActionType.MORE] = (data1: any, data2: any) => LexerMoreAction.INSTANCE;
            // @ts-expect-error TS(2339): Property 'INSTANCE' does not exist on type 'typeof... Remove this comment to see the full error message
            af[LexerActionType.POP_MODE] = (data1: any, data2: any) => LexerPopModeAction.INSTANCE;
            af[LexerActionType.PUSH_MODE] = (data1: any, data2: any) => new LexerPushModeAction(data1);
            // @ts-expect-error TS(2339): Property 'INSTANCE' does not exist on type 'typeof... Remove this comment to see the full error message
            af[LexerActionType.SKIP] = (data1: any, data2: any) => LexerSkipAction.INSTANCE;
            af[LexerActionType.TYPE] = (data1: any, data2: any) => new LexerTypeAction(data1);
            this.actionFactories = af;
        }
        if (type > this.actionFactories.length || this.actionFactories[type] === null) {
            throw ("The specified lexer action type " + type + " is not valid.");
        } else {
            return this.actionFactories[type](data1, data2);
        }
    }
}
