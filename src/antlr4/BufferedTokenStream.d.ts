/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TokenStream } from "./TokenStream.js";
import { TokenSource } from "./TokenSource.js";
import { Token } from "./Token.js";
import type { CommonTokenStream } from "./CommonTokenStream.js";
import { Interval } from "./misc/Interval.js";

/**
 * This implementation of {@link TokenStream} loads tokens from a
 * {@link TokenSource} on-demand, and places the tokens in a buffer to provide
 * access to any previous token by index.
 *
 * <p>
 * This token stream ignores the value of {@link Token#getChannel}. If your
 * parser requires the token stream filter tokens to only those on a particular
 * channel, such as {@link Token#DEFAULT_CHANNEL} or
 * {@link Token#HIDDEN_CHANNEL}, use a filtering token stream such a
 * {@link CommonTokenStream}.</p>
 */
export declare class BufferedTokenStream implements TokenStream {
    public index: number;

    /**
     * The {@link TokenSource} from which tokens for this stream are fetched.
     */
    protected tokenSource: TokenSource;

    /**
     * A collection of all tokens fetched from the token source. The list is
     * considered a complete view of the input once {@link #fetchedEOF} is set
     * to {@code true}.
     */
    protected tokens: Token[];

    /**
     * Indicates whether the {@link Token#EOF} token has been fetched from
     * {@link #tokenSource} and added to {@link #tokens}. This field improves
     * performance for the following cases:
     *
     * <ul>
     * <li>{@link #consume}: The lookahead check in {@link #consume} to prevent
     * consuming the EOF symbol is optimized by checking the values of
     * {@link #fetchedEOF} and {@link #p} instead of calling {@link #LA}.</li>
     * <li>{@link #fetch}: The check to prevent adding multiple EOF symbols into
     * {@link #tokens} is trivial with this field.</li>
     * <ul>
     */
    protected fetchedEOF: boolean;

    public constructor(tokenSource: TokenSource);

    public getTokenSource(): TokenSource;

    public mark(): number;
    public release(marker: number): void;

    public reset(): void;
    public seek(index: number): void;
    public get size(): number;

    public consume(): void;
    public sync(i: number): number;
    public fetch(n: number): void;

    public get(i: number): Token;
    public get(start: number, stop: number): Token[];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LA(i: number): number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LT(k: number): Token;

    /** Reset this token stream by setting its token source. */
    public setTokenSource(tokenSource: TokenSource): void;

    /**
     * Given a start and stop index, return a List of all tokens in
     *  the token type BitSet.  Return null if no tokens were found.  This
     *  method looks at both on and off channel tokens.
     */
    public getTokens(): Token[];
    public getTokens(start: number, stop: number): Token[];
    public getTokens(start: number, stop: number, types: Set<number>): Token[];

    /**
     * Collect all tokens on specified channel to the right of
     *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL or
     *  EOF. If channel is -1, find any non default channel token.
     */
    public hiddenTokensToRight(tokenIndex: number): Token[];
    public hiddenTokensToRight(tokenIndex: number, channel: number): Token[];

    /**
     * Collect all tokens on specified channel to the left of
     *  the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
     *  If channel is -1, find any non default channel token.
     */
    public hiddenTokensToLeft(tokenIndex: number): Token[];
    public hiddenTokensToLeft(tokenIndex: number, channel: number): Token[];

    public getSourceName(): string;

    /** Get all tokens from lexer until EOF */
    public fill(): void;

    public getText(): string;
    public getText(interval: Interval): string;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    protected LB(k: number): Token;

    /**
     * Given a starting index, return the index of the next token on channel.
     * Return {@code i} if {@code tokens[i]} is on channel. Return the index of
     * the EOF token if there are no tokens on channel between {@code i} and
     * EOF.
     */
    protected nextTokenOnChannel(i: number, channel: number): number;

    /**
     * Given a starting index, return the index of the previous token on
     * channel. Return {@code i} if {@code tokens[i]} is on channel. Return -1
     * if there are no tokens on channel between {@code i} and 0.
     *
     * <p>
     * If {@code i} specifies an index at or after the EOF token, the EOF token
     * index is returned. This is due to the fact that the EOF token is treated
     * as though it were on every channel.</p>
     */
    protected previousTokenOnChannel(i: number, channel: number): number;

    protected filterForChannel(left: number, right: number, channel: number): number;

}
