/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream } from "./CharStream.js";
import { IntStream } from "./IntStream.js";
import { TokenSource } from "./TokenSource.js";

/* eslint-disable @typescript-eslint/naming-convention */

/**
 * A token has properties: text, type, line, character position in the line
 * (so we can ignore tabs), token channel, index, and source from which
 * we obtained this token.
 */
export interface Token {
    /**
     * Get the text of the token.
     */
    text: string | null;

    /** Get the token type of the token */
    type: number;

    /**
     * The line number on which the 1st character of this token was matched,
     *  line=1..n
     */
    line: number;

    /**
     * The index of the first character of this token relative to the
     *  beginning of the line at which it occurs, 0..n-1
     */
    column: number;

    /**
     * Return the channel this token. Each token can arrive at the parser
     *  on a different channel, but the parser only "tunes" to a single channel.
     *  The parser ignores everything not on DEFAULT_CHANNEL.
     */
    channel: number;

    /**
     * An index from 0..n-1 of the token object in the input stream.
     *  This must be valid in order to print token streams and
     *  use TokenRewriteStream.
     *
     *  Return -1 to indicate that this token was conjured up since
     *  it doesn't have a valid index.
     */
    tokenIndex: number;

    /**
     * The starting character index of the token
     *  This method is optional; return -1 if not implemented.
     */
    start: number;

    /**
     * The last character index of the token.
     *  This method is optional; return -1 if not implemented.
     */
    stop: number;

    /**
      Gets the {@link TokenSource} which created this token.
     */
    get tokenSource(): TokenSource | null;

    /**
     * Gets the {@link CharStream} from which this token was derived.
     */
    get inputStream(): CharStream | null;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Token {
    export const INVALID_TYPE: number = 0;

    /**
     * During lookahead operations, this "token" signifies we hit rule end ATN state
     * and did not follow it despite needing to.
     */
    export const EPSILON: number = -2;

    export const MIN_USER_TOKEN_TYPE: number = 1;

    export const EOF = IntStream.EOF;

    /**
     * All tokens go to the parser (unless skip() is called in that rule)
     * on a particular "channel". The parser tunes to a particular channel
     * so that whitespace etc... can go to the parser on a "hidden" channel.
     */
    export const DEFAULT_CHANNEL: number = 0;

    /**
     * Anything on different channel than DEFAULT_CHANNEL is not parsed
     * by parser.
     */
    export const HIDDEN_CHANNEL: number = 1;

    /**
     * This is the minimum constant value which can be assigned to a
     * user-defined token channel.
     *
     * <p>
     * The non-negative numbers less than {@link #MIN_USER_CHANNEL_VALUE} are
     * assigned to the predefined channels {@link #DEFAULT_CHANNEL} and
     * {@link #HIDDEN_CHANNEL}.</p>
     *
     * @see Token#getChannel()
     */
    export const MIN_USER_CHANNEL_VALUE: number = 2;
}

export const isToken = (candidate: unknown): candidate is Token => {
    const token = candidate as Token;

    return token.tokenSource !== undefined && token.channel !== undefined;
};
