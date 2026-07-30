/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFASerializer } from "./DFASerializer.js";
import { DFAState } from "./DFAState.js";
import { LexerDFASerializer } from "./LexerDFASerializer.js";
import { Vocabulary } from "../Vocabulary.js";
import { DecisionState } from "../atn/DecisionState.js";
import { StarLoopEntryState } from "../atn/StarLoopEntryState.js";
import type { ATNConfigSet } from "../index.js";

export class DFA {
    public s0?: DFAState;

    public readonly decision: number;

    /** From which ATN state did we create this DFA? */
    public readonly atnStartState: DecisionState | null;

    /**
     * Gets whether this DFA is a precedence DFA. Precedence DFAs use a special
     * start state {@link #s0} which is not stored in {@link #states}. The
     * {@link DFAState#edges} array for this start state contains outgoing edges
     * supplying individual start states corresponding to specific precedence
     * values.
     *
     * @returns `true` if this is a precedence DFA; otherwise, `false`.
     */
    public readonly isPrecedenceDfa: boolean;

    /**
     * A mapping from an ATNConfigSet hash to the DFA states whose configuration sets carry that
     * hash. Used to quickly look up the DFA state for a particular configuration set.
     *
     * Each entry is a bucket rather than a single state because a 32-bit hash is not injective:
     * two different configuration sets can share one. Buckets are disambiguated with
     * {@link DFAState.equals}, so a state is only ever returned for the configuration set it was
     * actually computed from. Resolving collisions is required for correctness, not merely for
     * hygiene — handing back a state that describes a *different* configuration set makes the
     * simulator follow the wrong decision, which surfaces as a spurious "no viable alternative"
     * on input that parses fine on its own. Because the DFA is cached across parses (the
     * generated recognizers share one `decisionToDFA` array), such a state also persists, so
     * whichever input populates a bucket first can permanently break a later one.
     */
    private states = new Map<number, DFAState[]>();

    /** Counts the states in {@link states}, so insertion can number them without a scan. */
    private stateCount = 0;

    public constructor(atnStartState: DecisionState | null, decision?: number) {
        this.atnStartState = atnStartState;
        this.decision = decision ?? 0;

        let precedenceDfa = false;
        if (atnStartState instanceof StarLoopEntryState) {
            if (atnStartState.precedenceRuleDecision) {
                precedenceDfa = true;
                this.s0 = DFAState.fromState(-1);
            }
        }

        this.isPrecedenceDfa = precedenceDfa;
    }

    public [Symbol.iterator] = (): Iterator<DFAState> => {
        return this.getStates()[Symbol.iterator]();
    };

    /**
     * Get the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
      @returns The start state corresponding to the specified precedence, or
     * `null` if no start state exists for the specified precedence.
     *
     * @throws IllegalStateException if this is not a precedence DFA.
     * @see #isPrecedenceDfa
     */
    public readonly getPrecedenceStartState = (precedence: number): DFAState | undefined => {
        if (!this.isPrecedenceDfa) {
            throw new Error(`Only precedence DFAs may contain a precedence start state.`);
        }

        // s0.edges is never null for a precedence DFA
        if (!this.s0 || !this.s0.edges || precedence < 0 || precedence >= this.s0.edges.length) {
            return undefined;
        }

        return this.s0.edges[precedence];
    };

    /**
     * Set the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
     * @param startState The start state corresponding to the specified precedence.
     */
    public readonly setPrecedenceStartState = (precedence: number, startState: DFAState): void => {
        if (!this.isPrecedenceDfa) {
            throw new Error(`Only precedence DFAs may contain a precedence start state.`);
        }

        if (precedence < 0 || !this.s0) {
            return;
        }

        // Synchronization on s0 here is ok. when the DFA is turned into a
        // precedence DFA, s0 will be initialized once and not updated again.
        this.s0.edges[precedence] = startState;
    };

    /**
     * @returns a list of all states in this DFA, ordered by state number.
     */
    public getStates(): DFAState[] {
        const result: DFAState[] = [];
        for (const bucket of this.states.values()) {
            result.push(...bucket);
        }

        result.sort((o1: DFAState, o2: DFAState): number => {
            return o1.stateNumber - o2.stateNumber;
        });

        return result;
    };

    public getState(state: DFAState): DFAState | null {
        return this.getStateForConfigs(state.configs);
    }

    public getStateForConfigs(configs: ATNConfigSet): DFAState | null {
        const bucket = this.states.get(configs.hashCode());
        if (bucket) {
            for (const state of bucket) {
                if (state.configs === configs || state.configs.equals(configs)) {
                    return state;
                }
            }
        }

        return null;
    }

    public addState(state: DFAState): void {
        const hash = state.configs.hashCode();
        let bucket = this.states.get(hash);
        if (!bucket) {
            bucket = [];
            this.states.set(hash, bucket);
        }

        for (const existing of bucket) {
            if (DFAState.equals(existing, state)) {
                return;
            }
        }

        bucket.push(state);
        state.stateNumber = this.stateCount++;
    }

    public toString(vocabulary?: Vocabulary): string {
        if (!vocabulary) {
            return this.toString(Vocabulary.EMPTY_VOCABULARY);
        }

        if (!this.s0) {
            return "";
        }

        const serializer = new DFASerializer(this, vocabulary);

        return serializer.toString() ?? "";
    }

    public toLexerString(): string {
        if (!this.s0) {
            return "";
        }

        const serializer = new LexerDFASerializer(this);

        return serializer.toString() ?? "";
    };

    public get length(): number {
        return this.stateCount;
    }
}
