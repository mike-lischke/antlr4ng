/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { ANTLRErrorListener } from "./ANTLRErrorListener.js";

import { Parser } from "./Parser.js";
import { RecognitionException } from "./RecognitionException.js";
import { Recognizer } from "./Recognizer.js";
import { Token } from "./Token.js";
import { ATNConfigSet } from "./atn/ATNConfigSet.js";
import { ATNSimulator } from "./atn/ATNSimulator.js";
import { DFA } from "./dfa/DFA.js";
import { BitSet } from "./misc/BitSet.js";

/**
 * Provides an empty default implementation of {@link ANTLRErrorListener}. The
 * default implementation of each method does nothing, but can be overridden as
 * necessary.
 */
export class BaseErrorListener implements ANTLRErrorListener {
    public syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>, offendingSymbol: S | null,
        line: number, column: number, msg: string, e: RecognitionException | null): void {
    }

    public reportAmbiguity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, exact: boolean,
        ambigAlts: BitSet | null, configs: ATNConfigSet): void {
    }

    public reportAttemptingFullContext(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number,
        conflictingAlts: BitSet | null, configs: ATNConfigSet): void {
    }

    public reportContextSensitivity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number,
        prediction: number, configs: ATNConfigSet): void {
    }
}
