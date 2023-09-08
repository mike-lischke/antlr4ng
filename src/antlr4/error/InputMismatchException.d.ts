/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RecognitionException } from "./RecognitionException.js";
import { Parser } from "../Parser.js";

export declare class InputMismatchException extends RecognitionException {
    public constructor(recognizer: Parser);
}
