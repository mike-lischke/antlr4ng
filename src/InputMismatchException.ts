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
 offendingToken: any;
 constructor(recognizer: any) {
     super({ message: "", recognizer: recognizer, input: recognizer.inputStream, ctx: recognizer._ctx });
     this.offendingToken = recognizer.getCurrentToken();
 }
}
