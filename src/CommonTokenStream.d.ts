/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Lexer } from "./Lexer.js";
import { BufferedTokenStream } from "./BufferedTokenStream.js";

export declare class CommonTokenStream extends BufferedTokenStream {
    public constructor(lexer: Lexer);
    public constructor(lexer: Lexer, channel: number);
}
