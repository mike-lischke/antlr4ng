/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Recognizer } from "../../Recognizer.js";
import { Token } from "../../Token.js";
import { LexerATNSimulator } from "../../atn/LexerATNSimulator.js";
import { BaseErrorListener } from "../../BaseErrorListener.js";
import { RecognitionException } from "../../RecognitionException.js";

export class XPathLexerErrorListener extends BaseErrorListener<LexerATNSimulator> {
    public syntaxError<T extends Token>(
        recognizer: Recognizer<LexerATNSimulator>, offendingSymbol: T | undefined,
        line: number, charPositionInLine: number, msg: string,
        e: RecognitionException | null): void;
}
