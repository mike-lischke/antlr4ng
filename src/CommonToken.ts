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

    public tokenIndex = -1;

    public start = 0;

    public stop = 0;

    /**
     * This is the backing field for {@link #getType} and {@link #setType}.
     */
    public type = 0;

    /**
     * The (one-based) line number on which the 1st character of this token was.
     */
    public line = 0;

    /**
     * The zero-based index of the first character position in its line.
     */
    public column = -1; // set to invalid position

    /**
     * The token's channel.
     */
    public channel = Token.DEFAULT_CHANNEL;

    /**
     * This is the backing field for {@link #getText} when the token text is
     * explicitly set in the constructor or via {@link #setText}.
     *
     * @see #getText()
     */
    #text: string | null = null;

    /**
     * Constructs a new {@link CommonToken} as a copy of another {@link Token}.
     *
     *
     * If `oldToken` is also a {@link CommonToken} instance, the newly
     * constructed token will share a reference to the {@link #text} field and
     * the {@link Pair} stored in {@link #source}. Otherwise, {@link #text} will
     * be assigned the result of calling {@link #getText}, and {@link #source}
     * will be constructed from the result of {@link Token#getTokenSource} and
     * {@link Token#getInputStream}.
     *
     * @param oldToken The token to copy.
     */
    public constructor(oldToken: Token);
    /**
     * Constructs a new {@link CommonToken} with the specified token type and
     * text.
     *
     * @param type The token type.
     * @param text The text of the token.
     */
    public constructor(type: number, text?: string | null);
    public constructor(source: [TokenSource | null, CharStream | null], type: number, channel: number, start: number,
        stop: number);
    public constructor(...args: unknown[]) {
        if (args.length === 1) {
            if (typeof args[0] === "number") {
                this.type = args[0];
                this.source = CommonToken.EMPTY_SOURCE;
            } else {
                const oldToken = args[0] as Token;

                this.type = oldToken.type;
                this.line = oldToken.line;
                this.tokenIndex = oldToken.tokenIndex;
                this.column = oldToken.column;
                this.channel = oldToken.channel;
                this.start = oldToken.start;
                this.stop = oldToken.stop;

                this.#text = oldToken.text;
                if (oldToken instanceof CommonToken) {
                    this.source = oldToken.source;
                } else {
                    this.source = [oldToken.tokenSource, oldToken.inputStream];
                }
            }
        } else if (args.length === 2) {
            this.type = args[0] as number;
            this.#text = args[1] as string | null;
            this.source = CommonToken.EMPTY_SOURCE;
        } else {
            const [source, type, channel, start, stop] =
                args as [[TokenSource | null, CharStream | null], number, number, number, number];
            this.source = source;
            this.type = type;
            this.channel = channel;
            this.start = start;
            this.stop = stop;
            if (this.source[0] !== null) {
                this.line = source[0]!.line;
                this.column = source[0]!.column;
            }
        };
    }

    public get tokenSource(): TokenSource | null {
        return this.source[0] ?? null;
    }

    public get inputStream(): CharStream | null {
        return this.source[1] ?? null;
    }

    /**
     * Constructs a new {@link CommonToken} as a copy of another {@link Token}.
     *
     *
     * If `oldToken` is also a {@link CommonToken} instance, the newly
     * constructed token will share a reference to the {@link text} field and
     * the {@link Pair} stored in {@link source}. Otherwise, {@link text} will
     * be assigned the result of calling {@link getText}, and {@link source}
     * will be constructed from the result of {@link Token//getTokenSource} and
     * {@link Token//getInputStream}.
     */
    public clone(): CommonToken {
        const t = new CommonToken(this.source, this.type, this.channel, this.start, this.stop);
        t.tokenIndex = this.tokenIndex;
        t.line = this.line;
        t.column = this.column;
        t.#text = this.#text;

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

    public get text(): string | null {
        if (this.#text !== null) {
            return this.#text;
        }

        const input = this.inputStream;
        if (input === null) {
            return null;
        }

        const n = input.size;
        if (this.start < n && this.stop < n) {
            return input.getText(this.start, this.stop);
        } else {
            return "<EOF>";
        }
    }

    public set text(text: string | null) {
        this.#text = text;
    }

    // WritableToken implementation

    public setText(text: string | null): void {
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
