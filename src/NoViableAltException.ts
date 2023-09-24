/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException } from "./RecognitionException.js";

/**
 * Indicates that the parser could not decide which of two or more paths
 * to take based upon the remaining input. It tracks the starting token
 * of the offending input and also knows where the parser was
 * in the various paths when the error. Reported by reportNoViableAlternative()
 */
export class NoViableAltException extends RecognitionException {
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
 deadEndConfigs: any;
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
 offendingToken: any;
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
 startToken: any;
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
 constructor(recognizer: any, input: any, startToken: any, offendingToken: any, deadEndConfigs: any, ctx: any) {
     // eslint-disable-next-line no-underscore-dangle
     ctx = ctx ?? recognizer._ctx;
     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
     offendingToken = offendingToken ?? recognizer.getCurrentToken();
     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
     startToken = startToken ?? recognizer.getCurrentToken();
     input = input ?? recognizer.inputStream;

     // eslint-disable-next-line object-shorthand
     super({ message: "", recognizer: recognizer, input: input, ctx: ctx });

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
