/* eslint-disable max-len */
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

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(grammarFileName: any, vocabulary: any, ruleNames: any, channelNames: any, modeNames: any, atn: any,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        input: any) {
        super(input);

        if (atn.grammarType !== ATNType.LEXER) {
            throw new Error("IllegalArgumentException: The ATN must be a lexer ATN.");
        }

        this.#grammarFileName = grammarFileName;
        this.#atn = atn;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.#ruleNames = ruleNames.slice(0);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.#channelNames = channelNames.slice(0);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.#modeNames = modeNames.slice(0);
        this.#vocabulary = vocabulary;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
        this.#decisionToDFA = atn.decisionToState.map(function (ds: any, i: any) {
            return new DFA(ds, i);
        });

        this.interpreter = new LexerATNSimulator(this, atn, this.#decisionToDFA, this.#sharedContextCache);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get atn() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#atn;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get grammarFileName() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#grammarFileName;
    }

    // @ts-expect-error TS(2611): 'ruleNames' is defined as a property in class 'Lex... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get ruleNames() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#ruleNames;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get channelNames() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#channelNames;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get modeNames() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#modeNames;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get vocabulary() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#vocabulary;
    }
}
