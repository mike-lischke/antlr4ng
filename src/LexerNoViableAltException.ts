/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Interval } from "./misc/Interval.js";
import { RecognitionException } from "./RecognitionException.js";

export class LexerNoViableAltException extends RecognitionException {
    deadEndConfigs: any;
    input: any;
    startIndex: any;
    constructor(lexer: any, input: any, startIndex: any, deadEndConfigs: any) {
        super({ message: "", recognizer: lexer, input: input, ctx: null });
        this.startIndex = startIndex;
        this.deadEndConfigs = deadEndConfigs;
    }

    toString() {
        let symbol = "";
        if (this.startIndex >= 0 && this.startIndex < this.input.size) {
            symbol = this.input.getText(new Interval(this.startIndex, this.startIndex));
        }
        return "LexerNoViableAltException" + symbol;
    }
}
