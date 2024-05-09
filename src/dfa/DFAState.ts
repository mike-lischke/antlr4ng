/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { ATNConfigSet } from "../atn/ATNConfigSet.js";
import { LexerActionExecutor } from "../atn/LexerActionExecutor.js";
import { arrayToString } from "../utils/helpers.js";
import type { PredPrediction } from "./PredPrediction.js";

/**
 * A DFA state represents a set of possible ATN configurations.
 * As Aho, Sethi, Ullman p. 117 says "The DFA uses its state
 * to keep track of all possible states the ATN can be in after
 * reading each input symbol.  That is to say, after reading
 * input a1a2..an, the DFA is in a state that represents the
 * subset T of the states of the ATN that are reachable from the
 * ATN's start state along some path labeled a1a2..an."
 * In conventional NFA->DFA conversion, therefore, the subset T
 * would be a bitset representing the set of states the
 * ATN could be in.  We need to track the alt predicted by each
 * state as well, however.  More importantly, we need to maintain
 * a stack of states, tracking the closure operations as they
 * jump from rule to rule, emulating rule invocations (method calls).
 * I have to add a stack to simulate the proper lookahead sequences for
 * the underlying LL grammar from which the ATN was derived.
 *
 * I use a set of ATNConfig objects not simple states.  An ATNConfig
 * is both a state (ala normal conversion) and a RuleContext describing
 * the chain of rules (if any) followed to arrive at that state.
 *
 * A DFA state may have multiple references to a particular state,
 * but with different ATN contexts (with same or different alts)
 * meaning that state was reached via a different set of rule invocations.
 */
export class DFAState {
    public stateNumber: number = -1;

    public readonly configs: ATNConfigSet;

    /**
     * `edges[symbol]` points to target of symbol. Shift up by 1 so (-1) {@link Token.EOF} maps to `edges[0]`.
     */
    public edges: DFAState[] = [];

    public isAcceptState = false;

    /**
     * If accept state, what ttype do we match or alt do we predict? This is set to {@link ATN.INVALID_ALT_NUMBER}
     * when {@link predicates} `!= null` or {@link requiresFullContext}.
     */
    public prediction = -1;

    public lexerActionExecutor: LexerActionExecutor | null = null;

    /**
     * Indicates that this state was created during SLL prediction that discovered a conflict between the configurations
     * in the state. Future {@link ParserATNSimulator.execATN} invocations immediately jumped doing
     * full context prediction if this field is true.
     */
    public requiresFullContext = false;

    /**
     * During SLL parsing, this is a list of predicates associated with the ATN configurations of the DFA state.
     * When we have predicates, {@link requiresFullContext} is `false` since full context prediction evaluates
     * predicates on-the-fly. If this is not null, then {@link prediction} is `ATN.INVALID_ALT_NUMBER`.
     *
     * We only use these for non-{@link #requiresFullContext} but conflicting states. That
     * means we know from the context (it's $ or we don't dip into outer
     * context) that it's an ambiguity not a conflict.
     *
     * This list is computed by {@link ParserATNSimulator#predicateDFAState}.
     */
    public predicates: PredPrediction[] | null = null;

    private constructor(configs?: ATNConfigSet) {
        if (configs) {
            this.configs = configs;
        }
    }

    public static fromState(stateNumber: number): DFAState {
        const result = new DFAState();
        result.stateNumber = stateNumber;

        return result;
    }

    public static fromConfigs(configs: ATNConfigSet): DFAState {
        return new DFAState(configs);
    }

    public static hashCode(state: Partial<DFAState>): number {
        return state.configs!.hashCode();
    };

    /**
     * Two {@link DFAState} instances are equal if their ATN configuration sets
     * are the same. This method is used to see if a state already exists.
     *
     * Because the number of alternatives and number of ATN configurations are
     * finite, there is a finite number of DFA states that can be processed.
     * This is necessary to show that the algorithm terminates.
     *
     * Cannot test the DFA state numbers here because in
     * {@link ParserATNSimulator#addDFAState} we need to know if any other state
     * exists that has this exact set of ATN configurations. The
     * {@link #stateNumber} is irrelevant.
     *
     * @param a The first {@link DFAState}.
     * @param b The second {@link DFAState}.
     *
     * @returns `true` if the two states are equal, otherwise `false`.
     */
    public static equals(a: Partial<DFAState>, b: Partial<DFAState>): boolean {
        return a.configs!.equals(b.configs!);
    };

    /**
     * @returns the set of all alts mentioned by all ATN configurations in this DFA state.
     */
    public getAltSet(): Set<number> | null {
        const alts = new Set<number>();
        for (const config of this.configs) {
            alts.add(config.alt);
        }

        if (alts.size === 0) {
            return null;
        }

        return alts;
    }

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
