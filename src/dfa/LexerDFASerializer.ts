/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFASerializer } from "./DFASerializer.js";

export class LexerDFASerializer extends DFASerializer {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(dfa: any) {
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        super(dfa, null);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getEdgeLabel(i: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return "'" + String.fromCharCode(i) + "'";
    }
}
