/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Lexer } from "./Lexer.js";
import { LexerATNSimulator } from "./atn/LexerATNSimulator.js";
import { PredictionContextCache } from "./atn/PredictionContextCache.js";
import { DFA } from "./dfa/DFA.js";
import { ATN } from "./atn/ATN.js";
import { Vocabulary } from "./Vocabulary.js";
import { CharStream } from "./CharStream.js";

export class LexerInterpreter extends Lexer {
    private decisionToDFA: DFA[];
    private sharedContextCache = new PredictionContextCache();

    #grammarFileName: string;
    #atn: ATN;

    #ruleNames: string[];
    #channelNames: string[];
    #modeNames: string[];

    #vocabulary: Vocabulary;

    public constructor(grammarFileName: string, vocabulary: Vocabulary, ruleNames: string[], channelNames: string[],
        modeNames: string[], atn: ATN, input: CharStream) {
        super(input);

        if (atn.grammarType !== ATN.LEXER) {
            throw new Error("IllegalArgumentException: The ATN must be a lexer ATN.");
        }

        this.#grammarFileName = grammarFileName;
        this.#atn = atn;

        this.#ruleNames = ruleNames.slice(0);
        this.#channelNames = channelNames.slice(0);
        this.#modeNames = modeNames.slice(0);
        this.#vocabulary = vocabulary;

        this.decisionToDFA = atn.decisionToState.map((ds, i) => {
            return new DFA(ds, i);
        });

        this.interpreter = new LexerATNSimulator(this, atn, this.decisionToDFA, this.sharedContextCache);
    }

    public override get atn(): ATN {
        return this.#atn;
    }

    public get grammarFileName(): string {
        return this.#grammarFileName;
    }

    public get ruleNames(): string[] {
        return this.#ruleNames;
    }

    public get channelNames(): string[] {
        return this.#channelNames;
    }

    public get modeNames(): string[] {
        return this.#modeNames;
    }

    public get vocabulary(): Vocabulary {
        return this.#vocabulary;
    }
}
