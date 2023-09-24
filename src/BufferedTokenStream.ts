/* eslint-disable jsdoc/no-undefined-types, jsdoc/require-param, jsdoc/require-returns, jsdoc/check-tag-names, jsdoc/check-types, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from './Token.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { Lexer } from './Lexer.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { Interval } from './misc/Interval.js';
import { TokenStream } from "./TokenStream.js";

/**
 * This implementation of {@link TokenStream} loads tokens from a
 * {@link TokenSource} on-demand, and places the tokens in a buffer to provide
 * access to any previous token by index.
 *
 * <p>
 * This token stream ignores the value of {@link Token//getChannel}. If your
 * parser requires the token stream filter tokens to only those on a particular
 * channel, such as {@link Token//DEFAULT_CHANNEL} or
 * {@link Token//HIDDEN_CHANNEL}, use a filtering token stream such a
 * {@link CommonTokenStream}.</p>
 */
export class BufferedTokenStream extends TokenStream {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _index: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    channel: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    fetchedEOF: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokenSource: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokens: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(tokenSource: any) {

        super();
        // The {@link TokenSource} from which tokens for this stream are fetched.
        this.tokenSource = tokenSource;
        /**
         * A collection of all tokens fetched from the token source. The list is
         * considered a complete view of the input once {@link //fetchedEOF} is set
         * to {@code true}.
         */
        this.tokens = [];

        /**
         * The index into {@link //tokens} of the current token (next token to
         * {@link //consume}). {@link //tokens}{@code [}{@link //p}{@code ]} should
         * be
         * {@link //LT LT(1)}.
         *
         * <p>This field is set to -1 when the stream is first constructed or when
         * {@link //setTokenSource} is called, indicating that the first token has
         * not yet been fetched from the token source. For additional information,
         * see the documentation of {@link IntStream} for a description of
         * Initializing Methods.</p>
         */
        // eslint-disable-next-line no-underscore-dangle
        this._index = -1;

        /**
         * Indicates whether the {@link Token//EOF} token has been fetched from
         * {@link //tokenSource} and added to {@link //tokens}. This field improves
         * performance for the following cases:
         *
         * <ul>
         * <li>{@link //consume}: The lookahead check in {@link //consume} to
         * prevent
         * consuming the EOF symbol is optimized by checking the values of
         * {@link //fetchedEOF} and {@link //p} instead of calling {@link
         * //LA}.</li>
         * <li>{@link //fetch}: The check to prevent adding multiple EOF symbols
         * into
         * {@link //tokens} is trivial with this field.</li>
         * <ul>
         */
        this.fetchedEOF = false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    mark() {
        return 0;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    release(marker: any) {
        // no resources to release
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    reset() {
        this.seek(0);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    seek(index: any) {
        this.lazyInit();
        // eslint-disable-next-line no-underscore-dangle
        this._index = this.adjustSeekIndex(index);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get size() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.tokens.length;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get index() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._index;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    get(index: any) {
        this.lazyInit();
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return this.tokens[index];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    consume() {
        let skipEofCheck = false;
        // eslint-disable-next-line no-underscore-dangle
        if (this._index >= 0) {
            if (this.fetchedEOF) {
                // the last token in tokens is EOF. skip check if p indexes any
                // fetched token except the last.
                // eslint-disable-next-line no-underscore-dangle
                skipEofCheck = this._index < this.tokens.length - 1;
            } else {
                // no EOF token in tokens. skip check if p indexes a fetched token.
                // eslint-disable-next-line no-underscore-dangle
                skipEofCheck = this._index < this.tokens.length;
            }
        } else {
            // not yet initialized
            skipEofCheck = false;
        }
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (!skipEofCheck && this.LA(1) === Token.EOF) {
            // eslint-disable-next-line no-throw-literal
            throw "cannot consume EOF";
        }
        // eslint-disable-next-line no-underscore-dangle
        if (this.sync(this._index + 1)) {
            // eslint-disable-next-line no-underscore-dangle
            this._index = this.adjustSeekIndex(this._index + 1);
        }
    }

    /**
     * Make sure index {@code i} in tokens has a token.
     *
     * @return {Boolean} {@code true} if a token is located at index {@code i}, otherwise
     * {@code false}.
     * @see //get(int i)
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    sync(i: any) {
        const n = i - this.tokens.length + 1; // how many more elements we need?
        if (n > 0) {
            const fetched = this.fetch(n);
            // eslint-disable-next-line padding-line-between-statements
            return fetched >= n;
        }
        // eslint-disable-next-line padding-line-between-statements
        return true;
    }

    /**
     * Add {@code n} elements to buffer.
     *
     * @return {Number} The actual number of elements added to the buffer.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    fetch(n: any) {
        if (this.fetchedEOF) {
            return 0;
        }
        for (let i = 0; i < n; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const t = this.tokenSource.nextToken();
            t.tokenIndex = this.tokens.length;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.tokens.push(t);
            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            if (t.type === Token.EOF) {
                this.fetchedEOF = true;
                // eslint-disable-next-line padding-line-between-statements
                return i + 1;
            }
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return n;
    }

    // Get all tokens from start..stop inclusively///
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getTokens(start: any, stop: any, types: any) {
        this.lazyInit();

        if (start === undefined && stop === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.tokens;
        }

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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return this.tokens.slice(start, stop + 1);
        }

        const subset = [];
        if (stop >= this.tokens.length) {
            stop = this.tokens.length - 1;
        }

        for (let i = start; i < stop; i++) {
            const t = this.tokens[i];
            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            if (t.type === Token.EOF) {
                subset.push(t); // Also include EOF.
                break;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (types.contains(t.type)) {
                subset.push(t);
            }
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return subset;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    LA(i: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.LT(i).type;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    LB(k: any) {
        // eslint-disable-next-line no-underscore-dangle
        if (this._index - k < 0) {
            return null;
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this.tokens[this._index - k];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    LT(k: any) {
        this.lazyInit();
        if (k === 0) {
            return null;
        }
        if (k < 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.LB(-k);
        }
        // eslint-disable-next-line no-underscore-dangle
        const i = this._index + k - 1;
        this.sync(i);
        if (i >= this.tokens.length) { // return EOF token
            // EOF must be last token
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.tokens[this.tokens.length - 1];
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return this.tokens[i];
    }

    /**
     * Allowed derived classes to modify the behavior of operations which change
     * the current stream position by adjusting the target token index of a seek
     * operation. The default implementation simply returns {@code i}. If an
     * exception is thrown in this method, the current stream index should not be
     * changed.
     *
     * <p>For example, {@link CommonTokenStream} overrides this method to ensure
     * that
     * the seek target is always an on-channel token.</p>
     *
     * @param {Number} i The target token index.
     * @return {Number} The adjusted target token index.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    adjustSeekIndex(i: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return i;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    lazyInit() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._index === -1) {
            this.setup();
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    setup() {
        this.sync(0);
        // eslint-disable-next-line no-underscore-dangle
        this._index = this.adjustSeekIndex(0);
    }

    // Reset this token stream by setting its token source.///
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    setTokenSource(tokenSource: any) {
        this.tokenSource = tokenSource;
        this.tokens = [];
        // eslint-disable-next-line no-underscore-dangle
        this._index = -1;
        this.fetchedEOF = false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getTokenSource() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.tokenSource;
    }

    /**
     * Given a starting index, return the index of the next token on channel.
     * Return i if tokens[i] is on channel. Return -1 if there are no tokens
     * on channel between i and EOF.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    nextTokenOnChannel(i: any, channel: any) {
        this.sync(i);
        if (i >= this.tokens.length) {
            return -1;
        }
        let token = this.tokens[i];
        while (token.channel !== this.channel) {
            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            if (token.type === Token.EOF) {
                return -1;
            }
            i += 1;
            this.sync(i);
            token = this.tokens[i];
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return i;
    }

    /**
     * Given a starting index, return the index of the previous token on channel.
     * Return i if tokens[i] is on channel. Return -1 if there are no tokens
     * on channel between i and 0.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    previousTokenOnChannel(i: any, channel: any) {
        while (i >= 0 && this.tokens[i].channel !== channel) {
            i -= 1;
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return i;
    }

    /**
     * Collect all tokens on specified channel to the right of
     * the current token up until we see a token on DEFAULT_TOKEN_CHANNEL or
     * EOF. If channel is -1, find any non default channel token.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getHiddenTokensToRight(tokenIndex: any,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        channel: any) {
        if (channel === undefined) {
            channel = -1;
        }
        this.lazyInit();
        if (tokenIndex < 0 || tokenIndex >= this.tokens.length) {
            // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
            // eslint-disable-next-line no-throw-literal
            throw "" + tokenIndex + " not in 0.." + this.tokens.length - 1;
        }
        // @ts-expect-error TS(2339): Property 'DEFAULT_TOKEN_CHANNEL' does not exist on... Remove this comment to see the full error message
        const nextOnChannel = this.nextTokenOnChannel(tokenIndex + 1, Lexer.DEFAULT_TOKEN_CHANNEL);
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
        const from_ = tokenIndex + 1;
        // if none onchannel to right, nextOnChannel=-1 so set to = last token
        const to = nextOnChannel === -1 ? this.tokens.length - 1 : nextOnChannel;
        // eslint-disable-next-line padding-line-between-statements
        return this.filterForChannel(from_, to, channel);
    }

    /**
     * Collect all tokens on specified channel to the left of
     * the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
     * If channel is -1, find any non default channel token.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getHiddenTokensToLeft(tokenIndex: any,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        channel: any) {
        if (channel === undefined) {
            channel = -1;
        }
        this.lazyInit();
        if (tokenIndex < 0 || tokenIndex >= this.tokens.length) {
            // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
            // eslint-disable-next-line no-throw-literal
            throw "" + tokenIndex + " not in 0.." + this.tokens.length - 1;
        }
        // @ts-expect-error TS(2339): Property 'DEFAULT_TOKEN_CHANNEL' does not exist on... Remove this comment to see the full error message
        const prevOnChannel = this.previousTokenOnChannel(tokenIndex - 1, Lexer.DEFAULT_TOKEN_CHANNEL);
        if (prevOnChannel === tokenIndex - 1) {
            return null;
        }
        // if none on channel to left, prevOnChannel=-1 then from=0
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
        const from_ = prevOnChannel + 1;
        const to = tokenIndex - 1;
        // eslint-disable-next-line padding-line-between-statements
        return this.filterForChannel(from_, to, channel);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    filterForChannel(left: any, right: any, channel: any) {
        const hidden = [];
        for (let i = left; i < right + 1; i++) {
            const t = this.tokens[i];
            if (channel === -1) {
                // @ts-expect-error TS(2339): Property 'DEFAULT_TOKEN_CHANNEL' does not exist on... Remove this comment to see the full error message
                if (t.channel !== Lexer.DEFAULT_TOKEN_CHANNEL) {
                    hidden.push(t);
                }
            } else if (t.channel === channel) {
                hidden.push(t);
            }
        }
        if (hidden.length === 0) {
            return null;
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return hidden;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getSourceName() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.tokenSource.sourceName;
    }

    // Get the text of all tokens in this buffer.///
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getText(interval: any) {
        this.lazyInit();
        this.fill();
        if (!interval) {
            interval = new Interval(0, this.tokens.length - 1);
        }
        let start = interval.start;
        if (start instanceof Token) {
            start = start.tokenIndex;
        }
        let stop = interval.stop;
        if (stop instanceof Token) {
            stop = stop.tokenIndex;
        }
        if (start === null || stop === null || start < 0 || stop < 0) {
            return "";
        }
        if (stop >= this.tokens.length) {
            stop = this.tokens.length - 1;
        }
        let s = "";
        for (let i = start; i < stop + 1; i++) {
            const t = this.tokens[i];
            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            if (t.type === Token.EOF) {
                break;
            }
            s = s + t.text;
        }
        // eslint-disable-next-line padding-line-between-statements
        return s;
    }

    // Get all tokens from lexer until EOF///
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    fill() {
        this.lazyInit();
        // eslint-disable-next-line curly
        while (this.fetch(1000) === 1000);
    }
}
