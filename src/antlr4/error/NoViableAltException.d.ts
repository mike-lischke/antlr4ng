/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNConfigSet } from "../atn/ATNConfigSet.js";
import ATNSimulator from "../atn/ATNSimulator.js";
import { Recognizer } from "../Recognizer.js";
import { Token } from "../Token.js";
import { RecognitionException } from "./RecognitionException.js";

export declare class NoViableAltException extends RecognitionException {
    public deadEndConfigs: ATNConfigSet;
    public startToken: Token;

    public constructor(recognizer: Recognizer<ATNSimulator>);
}
