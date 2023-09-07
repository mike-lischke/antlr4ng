/**
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

import Recognizer from "../../Recognizer.js";
import Token from "../../Token.js";
import LexerATNSimulator from "../../atn/LexerATNSimulator.js";
import ErrorListener from "../../error/ErrorListener.js";
import RecognitionException from "../../error/RecognitionException.js";

export class XPathLexerErrorListener extends ErrorListener<LexerATNSimulator> {
    public syntaxError<T extends Token>(
        recognizer: Recognizer<LexerATNSimulator>, offendingSymbol: T | undefined,
        line: number, charPositionInLine: number, msg: string,
        e: RecognitionException | null): void;
}

export default XPathLexerErrorListener;
