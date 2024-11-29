/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import type { ParserRuleContext } from "./ParserRuleContext.js";
import { Token } from "./Token.js";
import type { TokenSource } from "./TokenSource.js";
import type { TokenStream } from "./TokenStream.js";
import { isWritableToken } from "./WritableToken.js";
import { Interval } from "./misc/Interval.js";

export class UnbufferedTokenStream implements TokenStream {
    public readonly tokenSource: TokenSource;

    /**
     * A moving window buffer of the data being scanned. While there's a marker,
     * we keep adding to buffer. Otherwise, {@link #consume consume()} resets so
     * we start filling at index 0 again.
     */
    protected tokens: Token[];

    /**
     * The number of tokens currently in {@link #tokens tokens}.
     *
     * This is not the buffer capacity, that's `tokens.length`.
     */
    protected n: number;

    /**
     * 0..n-1 index into {@link #tokens tokens} of next token.
     *
     * The `LT(1)` token is `tokens[p]`. If `p == n`, we are
     * out of buffered tokens.
     */
    protected p = 0;

    /**
     * Count up with {@link #mark mark()} and down with
     * {@link #release release()}. When we `release()` the last mark,
     * `numMarkers` reaches 0 and we reset the buffer. Copy
     * `tokens[p]..tokens[n-1]` to `tokens[0]..tokens[(n-1)-p]`.
     */
    protected numMarkers = 0;

    /**
     * This is the `LT(-1)` token for the current position.
     */
    protected lastToken: Token;

    /**
     * When `numMarkers > 0`, this is the `LT(-1)` token for the
     * first token in {@link #tokens}. Otherwise, this is `null`.
     */
    protected lastTokenBufferStart: Token;

    /**
     * Absolute token index. It's the index of the token about to be read via
     * `LT(1)`. Goes from 0 to the number of tokens in the entire stream,
     * although the stream size is unknown before the end is reached.
     *
     * This value is used to set the token indexes if the stream provides tokens
     * that implement {@link WritableToken}.
     */
    protected currentTokenIndex = 0;

    public constructor(tokenSource: TokenSource, bufferSize?: number) {
        this.tokenSource = tokenSource;
        bufferSize = bufferSize ?? 256;
        this.tokens = new Array<Token>(bufferSize);
        this.n = 0;
        this.fill(1); // prime the pump
    }

    public get(i: number): Token { // get absolute index
        const bufferStartIndex = this.getBufferStartIndex();
        if (i < bufferStartIndex || i >= bufferStartIndex + this.n) {
            throw new Error("get(" + i + ") outside buffer: " +
                bufferStartIndex + ".." + (bufferStartIndex + this.n));
        }

        return this.tokens[i - bufferStartIndex];
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LT(i: number): Token {
        if (i === -1) {
            return this.lastToken;
        }

        this.sync(i);
        const index = this.p + i - 1;
        if (index < 0) {
            throw new Error("LT(" + i + ") gives negative index");
        }

        if (index >= this.n) {
            return this.tokens[this.n - 1];
        }

        return this.tokens[index];
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LA(i: number): number {
        return this.LT(i).type;
    }

    public getText(): string {
        return "";
    }

    public getTextFromContext(ctx: ParserRuleContext): string {
        return this.getTextFromInterval(ctx.getSourceInterval());
    }

    public getTextFromInterval(interval: Interval): string {
        const bufferStartIndex = this.getBufferStartIndex();
        const bufferStopIndex = bufferStartIndex + this.tokens.length - 1;

        const start = interval.start;
        const stop = interval.stop;
        if (start < bufferStartIndex || stop > bufferStopIndex) {
            throw new Error("interval " + interval + " not in token buffer window: " +
                bufferStartIndex + ".." + bufferStopIndex);
        }

        const a = start - bufferStartIndex;
        const b = stop - bufferStartIndex;

        let result = "";
        for (let i = a; i <= b; i++) {
            const t = this.tokens[i];
            result += t.text;
        }

        return result;
    }

    public getTextFromRange(start: Token, stop: Token): string {
        return this.getTextFromInterval(Interval.of(start.tokenIndex, stop.tokenIndex));
    }

    public consume(): void {
        if (this.LA(1) === Token.EOF) {
            throw new Error("cannot consume EOF");
        }

        // buf always has at least tokens[p==0] in this method due to ctor
        this.lastToken = this.tokens[this.p];   // track last token for LT(-1)

        // if we're at last token and no markers, opportunity to flush buffer
        if (this.p === this.n - 1 && this.numMarkers === 0) {
            this.n = 0;
            this.p = -1; // p++ will leave this at 0
            this.lastTokenBufferStart = this.lastToken;
        }

        this.p++;
        this.currentTokenIndex++;
        this.sync(1);
    }

    /**
     * Return a marker that we can release later.
     *
     * The specific marker value used for this class allows for some level of
     * protection against misuse where `seek()` is called on a mark or
     * `release()` is called in the wrong order.
     */
    public mark(): number {
        if (this.numMarkers === 0) {
            this.lastTokenBufferStart = this.lastToken;
        }

        const mark = -this.numMarkers - 1;
        this.numMarkers++;

        return mark;
    }

    public release(marker: number): void {
        const expectedMark = -this.numMarkers;
        if (marker !== expectedMark) {
            throw new Error("release() called with an invalid marker.");
        }

        this.numMarkers--;
        if (this.numMarkers === 0) { // can we release buffer?
            if (this.p > 0) {
                // Copy tokens[p]..tokens[n-1] to tokens[0]..tokens[(n-1)-p], reset pointers.
                // p is last valid token; move nothing if p==n as we have no valid char
                this.tokens.copyWithin(0, this.p, this.n);
                this.n = this.n - this.p;
                this.p = 0;
            }

            this.lastTokenBufferStart = this.lastToken;
        }
    }

    public get index(): number {
        return this.currentTokenIndex;
    }

    public seek(index: number): void { // seek to absolute index
        if (index === this.currentTokenIndex) {
            return;
        }

        if (index > this.currentTokenIndex) {
            this.sync(index - this.currentTokenIndex);
            index = Math.min(index, this.getBufferStartIndex() + this.n - 1);
        }

        const bufferStartIndex = this.getBufferStartIndex();
        const i = index - bufferStartIndex;
        if (i < 0) {
            throw new Error("cannot seek to negative index " + index);
        } else {
            if (i >= this.n) {
                throw new Error("seek to index outside buffer: " +
                    index + " not in " + bufferStartIndex + ".." + (bufferStartIndex + this.n));
            }
        }

        this.p = i;
        this.currentTokenIndex = index;
        if (this.p === 0) {
            this.lastToken = this.lastTokenBufferStart;
        } else {
            this.lastToken = this.tokens[this.p - 1];
        }
    }

    public get size(): number {
        throw new Error("Unbuffered stream cannot know its size");
    }

    public getSourceName(): string {
        return this.tokenSource.sourceName;
    }

    public setLine(line: number): void {
        this.tokenSource.line = line;
    }

    public setColumn(column: number): void {
        this.tokenSource.column = column;
    }

    /**
     * Make sure we have 'need' elements from current position {@link #p p}. Last valid
     * `p` index is `tokens.length-1`.  `p+need-1` is the tokens index 'need' elements
     * ahead.  If we need 1 element, `(p+1-1)==p` must be less than `tokens.length`.
     */
    protected sync(want: number): void {
        const need = (this.p + want - 1) - this.n + 1; // how many more elements we need?
        if (need > 0) {
            this.fill(need);
        }
    }

    /**
     * Add `n` elements to the buffer. Returns the number of tokens
     * actually added to the buffer. If the return value is less than `n`,
     * then EOF was reached before `n` tokens could be added.
     */
    protected fill(n: number): number {
        for (let i = 0; i < n; i++) {
            if (this.n > 0 && this.tokens[this.n - 1].type === Token.EOF) {
                return i;
            }

            const t = this.tokenSource.nextToken();
            this.add(t);
        }

        return n;
    }

    protected add(t: Token): void {
        if (this.n >= this.tokens.length) {
            this.tokens.length = this.tokens.length * 2;
        }

        if (isWritableToken(t)) {
            t.setTokenIndex(this.getBufferStartIndex() + this.n);
        }

        this.tokens[this.n++] = t;
    }

    protected getBufferStartIndex(): number {
        return this.currentTokenIndex - this.p;
    }
}
