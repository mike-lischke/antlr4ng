/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Vocabulary } from "../Vocabulary.js";
import { DFA } from "./DFA.js";
import { DFASerializer } from "./DFASerializer.js";

export class LexerDFASerializer extends DFASerializer {
    public constructor(dfa: DFA) {
        super(dfa, Vocabulary.EMPTY_VOCABULARY);
    }

    public override getEdgeLabel = (i: number): string => {
        return "'" + String.fromCharCode(i) + "'";
    };
}
