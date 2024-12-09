/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns, @typescript-eslint/naming-convention */
/* eslint-disable jsdoc/no-undefined-types */

import { Token } from "./Token.js";
import { Lexer } from "./Lexer.js";
import { Interval } from "./misc/Interval.js";
import { TokenStream } from "./TokenStream.js";
import { TokenSource } from "./TokenSource.js";
import { ParserRuleContext } from "./ParserRuleContext.js";

/**
 * This implementation of {@link TokenStream} loads tokens from a
 * {@link TokenSource} on-demand, and places the tokens in a buffer to provide
 * access to any previous token by index.
 *
 * This token stream ignores the value of {@link Token.channel}. If your
 * parser requires the token stream filter tokens to only those on a particular
 * channel, such as {@link Token.DEFAULT_CHANNEL} or
 * {@link Token.HIDDEN_CHANNEL}, use a filtering token stream such a {@link CommonTokenStream}.
 */
export class BufferedTokenStream implements TokenStream {
    /**
     * The {@link TokenSource} from which tokens for this stream are fetched.
     */
    public tokenSource: TokenSource;

    /**
     * A collection of all tokens fetched from the token source. The list is
     * considered a complete view of the input once {@link fetchedEOF} is set
     * to `true`.
     */
    protected tokens: Token[] = [];

    /**
     * The index into {@link tokens} of the current token (next token to
     * {@link consume}). {@link tokens}`[p]` should be
     * {@link LT LT(1)}.
     *
     * This field is set to -1 when the stream is first constructed or when
     * {@link setTokenSource} is called, indicating that the first token has
     * not yet been fetched from the token source. For additional information,
     * see the documentation of {@link IntStream} for a description of
     * Initializing Methods.
     */
    protected p = -1;

    /**
     * Indicates whether the {@link Token.EOF} token has been fetched from
     * {@link tokenSource} and added to {@link tokens}. This field improves
     * performance for the following cases:
     *
     * - {@link consume}: The lookahead check in {@link consume} to prevent
     * consuming the EOF symbol is optimized by checking the values of
     * {@link fetchedEOF} and {@link p} instead of calling {@link LA}.
     * - {@link fetch}: The check to prevent adding multiple EOF symbols into
     * {@link tokens} is trivial with this field.
     */
    protected fetchedEOF = false;

    public constructor(tokenSource: TokenSource) {
        this.tokenSource = tokenSource;
    }

    public mark(): number {
        return 0;
    }

    public release(_marker: number): void {
        // no resources to release
    }

    public reset(): void {
        this.seek(0);
    }

    public seek(index: number): void {
        this.lazyInit();
        this.p = this.adjustSeekIndex(index);
    }

    public get size(): number {
        return this.tokens.length;
    }

    public get index(): number {
        return this.p;
    }

    public get(index: number): Token {
        this.lazyInit();

        return this.tokens[index];
    }

    public consume(): void {
        let skipEofCheck = false;
        if (this.p >= 0) {
            if (this.fetchedEOF) {
                // the last token in tokens is EOF. skip check if p indexes any
                // fetched token except the last.
                skipEofCheck = this.p < this.tokens.length - 1;
            } else {
                // no EOF token in tokens. skip check if p indexes a fetched token.
                skipEofCheck = this.p < this.tokens.length;
            }
        } else {
            // not yet initialized
            skipEofCheck = false;
        }

        if (!skipEofCheck && this.LA(1) === Token.EOF) {
            throw new Error("cannot consume EOF");
        }

        if (this.sync(this.p + 1)) {
            this.p = this.adjustSeekIndex(this.p + 1);
        }
    }

    /**
     * Make sure index `i` in tokens has a token.
     *
     * @returns {boolean} `true` if a token is located at index `i`, otherwise `false`.
     */
    public sync(i: number): boolean {
        const n = i - this.tokens.length + 1; // how many more elements we need?
        if (n > 0) {
            const fetched = this.fetch(n);

            return fetched >= n;
        }

        return true;
    }

    /**
     * Add `n` elements to buffer.
     *
     * @returns {number} The actual number of elements added to the buffer.
     */
    public fetch(n: number): number {
        if (this.fetchedEOF) {
            return 0;
        }

        for (let i = 0; i < n; i++) {
            const t = this.tokenSource.nextToken();
            t.tokenIndex = this.tokens.length;
            this.tokens.push(t);
            if (t.type === Token.EOF) {
                this.fetchedEOF = true;

                return i + 1;
            }
        }

        return n;
    }

    /** Get all tokens from start..stop, inclusively. */
    public getTokens(start?: number, stop?: number, types?: Set<number>): Token[] {
        this.lazyInit();

        if (start === undefined && stop === undefined) {
            return this.tokens;
        }

        start ??= 0;
        if (stop === undefined) {
            stop = this.tokens.length - 1;
        }

        if (start < 0 || stop >= this.tokens.length || stop < 0 || start >= this.tokens.length) {
            throw new RangeError("start " + start + " or stop " + stop + " not in 0.." + (this.tokens.length - 1));
        }

        if (start > stop) {
            return [];
        }

        if (types === undefined) {
            return this.tokens.slice(start, stop + 1);
        }

        const subset = [];
        if (stop >= this.tokens.length) {
            stop = this.tokens.length - 1;
        }

        for (let i = start; i < stop; i++) {
            const t = this.tokens[i];
            if (t.type === Token.EOF) {
                subset.push(t); // Also include EOF.
                break;
            }

            if (types.has(t.type)) {
                subset.push(t);
            }
        }

        return subset;
    }

    public LA(k: number): number {
        return this.LT(k)?.type ?? Token.INVALID_TYPE;
    }

    public LB(k: number): Token | null {
        if (this.p - k < 0) {
            return null;
        }

        return this.tokens[this.p - k];
    }

    public LT(k: number): Token | null {
        this.lazyInit();
        if (k === 0) {
            return null;
        }

        if (k < 0) {
            return this.LB(-k);
        }

        const i = this.p + k - 1;
        this.sync(i);
        if (i >= this.tokens.length) { // return EOF token
            // EOF must be last token
            return this.tokens[this.tokens.length - 1];
        }

        return this.tokens[i];
    }

    /**
     * Allowed derived classes to modify the behavior of operations which change
     * the current stream position by adjusting the target token index of a seek
     * operation. The default implementation simply returns `i`. If an
     * exception is thrown in this method, the current stream index should not be
     * changed.
     *
     * For example, {@link CommonTokenStream} overrides this method to ensure that
     * the seek target is always an on-channel token.
     *
     * @param  i The target token index.
     *
     * @returns The adjusted target token index.
     */
    public adjustSeekIndex(i: number): number {
        return i;
    }

    public lazyInit(): void {
        if (this.p === -1) {
            this.setup();
        }
    }

    public setup(): void {
        this.sync(0);
        this.p = this.adjustSeekIndex(0);
    }

    /** Reset this token stream by setting its token source. */
    public setTokenSource(tokenSource: TokenSource): void {
        this.tokenSource = tokenSource;
        this.tokens = [];
        this.p = -1;
        this.fetchedEOF = false;
    }

    /**
     * Given a starting index, return the index of the next token on channel.
     * Return i if tokens[i] is on channel. Return -1 if there are no tokens
     * on channel between i and EOF.
     */
    public nextTokenOnChannel(i: number, channel: number): number {
        this.sync(i);
        if (i >= this.tokens.length) {
            return -1;
        }

        let token = this.tokens[i];
        while (token.channel !== channel) {
            if (token.type === Token.EOF) {
                return -1;
            }

            i += 1;
            this.sync(i);
            token = this.tokens[i];
        }

        return i;
    }

    /**
     * Given a starting index, return the index of the previous token on
     * channel. Return `i` if `tokens[i]` is on channel. Return -1
     * if there are no tokens on channel between `i` and 0.
     *
     * If `i` specifies an index at or after the EOF token, the EOF token
     * index is returned. This is due to the fact that the EOF token is treated
     * as though it were on every channel.
     */
    public previousTokenOnChannel(i: number, channel: number): number {
        if (i >= this.tokens.length) {
            // The EOF token is on every channel.
            return this.tokens.length - 1;
        }

        while (i >= 0) {
            const token = this.tokens[i];
            if (token.type === Token.EOF || token.channel === channel) {
                return i;
            }

            --i;
        }

        return i;
    }

    /**
     * Collect all tokens on specified channel to the right of
     * the current token up until we see a token on DEFAULT_TOKEN_CHANNEL or
     * EOF. If channel is -1, find any non default channel token.
     */
    public getHiddenTokensToRight(tokenIndex: number, channel?: number): Token[] | undefined {
        if (channel === undefined) {
            channel = -1;
        }
        this.lazyInit();
        if (tokenIndex < 0 || tokenIndex >= this.tokens.length) {
            throw new Error(`${tokenIndex} not in 0..${this.tokens.length - 1}`);
        }
        const nextOnChannel = this.nextTokenOnChannel(tokenIndex + 1, Lexer.DEFAULT_TOKEN_CHANNEL);
        const from = tokenIndex + 1;

        // if none on-channel to right, nextOnChannel=-1 so set to = last token
        const to = nextOnChannel === -1 ? this.tokens.length - 1 : nextOnChannel;

        return this.filterForChannel(from, to, channel);
    }

    /**
     * Collect all tokens on specified channel to the left of
     * the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
     * If channel is -1, find any non default channel token.
     */
    public getHiddenTokensToLeft(tokenIndex: number, channel?: number): Token[] | undefined {
        if (channel === undefined) {
            channel = -1;
        }
        this.lazyInit();
        if (tokenIndex < 0 || tokenIndex >= this.tokens.length) {
            throw new Error(`${tokenIndex} not in 0..${this.tokens.length - 1}`);
        }
        const prevOnChannel = this.previousTokenOnChannel(tokenIndex - 1, Lexer.DEFAULT_TOKEN_CHANNEL);
        if (prevOnChannel === tokenIndex - 1) {
            return undefined;
        }

        // If none on channel to left, prevOnChannel = -1 then from = 0.
        const from = prevOnChannel + 1;
        const to = tokenIndex - 1;

        return this.filterForChannel(from, to, channel);
    }

    public filterForChannel(left: number, right: number, channel: number): Token[] | undefined {
        const hidden = [];
        for (let i = left; i < right + 1; i++) {
            const t = this.tokens[i];
            if (channel === -1) {
                if (t.channel !== Lexer.DEFAULT_TOKEN_CHANNEL) {
                    hidden.push(t);
                }
            } else if (t.channel === channel) {
                hidden.push(t);
            }
        }

        if (hidden.length === 0) {
            return undefined;
        }

        return hidden;
    }

    public getSourceName(): string {
        return this.tokenSource.sourceName;
    }

    /** Get the text of all tokens in this buffer. */
    public getText(): string {
        return this.getTextFromInterval(Interval.of(0, this.size - 1));
    }

    public getTextFromInterval(interval: Interval): string {
        const start = interval.start;
        let stop = interval.stop;
        if (start < 0 || stop < 0) {
            return "";
        }

        this.sync(stop);
        if (stop >= this.tokens.length) {
            stop = this.tokens.length - 1;
        }

        let result = "";
        for (let i = start; i <= stop; ++i) {
            const t = this.tokens[i];
            if (t.type === Token.EOF) {
                break;
            }

            result += t.text;
        }

        return result;

    }

    public getTextFromContext(ctx: ParserRuleContext): string {
        return this.getTextFromInterval(ctx.getSourceInterval());
    }

    public getTextFromRange(start: Token | null, stop: Token | null): string {
        if (start !== null && stop !== null) {
            return this.getTextFromInterval(Interval.of(start.tokenIndex, stop.tokenIndex));
        }

        return "";
    }

    /** Get all tokens from lexer until EOF. */
    public fill(): void {
        this.lazyInit();
        while (this.fetch(1000) === 1000) { ; }
    }

    public setLine(line: number): void {
        this.tokenSource.line = line;
    }

    public setColumn(column: number): void {
        this.tokenSource.column = column;
    }
}
