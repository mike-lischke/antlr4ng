/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import CharStream from "../CharStream.js";
import Lexer from "../Lexer.js";
import TokenStream from "../TokenStream.js";
import ATNConfigSet from "../atn/ATNConfigSet.js";
import RecognitionException from "./RecognitionException.js";

export declare class LexerNoViableAltException extends RecognitionException {
    public startIndex: number;
    public deadEndConfigs: ATNConfigSet;

    public constructor(lexer: Lexer, input: CharStream | TokenStream, startIndex: number,
        deadEndConfigs: ATNConfigSet);

    public toString(): string;
}

export default LexerNoViableAltException;
