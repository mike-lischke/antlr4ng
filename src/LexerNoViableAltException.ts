/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Interval } from "./misc/Interval.js";
import { RecognitionException } from "./RecognitionException.js";

export class LexerNoViableAltException extends RecognitionException {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    deadEndConfigs: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    input: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    startIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(lexer: any, input: any, startIndex: any, deadEndConfigs: any) {
        // eslint-disable-next-line object-shorthand
        super({ message: "", recognizer: lexer, input: input, ctx: null });
        this.startIndex = startIndex;
        this.deadEndConfigs = deadEndConfigs;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        let symbol = "";
        if (this.startIndex >= 0 && this.startIndex < this.input.size) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            symbol = this.input.getText(new Interval(this.startIndex, this.startIndex));
        }
        // eslint-disable-next-line padding-line-between-statements
        return "LexerNoViableAltException" + symbol;
    }
}
