/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFASerializer } from "./DFASerializer.js";

export class LexerDFASerializer extends DFASerializer {
    constructor(dfa: any) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        super(dfa, null);
    }

    getEdgeLabel(i: any) {
        return "'" + String.fromCharCode(i) + "'";
    }
}
