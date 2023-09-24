/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNType } from "./atn/ATNType.js";
import { Lexer } from "./Lexer.js";
import { LexerATNSimulator } from "./atn/LexerATNSimulator.js";
import { PredictionContextCache } from "./atn/PredictionContextCache.js";
import { DFA } from "./dfa/DFA.js";

export class LexerInterpreter extends Lexer {
    #grammarFileName;
    #atn;

    #ruleNames;
    #channelNames;
    #modeNames;

    #vocabulary;
    #decisionToDFA;

    #sharedContextCache = new PredictionContextCache();

    constructor(grammarFileName: any, vocabulary: any, ruleNames: any, channelNames: any, modeNames: any, atn: any,
        input: any) {
        super(input);

        if (atn.grammarType !== ATNType.LEXER) {
            throw new Error("IllegalArgumentException: The ATN must be a lexer ATN.");
        }

        this.#grammarFileName = grammarFileName;
        this.#atn = atn;

        this.#ruleNames = ruleNames.slice(0);
        this.#channelNames = channelNames.slice(0);
        this.#modeNames = modeNames.slice(0);
        this.#vocabulary = vocabulary;

        this.#decisionToDFA = atn.decisionToState.map(function (ds: any, i: any) {
            return new DFA(ds, i);
        });

        this.interpreter = new LexerATNSimulator(this, atn, this.#decisionToDFA, this.#sharedContextCache);
    }

    get atn() {
        return this.#atn;
    }

    get grammarFileName() {
        return this.#grammarFileName;
    }

    // @ts-expect-error TS(2611): 'ruleNames' is defined as a property in class 'Lex... Remove this comment to see the full error message
    get ruleNames() {
        return this.#ruleNames;
    }

    get channelNames() {
        return this.#channelNames;
    }

    get modeNames() {
        return this.#modeNames;
    }

    get vocabulary() {
        return this.#vocabulary;
    }
}
