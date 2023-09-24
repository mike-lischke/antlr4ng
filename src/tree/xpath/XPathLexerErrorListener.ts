/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BaseErrorListener } from "../../BaseErrorListener.js";

export class XPathLexerErrorListener extends BaseErrorListener {
    syntaxError(recognizer: any, offendingSymbol: any, line: any, charPositionInLine: any, msg: any,
        e: any) {
        // intentionally empty
    }
}
