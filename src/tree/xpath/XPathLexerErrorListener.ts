/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BaseErrorListener } from "../../BaseErrorListener.js";

export class XPathLexerErrorListener extends BaseErrorListener {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    syntaxError(recognizer: any, offendingSymbol: any, line: any, charPositionInLine: any, msg: any,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        e: any) {
        // intentionally empty
    }
}
