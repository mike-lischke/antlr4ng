/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFA } from "./DFA.js";
import { DFAState } from "./DFAState.js";
import { Vocabulary } from "../Vocabulary.js";

/** A DFA walker that knows how to dump them to serialized strings. */
export class DFASerializer {

    private readonly dfa: DFA;
    private readonly vocabulary: Vocabulary;

    public constructor(dfa: DFA, vocabulary: Vocabulary) {
        this.dfa = dfa;
        this.vocabulary = vocabulary;
    }

    public toString(): string {
        if (!this.dfa.s0) {
            return "";
        }

        let buf = "";
        const states = this.dfa.getStates();
        for (const s of states) {
            let n = 0;
            n = s.edges.length;

            for (let i = 0; i < n; i++) {
                const t = s.edges[i];
                if (t && t.stateNumber !== 0x7FFFFFFF) {
                    buf += this.getStateString(s);
                    const label = this.getEdgeLabel(i);
                    buf += "-";
                    buf += label;
                    buf += "->";
                    buf += this.getStateString(t);
                    buf += "\n";
                }
            }
        }

        return buf;
    };

    protected getEdgeLabel(i: number): string {
        const name = this.vocabulary.getDisplayName(i - 1);

        return `${name}`;
    };

    protected getStateString(s: DFAState): string {
        const n = s.stateNumber;
        const baseStateStr = (s.isAcceptState ? ":" : "") + "s" + n + (s.requiresFullContext ? "^" : "");
        if (s.isAcceptState) {
            if (s.predicates !== null) {
                return `${baseStateStr}=>${s.predicates.toString()}`;
            }

            return `${baseStateStr}=>${s.prediction}`;
        } else {
            return `${baseStateStr}`;
        }
    };
}
