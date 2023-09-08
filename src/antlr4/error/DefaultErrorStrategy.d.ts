/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ErrorStrategy } from "./ErrorStrategy.js";
import { RecognitionException } from "./RecognitionException.js";
import { Parser } from "../Parser.js";
import { Token } from "../Token.js";

export class DefaultErrorStrategy implements ErrorStrategy {
    public recover(recognizer: Parser, e: RecognitionException): void;
    public recoverInline(recognizer: Parser): Token;
    public reportError(recognizer: Parser, e: RecognitionException): void;
    public reportMatch(recognizer: Parser): void;
    public reset(recognizer: Parser): void;
    public sync(recognizer: Parser): void;
    public inErrorRecoveryMode(recognizer: Parser): void;
    public beginErrorCondition(recognizer: Parser): void;
    public getMissingSymbol(recognizer: Parser): Token;
}
