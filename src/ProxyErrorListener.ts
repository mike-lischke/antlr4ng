/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BaseErrorListener } from "./BaseErrorListener.js";
import { Parser } from "./Parser.js";
import { RecognitionException } from "./RecognitionException.js";
import { Recognizer } from "./Recognizer.js";
import { Token } from "./Token.js";
import { ATNConfigSet } from "./atn/ATNConfigSet.js";
import { ATNSimulator } from "./atn/ATNSimulator.js";
import { DFA } from "./dfa/DFA.js";
import { BitSet } from "./misc/BitSet.js";

export class ProxyErrorListener extends BaseErrorListener {
    public constructor(private delegates: BaseErrorListener[]) {
        super();

        return this;
    }

    public override syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>,
        offendingSymbol: S | null, line: number, column: number, msg: string, e: RecognitionException | null): void {
        this.delegates.forEach((d) => {
            d.syntaxError(recognizer, offendingSymbol, line, column, msg, e);
        });
    }

    public override reportAmbiguity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, exact: boolean,
        ambigAlts: BitSet | undefined, configs: ATNConfigSet): void {
        this.delegates.forEach((d) => {
            d.reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs);
        });
    }

    public override reportAttemptingFullContext(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number,
        conflictingAlts: BitSet | undefined, configs: ATNConfigSet): void {
        this.delegates.forEach((d) => {
            d.reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs);
        });
    }

    public override reportContextSensitivity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number,
        prediction: number, configs: ATNConfigSet): void {
        this.delegates.forEach((d) => {
            d.reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs);
        });
    }
}
