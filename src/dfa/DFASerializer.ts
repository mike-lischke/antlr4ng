/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { arrayToString } from "../utils/arrayToString.js";

/**
 * A DFA walker that knows how to dump them to serialized strings.
 */
export class DFASerializer {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    dfa: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    literalNames: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    symbolicNames: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(dfa: any, literalNames: any, symbolicNames: any) {
        this.dfa = dfa;

        // XXX: switch to vocabulary.
        this.literalNames = literalNames || [];
        this.symbolicNames = symbolicNames || [];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        if (this.dfa.s0 === null) {
            return null;
        }
        let buf = "";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const states = this.dfa.sortedStates();
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < states.length; i++) {
            const s = states[i];
            if (s.edges !== null) {
                const n = s.edges.length;
                for (let j = 0; j < n; j++) {
                    const t = s.edges[j] || null;
                    if (t !== null && t.stateNumber !== 0x7FFFFFFF) {
                        buf = buf.concat(this.getStateString(s));
                        buf = buf.concat("-");
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        buf = buf.concat(this.getEdgeLabel(j));
                        buf = buf.concat("->");
                        buf = buf.concat(this.getStateString(t));
                        // eslint-disable-next-line @typescript-eslint/quotes
                        buf = buf.concat('\n');
                    }
                }
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return buf.length === 0 ? null : buf;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getEdgeLabel(i: any) {
        if (i === 0) {
            return "EOF";
        } else if (this.literalNames !== null || this.symbolicNames !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.literalNames[i - 1] || this.symbolicNames[i - 1];
        } else {
            return String.fromCharCode(i - 1);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getStateString(s: any) {
        const baseStateStr = (s.isAcceptState ? ":" : "") + "s" + s.stateNumber + (s.requiresFullContext ? "^" : "");
        if (s.isAcceptState) {
            if (s.predicates !== null) {
                return baseStateStr + "=>" + arrayToString(s.predicates);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                return baseStateStr + "=>" + s.prediction.toString();
            }
        } else {
            return baseStateStr;
        }
    }
}
