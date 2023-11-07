/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from "./Token.js";

/**
 * This interface provides access to all of the information about a token by
 * exposing the properties of the token as getter methods.
 */
export interface WritableToken extends Token {
    setText(text: string | null): void;

    setType(ttype: number): void;

    setLine(line: number): void;

    setCharPositionInLine(pos: number): void;

    setChannel(channel: number): void;

    setTokenIndex(index: number): void;

    toString(): string;
}

export const isWritableToken = (candidate: unknown): candidate is WritableToken => {
    return (candidate as WritableToken).setText !== undefined;
};
