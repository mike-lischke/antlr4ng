/**
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

import ErrorListener from "../../error/ErrorListener.js";

export class XPathLexerErrorListener extends ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg,
        e) {
        // intentionally empty
    }
}

export default XPathLexerErrorListener;
