/*
  * Copyright(c) Terence Parr.All rights reserved.
  * Licensed under the BSD- 3 License.See License.txt in the project root for license information.
  */

/* eslint-disable jsdoc/require-returns */

import { Token } from "../Token.js";
import type { IntervalSet } from "../misc/IntervalSet.js";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator.js";
import { OrderedHashMap } from "../misc/OrderedHashMap.js";
import { ATN } from "./ATN.js";
import { ATNDeserializer } from "./ATNDeserializer.js";
import { ATNState } from "./ATNState.js";
import type { ActionTransition } from "./ActionTransition.js";
import type { AtomTransition } from "./AtomTransition.js";
import { BlockStartState } from "./BlockStartState.js";
import { DecisionState } from "./DecisionState.js";
import { LexerActionType } from "./LexerActionType.js";
import type { LexerChannelAction } from "./LexerChannelAction.js";
import type { LexerCustomAction } from "./LexerCustomAction.js";
import type { LexerModeAction } from "./LexerModeAction.js";
import type { LexerPushModeAction } from "./LexerPushModeAction.js";
import type { LexerTypeAction } from "./LexerTypeAction.js";
import type { LoopEndState } from "./LoopEndState.js";
import type { PrecedencePredicateTransition } from "./PrecedencePredicateTransition.js";
import type { PredicateTransition } from "./PredicateTransition.js";
import type { RangeTransition } from "./RangeTransition.js";
import { RuleStartState } from "./RuleStartState.js";
import type { RuleTransition } from "./RuleTransition.js";
import type { SetTransition } from "./SetTransition.js";
import { Transition } from "./Transition.js";

/**
 * This class represents a target neutral serializer for ATNs. An ATN is converted to a list of integers
 *  that can be converted back to and ATN. We compute the list of integers and then generate an array
 *  into the target language for a particular lexer or parser.  Java is a special case where we must
 *  generate strings instead of arrays, but that is handled outside of this class.
 */
export class ATNSerializer {
    public atn: ATN;

    private readonly data: number[] = [];

    // Note that we use a LinkedHashMap as a set to maintain insertion order while deduplicating entries with the
    // same key.
    private sets = new OrderedHashMap<IntervalSet, boolean>(ObjectEqualityComparator.instance);
    private readonly nonGreedyStates: number[] = [];
    private readonly precedenceStates: number[] = [];

    public constructor(atn: ATN) {
        this.atn = atn;
    }

    public static getSerialized(atn: ATN): number[] {
        return new ATNSerializer(atn).serialize();
    }

    private static serializeSets(data: number[], sets: IntervalSet[]): void {
        data.push(sets.length);

        for (const set of sets) {
            const containsEof = set.contains(Token.EOF);
            if (containsEof && set.get(0).stop === Token.EOF) {
                data.push(set.length - 1);
            } else {
                data.push(set.length);
            }

            data.push(containsEof ? 1 : 0);
            for (const interval of set) {
                if (interval.start === Token.EOF) {
                    if (interval.stop === Token.EOF) {
                        continue;
                    } else {
                        data.push(0);
                    }
                } else {
                    data.push(interval.start);
                }

                data.push(interval.stop);
            }
        }
    };

    /**
     * Serialize state descriptors, edge descriptors, and decision -> state map
     *  into list of ints.  Likely out of date, but keeping as it could be helpful:
     *
     *      SERIALIZED_VERSION
     *      UUID (2 longs)
     * 		grammar-type, (ANTLRParser.LEXER, ...)
     *  	max token type,
     *  	num states,
     *  	state-0-type ruleIndex, state-1-type ruleIndex, ... state-i-type ruleIndex optional-arg ...
     *  	num rules,
     *  	rule-1-start-state rule-1-args, rule-2-start-state  rule-2-args, ...
     *  	(args are token type,actionIndex in lexer else 0,0)
     *      num modes,
     *      mode-0-start-state, mode-1-start-state, ... (parser has 0 modes)
     *      num unicode-bmp-sets
     *      bmp-set-0-interval-count intervals, bmp-set-1-interval-count intervals, ...
     *      num unicode-smp-sets
     *      smp-set-0-interval-count intervals, smp-set-1-interval-count intervals, ...
     *	num total edges,
     *      src, trg, edge-type, edge arg1, optional edge arg2 (present always), ...
     *      num decisions,
     *      decision-0-start-state, decision-1-start-state, ...
     *
     *  Convenient to pack into unsigned shorts to make as Java string.
     */
    public serialize(): number[] {
        this.addPreamble();
        const edgeCount = this.addEdges();
        this.addNonGreedyStates();
        this.addPrecedenceStates();
        this.addRuleStatesAndLexerTokenTypes();
        this.addModeStartStates();

        let setIndices = null;
        setIndices = this.addSets();
        this.addEdges(edgeCount, setIndices);
        this.addDecisionStartStates();
        this.addLexerActions();

        return this.data;
    }

    private addPreamble(): void {
        this.data.push(ATNDeserializer.SERIALIZED_VERSION);

        // convert grammar type to ATN const to avoid dependence on ANTLRParser
        this.data.push(this.atn.grammarType);
        this.data.push(this.atn.maxTokenType);
    }

    private addLexerActions(): void {
        if (this.atn.grammarType === ATN.LEXER) {
            this.data.push(this.atn.lexerActions.length);
            for (const action of this.atn.lexerActions) {
                this.data.push(action.actionType);
                switch (action.actionType) {
                    case LexerActionType.CHANNEL: {
                        const channel = (action as LexerChannelAction).channel;
                        this.data.push(channel);
                        this.data.push(0);
                        break;
                    }

                    case LexerActionType.CUSTOM: {
                        const ruleIndex = (action as LexerCustomAction).ruleIndex;
                        const actionIndex = (action as LexerCustomAction).actionIndex;
                        this.data.push(ruleIndex);
                        this.data.push(actionIndex);
                        break;
                    }

                    case LexerActionType.MODE: {
                        const mode = (action as LexerModeAction).mode;
                        this.data.push(mode);
                        this.data.push(0);
                        break;
                    }

                    case LexerActionType.MORE: {
                        this.data.push(0);
                        this.data.push(0);
                        break;
                    }

                    case LexerActionType.POP_MODE: {
                        this.data.push(0);
                        this.data.push(0);
                        break;
                    }

                    case LexerActionType.PUSH_MODE: {
                        const mode = (action as LexerPushModeAction).mode;
                        this.data.push(mode);
                        this.data.push(0);
                        break;
                    }

                    case LexerActionType.SKIP: {
                        this.data.push(0);
                        this.data.push(0);
                        break;
                    }

                    case LexerActionType.TYPE: {
                        const type = (action as LexerTypeAction).type;
                        this.data.push(type);
                        this.data.push(0);
                        break;
                    }

                    default: {
                        throw new Error(`The specified lexer action type ${action.actionType} is not valid.`);
                    }

                }
            }
        }
    }

    private addDecisionStartStates(): void {
        this.data.push(this.atn.decisionToState.length);
        for (const decStartState of this.atn.decisionToState) {
            this.data.push(decStartState.stateNumber);
        }
    }

    private addEdges(): number;
    private addEdges(edgeCount: number, setIndices: Map<IntervalSet, number>): void;
    private addEdges(...args: unknown[]): number | void {
        switch (args.length) {
            case 0: {

                let edgeCount = 0;
                this.data.push(this.atn.states.length);
                for (const s of this.atn.states) {
                    if (s === null) { // might be optimized away
                        this.data.push(ATNState.INVALID_TYPE);
                        continue;
                    }

                    const stateType = (s.constructor as typeof ATNState).stateType;
                    if (s instanceof DecisionState && s.nonGreedy) {
                        this.nonGreedyStates.push(s.stateNumber);
                    }

                    if (s instanceof RuleStartState && s.isLeftRecursiveRule) {
                        this.precedenceStates.push(s.stateNumber);
                    }

                    this.data.push(stateType);

                    this.data.push(s.ruleIndex);

                    if ((s.constructor as typeof ATNState).stateType === ATNState.LOOP_END) {
                        this.data.push((s as LoopEndState).loopBackState!.stateNumber);
                    } else {
                        if (s instanceof BlockStartState) {
                            this.data.push(s.endState!.stateNumber);
                        }
                    }

                    if ((s.constructor as typeof ATNState).stateType !== ATNState.RULE_STOP) {
                        // the deserializer can trivially derive these edges, so there's no need to serialize them
                        edgeCount += s.transitions.length;
                    }

                    for (const t of s.transitions) {
                        const edgeType = t.transitionType;
                        if (edgeType === Transition.SET || edgeType === Transition.NOT_SET) {
                            const st = t as SetTransition;
                            this.sets.set(st.set, true);
                        }
                    }
                }

                return edgeCount;
            }

            case 2: {
                const [edgeCount, setIndices] = args as [number, Map<IntervalSet, number>];

                this.data.push(edgeCount);
                for (const s of this.atn.states) {
                    if (s === null) {
                        // might be optimized away
                        continue;
                    }

                    if ((s.constructor as typeof ATNState).stateType === ATNState.RULE_STOP) {
                        continue;
                    }

                    for (const t of s.transitions) {
                        if (this.atn.states[t.target.stateNumber] === null) {
                            throw new Error("Cannot serialize a transition to a removed state.");
                        }

                        const src = s.stateNumber;
                        let trg = t.target.stateNumber;
                        const edgeType = t.transitionType;
                        let arg1 = 0;
                        let arg2 = 0;
                        let arg3 = 0;
                        switch (edgeType) {
                            case Transition.RULE: {
                                trg = (t as RuleTransition).followState.stateNumber;
                                arg1 = (t as RuleTransition).target.stateNumber;
                                arg2 = (t as RuleTransition).ruleIndex;
                                arg3 = (t as RuleTransition).precedence;
                                break;
                            }

                            case Transition.PRECEDENCE: {
                                const ppt = t as PrecedencePredicateTransition;
                                arg1 = ppt.precedence;
                                break;
                            }

                            case Transition.PREDICATE: {
                                const pt = t as PredicateTransition;
                                arg1 = pt.ruleIndex;
                                arg2 = pt.predIndex;
                                arg3 = pt.isCtxDependent ? 1 : 0;
                                break;
                            }

                            case Transition.RANGE: {
                                arg1 = (t as RangeTransition).start;
                                arg2 = (t as RangeTransition).stop;
                                if (arg1 === Token.EOF) {
                                    arg1 = 0;
                                    arg3 = 1;
                                }
                                break;
                            }

                            case Transition.ATOM: {
                                arg1 = (t as AtomTransition).labelValue;
                                if (arg1 === Token.EOF) {
                                    arg1 = 0;
                                    arg3 = 1;
                                }
                                break;
                            }

                            case Transition.ACTION: {
                                const at = t as ActionTransition;
                                arg1 = at.ruleIndex;
                                arg2 = at.actionIndex;
                                arg3 = at.isCtxDependent ? 1 : 0;
                                break;
                            }

                            case Transition.SET: {
                                arg1 = setIndices.get((t as SetTransition).set)!;
                                break;
                            }

                            case Transition.NOT_SET: {
                                arg1 = setIndices.get((t as SetTransition).set)!;
                                break;
                            }

                            case Transition.WILDCARD: {
                                break;
                            }

                            default:

                        }

                        this.data.push(src);
                        this.data.push(trg);
                        this.data.push(edgeType);
                        this.data.push(arg1);
                        this.data.push(arg2);
                        this.data.push(arg3);
                    }
                }

                break;
            }

            default: {
                throw new Error("Invalid number of arguments");
            }
        }
    }

    private addSets(): Map<IntervalSet, number> {
        ATNSerializer.serializeSets(this.data, [...this.sets.keys()]);
        const setIndices = new Map<IntervalSet, number>();
        let setIndex = 0;
        for (const s of this.sets.keys()) {
            setIndices.set(s, setIndex++);
        }

        return setIndices;
    }

    private addModeStartStates(): void {
        const modeCount = this.atn.modeToStartState.length;
        this.data.push(modeCount);
        if (modeCount > 0) {
            for (const modeStartState of this.atn.modeToStartState) {
                this.data.push(modeStartState!.stateNumber);
            }
        }
    }

    private addRuleStatesAndLexerTokenTypes(): void {
        const ruleCount = this.atn.ruleToStartState.length;
        this.data.push(ruleCount);
        for (let r = 0; r < ruleCount; r++) {
            const ruleStartState = this.atn.ruleToStartState[r];
            this.data.push(ruleStartState!.stateNumber);
            if (this.atn.grammarType === ATN.LEXER) {
                this.data.push(this.atn.ruleToTokenType[r]);
            }
        }
    }

    private addPrecedenceStates(): void {
        this.data.push(this.precedenceStates.length);
        for (const state of this.precedenceStates) {
            this.data.push(state);
        }
    }

    private addNonGreedyStates(): void {
        this.data.push(this.nonGreedyStates.length);
        for (const state of this.nonGreedyStates) {
            this.data.push(state);
        }
    }
}
