/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BaseErrorListener } from "./BaseErrorListener.js";
import { Recognizer } from "./Recognizer.js";
import { RecognitionException } from "./RecognitionException.js";
import { ATNSimulator } from "./atn/ATNSimulator.js";
import { Token } from "./Token.js";

export declare class DiagnosticErrorListener<ATNInterpreter extends ATNSimulator>
    extends BaseErrorListener<ATNInterpreter> {
    public syntaxError<T extends Token>(recognizer: Recognizer<ATNInterpreter>, offendingSymbol: T, line: number,
        column: number, msg: string, e: RecognitionException | null): void;
}
