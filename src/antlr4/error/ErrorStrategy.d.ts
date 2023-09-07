/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import RecognitionException from "./RecognitionException.js";
import Parser from "../Parser.js";
import Token from "../Token.js";

export declare class ErrorStrategy {
    public reset(recognizer: Parser): void;
    public sync(recognizer: Parser): void;
    public recover(recognizer: Parser, e: RecognitionException): void;
    public recoverInline(recognizer: Parser): Token;
    public reportMatch(recognizer: Parser): void;
    public reportError(recognizer: Parser, e: RecognitionException): void;
}

export default ErrorStrategy;
