/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATN } from "./atn/ATN.js";
import { CharStream } from "./CharStream.js";
import { Lexer } from "./Lexer.js";
import { Vocabulary } from "./Vocabulary.js";

export declare class LexerInterpreter extends Lexer {

    public constructor(grammarFileName: string, vocabulary: Vocabulary, modeNames: string[], ruleNames: string[],
        atn: ATN, input: CharStream);

    public get atn(): ATN;
    public get grammarFileName(): string;
    public get ruleNames(): string[];
    public get modeNames(): string[];

    public getVocabulary(): Vocabulary;
}
