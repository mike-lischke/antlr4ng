/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable max-classes-per-file */

import { ATNConfigSet } from "../atn/ATNConfigSet.js";
import { LexerActionExecutor } from "../atn/LexerActionExecutor.js";
import { SemanticContext } from "../atn/SemanticContext.js";
import { HashCode } from "../misc/HashCode.js";
import { arrayToString } from "../utils/helpers.js";

/**
 * A DFA state represents a set of possible ATN configurations.
 *  As Aho, Sethi, Ullman p. 117 says "The DFA uses its state
 *  to keep track of all possible states the ATN can be in after
 *  reading each input symbol.  That is to say, after reading
 *  input a1a2..an, the DFA is in a state that represents the
 *  subset T of the states of the ATN that are reachable from the
 *  ATN's start state along some path labeled a1a2..an."
 *  In conventional NFA->DFA conversion, therefore, the subset T
 *  would be a bitset representing the set of states the
 *  ATN could be in.  We need to track the alt predicted by each
 *  state as well, however.  More importantly, we need to maintain
 *  a stack of states, tracking the closure operations as they
 *  jump from rule to rule, emulating rule invocations (method calls).
 *  I have to add a stack to simulate the proper lookahead sequences for
 *  the underlying LL grammar from which the ATN was derived.
 *
 *  <p>I use a set of ATNConfig objects not simple states.  An ATNConfig
 *  is both a state (ala normal conversion) and a RuleContext describing
 *  the chain of rules (if any) followed to arrive at that state.</p>
 *
 *  <p>A DFA state may have multiple references to a particular state,
 *  but with different ATN contexts (with same or different alts)
 *  meaning that state was reached via a different set of rule invocations.</p>
 */
export class DFAState {
    public stateNumber = -1;

    public configs = new ATNConfigSet();

    /**
     * {@code edges[symbol]} points to target of symbol. Shift up by 1 so (-1)
     *  {@link Token#EOF} maps to {@code edges[0]}.
     */

    public edges: Array<DFAState | null> | null = null;

    public isAcceptState = false;

    /**
     * if accept state, what ttype do we match or alt do we predict?
     *  This is set to {@link ATN#INVALID_ALT_NUMBER} when {@link #predicates}{@code !=null} or
     *  {@link #requiresFullContext}.
     */
    public prediction = -1;

    public lexerActionExecutor: LexerActionExecutor | null = null;

    /**
     * Indicates that this state was created during SLL prediction that
     * discovered a conflict between the configurations in the state. Future
     * {@link ParserATNSimulator#execATN} invocations immediately jumped doing
     * full context prediction if this field is true.
     */
    public requiresFullContext = false;

    /**
     * During SLL parsing, this is a list of predicates associated with the
     *  ATN configurations of the DFA state. When we have predicates,
     *  {@link #requiresFullContext} is {@code false} since full context prediction evaluates predicates
     *  on-the-fly. If this is not null, then {@link #prediction} is
     *  {@link ATN#INVALID_ALT_NUMBER}.
     *
     *  <p>We only use these for non-{@link #requiresFullContext} but conflicting states. That
     *  means we know from the context (it's $ or we don't dip into outer
     *  context) that it's an ambiguity not a conflict.</p>
     *
     *  <p>This list is computed by {@link ParserATNSimulator#predicateDFAState}.</p>
     */

    public predicates: DFAState.PredPrediction[] | null = null;

    public constructor(stateNumber: number);
    public constructor(configs?: ATNConfigSet);
    public constructor(stateNumberOrConfigs?: number | ATNConfigSet) {
        if (stateNumberOrConfigs) {
            if (typeof stateNumberOrConfigs === "number") {
                this.stateNumber = stateNumberOrConfigs;
            } else {
                this.configs = stateNumberOrConfigs;
            }
        }
    }

    public hashCode(): number {
        const hash = new HashCode();
        hash.update(this.configs.configs);

        return hash.finish();
    };

    /**
     * Two {@link DFAState} instances are equal if their ATN configuration sets
     * are the same. This method is used to see if a state already exists.
     *
     * <p>Because the number of alternatives and number of ATN configurations are
     * finite, there is a finite number of DFA states that can be processed.
     * This is necessary to show that the algorithm terminates.</p>
     *
     * <p>Cannot test the DFA state numbers here because in
     * {@link ParserATNSimulator#addDFAState} we need to know if any other state
     * exists that has this exact set of ATN configurations. The
     * {@link #stateNumber} is irrelevant.</p>
     *
     * @param o tbd
     *
     * @returns tbd
     */
    public equals(o: unknown): boolean {
        // compare set of ATN configurations in this set with other
        if (this === o) {
            return true;
        }

        if (!(o instanceof DFAState)) {
            return false;
        }

        if (this.configs === null) {
            if (o.configs === null) {
                return true;
            }

            return false;
        }

        return this.configs.equals(o.configs);
    };

    public toString(): string {
        let buf = "";
        buf += this.stateNumber;
        buf += ":";
        buf += this.configs ? this.configs.toString() : "";
        if (this.isAcceptState) {
            buf += "=>";
            if (this.predicates) {
                buf += arrayToString(this.predicates);
            } else {
                buf += this.prediction;
            }
        }

        return buf.toString();
    };
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace DFAState {
    /** Map a predicate to a predicted alternative. */
    export class PredPrediction {

        public pred: SemanticContext; // never null; at least SemanticContext.NONE
        public alt: number;

        public constructor(pred: SemanticContext, alt: number) {
            this.alt = alt;
            this.pred = pred;
        }

        public toString(): string {
            return `(${this.pred}, ${this.alt})`;
        };
    };

}
