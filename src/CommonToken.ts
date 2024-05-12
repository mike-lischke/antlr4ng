/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, no-underscore-dangle */

import { CharStream } from "./CharStream.js";
import { Recognizer } from "./Recognizer.js";
import { Token } from "./Token.js";
import { TokenSource } from "./TokenSource.js";
import { WritableToken } from "./WritableToken.js";
import { ATNSimulator } from "./atn/ATNSimulator.js";

export class CommonToken implements WritableToken {
    /**
     * An empty tuple which is used as the default value of
     * {@link source} for tokens that do not have a source.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EMPTY_SOURCE: [TokenSource | null, CharStream | null] = [null, null];

    /**
     * These properties share a field to reduce the memory footprint of
     * {@link CommonToken}. Tokens created by a {@link CommonTokenFactory} from
     * the same source and input stream share a reference to the same
     * {@link Pair} containing these values.
     */
    public source: [TokenSource | null, CharStream | null];

    public tokenIndex: number;
    public start: number;
    public stop: number;

    /**
     * This is the backing field for {@link #getType} and {@link #setType}.
     */
    public type: number;

    /**
     * The (one-based) line number on which the 1st character of this token was.
     */
    public line: number;

    /**
     * The zero-based index of the first character position in its line.
     */
    public column: number;

    /**
     * The token's channel.
     */
    public channel: number;

    /**
     * This is the backing field for {@link getText} when the token text is
     * explicitly set in the constructor or via {@link setText}.
     */
    #text?: string;

    protected constructor(details: {
        source: [TokenSource | null, CharStream | null],
        type: number,
        channel?: number,
        start?: number,
        stop?: number;
        text?: string,
        line?: number,
        tokenIndex?: number,
        column?: number;
    }) {
        this.type = details.type;
        this.source = details.source;
        this.tokenIndex = details.tokenIndex ?? -1;
        this.line = details.line ?? 0;
        this.column = details.column ?? -1;
        this.channel = details.channel ?? Token.DEFAULT_CHANNEL;
        this.start = details.start ?? 0;
        this.stop = details.stop ?? 0;
        this.#text = details.text;

        if (details.source[0] !== null) {
            this.line = details.source[0].line;
            this.column = details.source[0].column;
        }
    }

    /**
     * Constructs a new {@link CommonToken} as a copy of another {@link Token}.
     *
     * If `token` is also a {@link CommonToken} instance, the newly
     * constructed token will share a reference to the {@link #text} field and
     * the {@link Pair} stored in {@link source}. Otherwise, {@link text} will
     * be assigned the result of calling {@link getText}, and {@link source}
     * will be constructed from the result of {@link Token.getTokenSource} and
     * {@link Token#getInputStream}.
     *
     * @param token The token to copy.
     */
    public static fromToken(token: Token): CommonToken {
        const source: [TokenSource | null, CharStream | null] = [token.tokenSource, token.inputStream];

        return new CommonToken({
            type: token.type,
            line: token.line,
            tokenIndex: token.tokenIndex,
            column: token.column,
            channel: token.channel,
            start: token.start,
            stop: token.stop,
            text: token.text,
            source,
        });
    }

    /**
     * Constructs a new {@link CommonToken} with the specified token type and text.
     *
     * @param type The token type.
     * @param text The text of the token.
     */
    public static fromType(type: number, text?: string): CommonToken {
        return new CommonToken({ type, text, source: CommonToken.EMPTY_SOURCE });
    }

    public static fromSource(source: [TokenSource | null, CharStream | null], type: number, channel: number,
        start: number, stop: number): CommonToken {
        return new CommonToken({ type, channel, start, stop, source });
    }

    public get tokenSource(): TokenSource | null {
        return this.source[0];
    }

    public get inputStream(): CharStream | null {
        return this.source[1];
    }

    public set inputStream(input: CharStream | null) {
        this.source[1] = input;
    }

    /**
     * Constructs a new {@link CommonToken} as a copy of another {@link Token}.
     *
     * If `oldToken` is also a {@link CommonToken} instance, the newly
     * constructed token will share a reference to the {@link text} field and
     * the {@link Pair} stored in {@link source}. Otherwise, {@link text} will
     * be assigned the result of calling {@link getText}, and {@link source}
     * will be constructed from the result of {@link Token.getTokenSource} and
     * {@link Token.getInputStream}.
     */
    public clone(): CommonToken {
        const t = new CommonToken({
            source: this.source,
            type: this.type,
            channel: this.channel,
            start: this.start,
            stop: this.stop,
            tokenIndex: this.tokenIndex,
            line: this.line,
            column: this.column,
            text: this.#text,
        });

        return t;
    }

    public toString(recognizer?: Recognizer<ATNSimulator>): string {
        let channelStr = "";
        if (this.channel > 0) {
            channelStr = ",channel=" + this.channel;
        }

        let text = this.text;
        if (text) {
            text = text.replace(/\n/g, "\\n");
            text = text.replace(/\r/g, "\\r");
            text = text.replace(/\t/g, "\\t");
        } else {
            text = "<no text>";
        }

        let typeString = String(this.type);
        if (recognizer) {
            typeString = recognizer.vocabulary.getDisplayName(this.type) ?? "<unknown>";
        }

        return "[@" + this.tokenIndex + "," + this.start + ":" + this.stop + "='" + text + "',<" + typeString + ">" +
            channelStr + "," + this.line + ":" + this.column + "]";
    }

    public get text(): string | undefined {
        if (this.#text) {
            return this.#text;
        }

        const input = this.inputStream;
        if (!input) {
            return undefined;
        }

        const n = input.size;
        if (this.start < n && this.stop < n) {
            return input.getTextFromRange(this.start, this.stop);
        }

        return "<EOF>";
    }

    public set text(text: string) {
        this.#text = text;
    }

    // WritableToken implementation

    public setText(text: string): void {
        this.#text = text;
    }

    public setType(ttype: number): void {
        this.type = ttype;
    }

    public setLine(line: number): void {
        this.line = line;
    }

    public setCharPositionInLine(pos: number): void {
        this.column = pos;
    }

    public setChannel(channel: number): void {
        this.channel = channel;
    }

    public setTokenIndex(index: number): void {
        this.tokenIndex = index;
    }

}
