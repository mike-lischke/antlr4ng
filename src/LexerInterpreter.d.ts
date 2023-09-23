/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATN } from "./atn/ATN.js";
import { RuleContext } from "./atn/RuleContext.js";
import { CharStream } from "./CharStream.js";
import { Lexer } from "./Lexer.js";
import { Vocabulary } from "./Vocabulary.js";

export declare abstract class LexerInterpreter extends Lexer {

    public constructor(grammarFileName: string, vocabulary: Vocabulary, ruleNames: string[], channelNames: string[],
        modeNames: string[], atn: ATN, input: CharStream);

    public get atn(): ATN;
    public get grammarFileName(): string;
    public get ruleNames(): string[];
    public get modeNames(): string[];
    public get vocabulary(): Vocabulary;

    public abstract action(localctx: RuleContext | null, ruleIndex: number, actionIndex: number): void;
}
