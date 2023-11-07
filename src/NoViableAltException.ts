/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Parser } from "./Parser.js";
import { ParserRuleContext } from "./ParserRuleContext.js";
import { RecognitionException } from "./RecognitionException.js";
import { Token } from "./Token.js";
import { TokenStream } from "./TokenStream.js";
import { ATNConfigSet } from "./atn/ATNConfigSet.js";

/**
 * Indicates that the parser could not decide which of two or more paths
 * to take based upon the remaining input. It tracks the starting token
 * of the offending input and also knows where the parser was
 * in the various paths when the error. Reported by reportNoViableAlternative()
 */
export class NoViableAltException extends RecognitionException {
    /** Which configurations did we try at input.index() that couldn't match input.LT(1)? */

    public readonly deadEndConfigs: ATNConfigSet | null = null;

    /**
     * The token object at the start index; the input stream might
     * 	not be buffering tokens so get a reference to it. (At the
     *  time the error occurred, of course the stream needs to keep a
     *  buffer all of the tokens but later we might not have access to those.)
     */

    public readonly startToken: Token | null;

    public constructor(recognizer: Parser, input: TokenStream | null = null, startToken: Token | null = null,
        offendingToken: Token | null = null, deadEndConfigs: ATNConfigSet | null = null,
        ctx: ParserRuleContext | null = null) {
        ctx = ctx ?? recognizer.context;
        offendingToken = offendingToken ?? recognizer.getCurrentToken();
        startToken = startToken ?? recognizer.getCurrentToken();
        input = input ?? recognizer.inputStream;

        super({ message: "", recognizer, input, ctx });

        // Which configurations did we try at input.index() that couldn't match
        // input.LT(1)?//
        this.deadEndConfigs = deadEndConfigs;

        // The token object at the start index; the input stream might
        // not be buffering tokens so get a reference to it. (At the
        // time the error occurred, of course the stream needs to keep a
        // buffer all of the tokens but later we might not have access to those.)
        this.startToken = startToken;
        this.offendingToken = offendingToken;
    }
}
