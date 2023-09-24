/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFAState } from './DFAState.js';
import { StarLoopEntryState } from '../atn/StarLoopEntryState.js';
import { ATNConfigSet } from './../atn/ATNConfigSet.js';
import { DFASerializer } from './DFASerializer.js';
import { LexerDFASerializer } from './LexerDFASerializer.js';
import { HashSet } from "../misc/HashSet.js";

export class DFA {
    _states: any;
    atnStartState: any;
    decision: any;
    precedenceDfa: any;
    s0: any;
    constructor(atnStartState: any, decision: any) {
        if (decision === undefined) {
            decision = 0;
        }
        /**
         * From which ATN state did we create this DFA?
         */
        this.atnStartState = atnStartState;
        this.decision = decision;
        /**
         * A set of all DFA states. Use {@link Map} so we can get old state back
         * ({@link Set} only allows you to see if it's there).
         */
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        this._states = new HashSet();
        this.s0 = null;
        /**
         * {@code true} if this DFA is for a precedence decision; otherwise,
         * {@code false}. This is the backing field for {@link //isPrecedenceDfa},
         * {@link //setPrecedenceDfa}
         */
        this.precedenceDfa = false;
        if (atnStartState instanceof StarLoopEntryState) {
            if (atnStartState.precedenceRuleDecision) {
                this.precedenceDfa = true;
                // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                const precedenceState = new DFAState(null, new ATNConfigSet());
                precedenceState.edges = [];
                precedenceState.isAcceptState = false;
                precedenceState.requiresFullContext = false;
                this.s0 = precedenceState;
            }
        }
    }

    /**
     * Get the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
     * @return The start state corresponding to the specified precedence, or
     * {@code null} if no start state exists for the specified precedence.
     *
     * @throws IllegalStateException if this is not a precedence DFA.
     * @see //isPrecedenceDfa()
     */
    getPrecedenceStartState(precedence: any) {
        if (!(this.precedenceDfa)) {
            throw ("Only precedence DFAs may contain a precedence start state.");
        }
        // s0.edges is never null for a precedence DFA
        if (precedence < 0 || precedence >= this.s0.edges.length) {
            return null;
        }
        return this.s0.edges[precedence] || null;
    }

    /**
     * Set the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
     * @param startState The start state corresponding to the specified
     * precedence.
     *
     * @throws IllegalStateException if this is not a precedence DFA.
     * @see //isPrecedenceDfa()
     */
    setPrecedenceStartState(precedence: any, startState: any) {
        if (!(this.precedenceDfa)) {
            throw ("Only precedence DFAs may contain a precedence start state.");
        }
        if (precedence < 0) {
            return;
        }

        /**
         * synchronization on s0 here is ok. when the DFA is turned into a
         * precedence DFA, s0 will be initialized once and not updated again
         * s0.edges is never null for a precedence DFA
         */
        this.s0.edges[precedence] = startState;
    }

    /**
     * Sets whether this is a precedence DFA. If the specified value differs
     * from the current DFA configuration, the following actions are taken;
     * otherwise no changes are made to the current DFA.
     *
     * <ul>
     * <li>The {@link //states} map is cleared</li>
     * <li>If {@code precedenceDfa} is {@code false}, the initial state
     * {@link //s0} is set to {@code null}; otherwise, it is initialized to a new
     * {@link DFAState} with an empty outgoing {@link DFAState//edges} array to
     * store the start states for individual precedence values.</li>
     * <li>The {@link //precedenceDfa} field is updated</li>
     * </ul>
     *
     * @param precedenceDfa {@code true} if this is a precedence DFA; otherwise,
     * {@code false}
     */
    setPrecedenceDfa(precedenceDfa: any) {
        if (this.precedenceDfa !== precedenceDfa) {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
            this._states = new HashSet();
            if (precedenceDfa) {
                // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                const precedenceState = new DFAState(null, new ATNConfigSet());
                precedenceState.edges = [];
                precedenceState.isAcceptState = false;
                precedenceState.requiresFullContext = false;
                this.s0 = precedenceState;
            } else {
                this.s0 = null;
            }
            this.precedenceDfa = precedenceDfa;
        }
    }

    /**
     * Return a list of all states in this DFA, ordered by state number.
     */
    sortedStates() {
        const list = this._states.values();
        return list.sort(function (a: any, b: any) {
            return a.stateNumber - b.stateNumber;
        });
    }

    toString(literalNames: any, symbolicNames: any) {
        literalNames = literalNames || null;
        symbolicNames = symbolicNames || null;
        if (this.s0 === null) {
            return "";
        }
        const serializer = new DFASerializer(this, literalNames, symbolicNames);
        return serializer.toString();
    }

    toLexerString() {
        if (this.s0 === null) {
            return "";
        }
        const serializer = new LexerDFASerializer(this);
        return serializer.toString();
    }

    get states() {
        return this._states;
    }
}
