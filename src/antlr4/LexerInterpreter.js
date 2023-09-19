/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNType } from "./atn/ATNType.js";
import { Lexer } from "./Lexer.js";
import { LexerATNSimulator } from "./atn/LexerATNSimulator.js";

export class LexerInterpreter extends Lexer {
    _grammarFileName;
    _atn;

    _ruleNames;
    _channelNames;
    _modeNames;

    _vocabulary;

    constructor(grammarFileName, vocabulary, ruleNames, channelNames, modeNames, atn,
        input) {
        super(input);

        if (atn.grammarType !== ATNType.LEXER) {
            throw new Error("IllegalArgumentException: The ATN must be a lexer ATN.");
        }

        this._grammarFileName = grammarFileName;
        this._atn = atn;

        this._ruleNames = ruleNames.slice(0);
        this._channelNames = channelNames.slice(0);
        this._modeNames = modeNames.slice(0);
        this._vocabulary = vocabulary;
        this.interpreter = new LexerATNSimulator(atn, this);
    }

    get atn() {
        return this._atn;
    }

    get grammarFileName() {
        return this._grammarFileName;
    }

    get ruleNames() {
        return this._ruleNames;
    }

    get channelNames() {
        return this._channelNames;
    }

    get modeNames() {
        return this._modeNames;
    }

    get vocabulary() {
        return this._vocabulary;
    }
}
