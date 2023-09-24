/* eslint-disable jsdoc/require-returns, jsdoc/require-param, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { ATNConfigSet } from '../atn/ATNConfigSet.js';
import { HashCode } from "../misc/HashCode.js";
import { HashSet } from "../misc/HashSet.js";

/**
 * A DFA state represents a set of possible ATN configurations.
 * As Aho, Sethi, Ullman p. 117 says "The DFA uses its state
 * to keep track of all possible states the ATN can be in after
 * reading each input symbol. That is to say, after reading
 * input a1a2..an, the DFA is in a state that represents the
 * subset T of the states of the ATN that are reachable from the
 * ATN's start state along some path labeled a1a2..an."
 * In conventional NFA&rarr;DFA conversion, therefore, the subset T
 * would be a bitset representing the set of states the
 * ATN could be in. We need to track the alt predicted by each
 * state as well, however. More importantly, we need to maintain
 * a stack of states, tracking the closure operations as they
 * jump from rule to rule, emulating rule invocations (method calls).
 * I have to add a stack to simulate the proper lookahead sequences for
 * the underlying LL grammar from which the ATN was derived.
 *
 * <p>I use a set of ATNConfig objects not simple states. An ATNConfig
 * is both a state (ala normal conversion) and a RuleContext describing
 * the chain of rules (if any) followed to arrive at that state.</p>
 *
 * <p>A DFA state may have multiple references to a particular state,
 * but with different ATN contexts (with same or different alts)
 * meaning that state was reached via a different set of rule invocations.</p>
 */
export class DFAState {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    configs: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    edges: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    isAcceptState: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    lexerActionExecutor: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    predicates: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    prediction: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    requiresFullContext: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    stateNumber: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(stateNumber: any, configs: any) {
        if (stateNumber === null) {
            stateNumber = -1;
        }
        if (configs === null) {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            configs = new ATNConfigSet();
        }
        this.stateNumber = stateNumber;
        this.configs = configs;
        /**
         * {@code edges[symbol]} points to target of symbol. Shift up by 1 so (-1)
         * {@link Token//EOF} maps to {@code edges[0]}.
         */
        this.edges = null;
        this.isAcceptState = false;
        /**
         * if accept state, what ttype do we match or alt do we predict?
         * This is set to {@link ATN//INVALID_ALT_NUMBER} when {@link//predicates}
         * {@code !=null} or {@link //requiresFullContext}.
         */
        this.prediction = 0;
        this.lexerActionExecutor = null;
        /**
         * Indicates that this state was created during SLL prediction that
         * discovered a conflict between the configurations in the state. Future
         * {@link ParserATNSimulator//execATN} invocations immediately jumped doing
         * full context prediction if this field is true.
         */
        this.requiresFullContext = false;
        /**
         * During SLL parsing, this is a list of predicates associated with the
         * ATN configurations of the DFA state. When we have predicates,
         * {@link //requiresFullContext} is {@code false} since full context
         * prediction evaluates predicates
         * on-the-fly. If this is not null, then {@link //prediction} is
         * {@link ATN//INVALID_ALT_NUMBER}.
         *
         * <p>We only use these for non-{@link //requiresFullContext} but
         * conflicting states. That
         * means we know from the context (it's $ or we don't dip into outer
         * context) that it's an ambiguity not a conflict.</p>
         *
         * <p>This list is computed by {@link
         * ParserATNSimulator//predicateDFAState}.</p>
         */
        this.predicates = null;
        // eslint-disable-next-line padding-line-between-statements
        return this;
    }

    /**
     * Get the set of all alts mentioned by all ATN configurations in this
     * DFA state.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getAltSet() {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        const alts = new HashSet();
        if (this.configs !== null) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < this.configs.length; i++) {
                const c = this.configs[i];
                alts.add(c.alt);
            }
        }
        if (alts.length === 0) {
            return null;
        } else {
            return alts;
        }
    }

    /**
     * Two {@link DFAState} instances are equal if their ATN configuration sets
     * are the same. This method is used to see if a state already exists.
     *
     * <p>Because the number of alternatives and number of ATN configurations are
     * finite, there is a finite number of DFA states that can be processed.
     * This is necessary to show that the algorithm terminates.</p>
     *
     * <p>Cannot test the DFA state numbers here because in
     * {@link ParserATNSimulator//addDFAState} we need to know if any other state
     * exists that has this exact set of ATN configurations. The
     * {@link //stateNumber} is irrelevant.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        // compare set of ATN configurations in this set with other
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this === other ||
            (other instanceof DFAState &&
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                this.configs.equals(other.configs));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        let s = "" + this.stateNumber + ":" + this.configs;
        if (this.isAcceptState) {
            s = s + "=>";
            if (this.predicates !== null)
                // eslint-disable-next-line curly
                s = s + this.predicates;
            else
                // eslint-disable-next-line curly
                s = s + this.prediction;
        }
        // eslint-disable-next-line padding-line-between-statements
        return s;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    hashCode() {
        const hash = new HashCode();
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        hash.update(this.configs);
        // eslint-disable-next-line padding-line-between-statements
        return hash.finish();
    }
}
