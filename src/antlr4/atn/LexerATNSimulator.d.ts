/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import ATNSimulator from "./ATNSimulator.js";
import ATN from "./ATN.js";
import PredictionContextCache from "./PredictionContextCache.js";
import DFA from "../dfa/DFA.js";
import CharStream from "../CharStream.js";
import Lexer from "../Lexer.js";

export declare class LexerATNSimulator extends ATNSimulator {
    public decisionToDFA: DFA[];

    public constructor(recog: Lexer, atn: ATN, decisionToDFA: DFA[], sharedContextCache: PredictionContextCache);

    public consume(input: CharStream): void;

}

export default LexerATNSimulator;
