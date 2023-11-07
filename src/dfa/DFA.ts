/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFASerializer } from "./DFASerializer.js";
import { DFAState } from "./DFAState.js";
import { LexerDFASerializer } from "./LexerDFASerializer.js";
import { Vocabulary } from "../Vocabulary.js";
import { DecisionState } from "../atn/DecisionState.js";
import { StarLoopEntryState } from "../atn/StarLoopEntryState.js";
import { HashSet } from "../misc/HashSet.js";

export class DFA {
    /**
     * A set of all DFA states. Use {@link Map} so we can get old state back
     *  ({@link Set} only allows you to see if it's there).
     */

    public readonly states = new HashSet<DFAState>();

    public s0: DFAState | null = null;

    public readonly decision: number;

    /** From which ATN state did we create this DFA? */

    public readonly atnStartState: DecisionState | null;

    /**
     * {@code true} if this DFA is for a precedence decision; otherwise,
     * {@code false}. This is the backing field for {@link #isPrecedenceDfa}.
     */
    public readonly precedenceDfa: boolean;

    public constructor(atnStartState: DecisionState | null, decision?: number) {
        this.atnStartState = atnStartState;
        this.decision = decision ?? 0;

        let precedenceDfa = false;
        if (atnStartState instanceof StarLoopEntryState) {
            if (atnStartState.precedenceRuleDecision) {
                precedenceDfa = true;
                const precedenceState = new DFAState();
                precedenceState.edges = [];
                precedenceState.isAcceptState = false;
                precedenceState.requiresFullContext = false;
                this.s0 = precedenceState;
            }
        }

        this.precedenceDfa = precedenceDfa;
    }

    /**
     * Gets whether this DFA is a precedence DFA. Precedence DFAs use a special
     * start state {@link #s0} which is not stored in {@link #states}. The
     * {@link DFAState#edges} array for this start state contains outgoing edges
     * supplying individual start states corresponding to specific precedence
     * values.
     *
      @returns `true` if this is a precedence DFA; otherwise,
     * {@code false}.
     * @see Parser#getPrecedence()
     */
    public readonly isPrecedenceDfa = (): boolean => {
        return this.precedenceDfa;
    };

    /**
     * Get the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
      @returns The start state corresponding to the specified precedence, or
     * {@code null} if no start state exists for the specified precedence.
     *
     * @throws IllegalStateException if this is not a precedence DFA.
     * @see #isPrecedenceDfa()
     */
    public readonly getPrecedenceStartState = (precedence: number): DFAState | null => {
        if (!this.isPrecedenceDfa()) {
            throw new Error(`Only precedence DFAs may contain a precedence start state.`);
        }

        // s0.edges is never null for a precedence DFA
        if (!this.s0 || !this.s0.edges || precedence < 0 || precedence >= this.s0.edges.length) {
            return null;
        }

        return this.s0.edges[precedence];
    };

    /**
     * Set the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
     * @param startState The start state corresponding to the specified
     * precedence.
     *
     * @throws IllegalStateException if this is not a precedence DFA.
     * @see #isPrecedenceDfa()
     */
    public readonly setPrecedenceStartState = (precedence: number, startState: DFAState): void => {
        if (!this.isPrecedenceDfa()) {
            throw new Error(`Only precedence DFAs may contain a precedence start state.`);
        }

        if (precedence < 0 || !this.s0?.edges) {
            return;
        }

        // synchronization on s0 here is ok. when the DFA is turned into a
        // precedence DFA, s0 will be initialized once and not updated again
        // s0.edges is never null for a precedence DFA
        if (precedence >= this.s0.edges.length) {
            const start = this.s0.edges.length;
            this.s0.edges.length = precedence + 1;
            this.s0.edges.fill(null, start, precedence);
        }

        this.s0.edges[precedence] = startState;
    };

    /**
     * Sets whether this is a precedence DFA.
     *
     * @param precedenceDfa {@code true} if this is a precedence DFA; otherwise,
     * {@code false}
     *
     * @throws UnsupportedOperationException if {@code precedenceDfa} does not
     * match the value of {@link #isPrecedenceDfa} for the current DFA.
     *
     * @deprecated This method no longer performs any action.
     */
    public setPrecedenceDfa(precedenceDfa: boolean): void {
        if (precedenceDfa !== this.isPrecedenceDfa()) {
            throw new Error(
                `The precedenceDfa field cannot change after a DFA is constructed.`);
        }
    };

    /**
     * @returns a list of all states in this DFA, ordered by state number.
     */
    public getStates(): DFAState[] {
        const result = this.states.values();
        result.sort((o1: DFAState, o2: DFAState): number => {
            return o1.stateNumber - o2.stateNumber;
        });

        return result;
    };

    public toString(vocabulary?: Vocabulary): string {
        if (!vocabulary) {
            return this.toString(Vocabulary.EMPTY_VOCABULARY);
        }

        if (this.s0 === null) {
            return "";
        }

        const serializer = new DFASerializer(this, vocabulary);

        return serializer.toString() ?? "";
    }

    public toLexerString(): string {
        if (this.s0 === null) {
            return "";
        }

        const serializer = new LexerDFASerializer(this);

        return serializer.toString() ?? "";
    };

}
