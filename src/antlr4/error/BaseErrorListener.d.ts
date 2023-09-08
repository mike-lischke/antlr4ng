/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Recognizer } from "../Recognizer.js";
import { Token } from "../Token.js";
import { ATNConfigSet } from "../atn/ATNConfigSet.js";
import { ATNSimulator } from "../atn/ATNSimulator.js";
import { DFA } from "../dfa/DFA.js";
import { RecognitionException } from "./RecognitionException.js";

export declare class BaseErrorListener<ATNInterpreter extends ATNSimulator> {
    public syntaxError<T extends Token>(recognizer: Recognizer<ATNInterpreter>, offendingSymbol: T, line: number,
        column: number, msg: string, e: RecognitionException | null): void;
    public reportAmbiguity(recognizer: Recognizer<ATNInterpreter>, dfa: DFA, startIndex: number, stopIndex: number,
        exact: boolean, ambigAlts: unknown, configs: ATNConfigSet): void;
    public reportAttemptingFullContext(recognizer: Recognizer<ATNInterpreter>, dfa: DFA, startIndex: number,
        stopIndex: number, conflictingAlts: unknown, configs: ATNConfigSet): void;
    public reportContextSensitivity(recognizer: Recognizer<ATNInterpreter>, dfa: DFA, startIndex: number,
        stopIndex: number, prediction: number, configs: ATNConfigSet): void;
}
