/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException } from "./RecognitionException.js";

/**
 * This signifies any kind of mismatched input exceptions such as
 * when the current input does not match the expected token.
 */
export class InputMismatchException extends RecognitionException {
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
 offendingToken: any;
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
 constructor(recognizer: any) {
     // eslint-disable-next-line object-shorthand, no-underscore-dangle
     super({ message: "", recognizer: recognizer, input: recognizer.inputStream, ctx: recognizer._ctx });
     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
     this.offendingToken = recognizer.getCurrentToken();
 }
}
