/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { InputStream } from "./InputStream.js";
import { Token } from "./Token.js";
import { TokenSource } from "./TokenSource.js";

export declare class TokenFactory<Symbol extends Token> {
    /**
     * This is the method used to create tokens in the lexer and in the
     *  error handling strategy. If text!=null, than the start and stop positions
     *  are wiped to -1 in the text override is set in the CommonToken.
     */
    public create(source: [TokenSource | null, InputStream | null], type: number, text: string | null, channel: number,
        start: number, stop: number, line: number, charPositionInLine: number): Symbol;
}
