/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNConfigSet } from "./atn/ATNConfigSet.js";
import { CharStream } from "./CharStream.js";
import { Lexer } from "./Lexer.js";
import { RecognitionException } from "./RecognitionException.js";
import { TokenStream } from "./TokenStream.js";

export class LexerNoViableAltException extends RecognitionException {
    public startIndex: number;
    public deadEndConfigs: ATNConfigSet;

    protected declare input: CharStream | null;

    public constructor(lexer: Lexer | null, input: CharStream | TokenStream, startIndex: number,
        deadEndConfigs: ATNConfigSet) {
        super({ message: "", recognizer: lexer, input, ctx: null });
        this.startIndex = startIndex;
        this.deadEndConfigs = deadEndConfigs;
    }

    public override toString(): string {
        let symbol = "";
        if (this.input && this.startIndex >= 0 && this.startIndex < this.input.size) {
            symbol = this.input.getTextFromRange(this.startIndex, this.startIndex);
        }

        return "LexerNoViableAltException" + symbol;
    }
}
