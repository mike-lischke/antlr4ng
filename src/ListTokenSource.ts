/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { CharStream } from "./CharStream.js";
import { CommonTokenFactory } from "./CommonTokenFactory.js";
import { Token } from "./Token.js";
import type { TokenFactory } from "./TokenFactory.js";
import type { TokenSource } from "./TokenSource.js";

/**
 * Provides an implementation of {@link TokenSource} as a wrapper around a list
 * of {@link Token} objects.
 *
 * <p>If the final token in the list is an {@link Token#EOF} token, it will be used
 * as the EOF token for every call to {@link #nextToken} after the end of the
 * list is reached. Otherwise, an EOF token will be created.</p>
 */
export class ListTokenSource implements TokenSource {
    /**
     * The name of the input source. If this value is {@code null}, a call to
     * {@link #getSourceName} should return the source name used to create the
     * the next token in {@link #tokens} (or the previous token if the end of
     * the input has been reached).
     */
    public readonly sourceName: string;

    /**
     * The wrapped collection of {@link Token} objects to return.
     */
    protected readonly tokens: Token[];

    /**
     * The index into {@link #tokens} of token to return by the next call to
     * {@link #nextToken}. The end of the input is indicated by this value
     * being greater than or equal to the number of items in {@link #tokens}.
     */
    protected i: number;

    /**
     * This field caches the EOF token for the token source.
     */
    protected eofToken: Token | null;

    /**
     * This is the backing field for {@link #getTokenFactory} and
     * {@link tokenFactory}.
     */
    #factory: TokenFactory<Token> = CommonTokenFactory.DEFAULT;

    /**
     * Constructs a new {@link ListTokenSource} instance from the specified
     * collection of {@link Token} objects.
     *
     * @param tokens The collection of {@link Token} objects to provide as a
     * {@link TokenSource}.
     * @throws NullPointerException if {@code tokens} is {@code null}
     */
    public constructor(tokens: Token[]);
    /**
     * Constructs a new {@link ListTokenSource} instance from the specified
     * collection of {@link Token} objects and source name.
     *
     * @param tokens The collection of {@link Token} objects to provide as a
     * {@link TokenSource}.
     * @param sourceName The name of the {@link TokenSource}. If this value is
     * {@code null}, {@link #getSourceName} will attempt to infer the name from
     * the next {@link Token} (or the previous token if the end of the input has
     * been reached).
     *
     * @throws NullPointerException if {@code tokens} is {@code null}
     */
    public constructor(tokens: Token[], sourceName: string);
    public constructor(tokens: Token[], sourceName?: string) {
        this.tokens = tokens;
        this.sourceName = sourceName ?? "";
    }

    public get column(): number {
        if (this.i < this.tokens.length) {
            return this.tokens[this.i].column;
        } else {
            if (this.eofToken !== null) {
                return this.eofToken.column;
            } else {
                if (this.tokens.length > 0) {
                    // have to calculate the result from the line/column of the previous
                    // token, along with the text of the token.
                    const lastToken = this.tokens[this.tokens.length - 1];
                    const tokenText = lastToken.text;
                    if (tokenText !== null) {
                        const lastNewLine = tokenText.lastIndexOf("\n");
                        if (lastNewLine >= 0) {
                            return tokenText.length - lastNewLine - 1;
                        }
                    }

                    return lastToken.column + lastToken.stop - lastToken.start + 1;
                }
            }

        }

        // only reach this if tokens is empty, meaning EOF occurs at the first
        // position in the input
        return 0;
    }

    public nextToken(): Token {
        if (this.i >= this.tokens.length) {
            if (this.eofToken === null) {
                let start = -1;
                if (this.tokens.length > 0) {
                    const previousStop = this.tokens[this.tokens.length - 1].stop;
                    if (previousStop !== -1) {
                        start = previousStop + 1;
                    }
                }

                const stop = Math.max(-1, start - 1);
                this.eofToken = this.#factory.create([this, this.inputStream], Token.EOF, "EOF",
                    Token.DEFAULT_CHANNEL, start, stop, this.line, this.column);
            }

            return this.eofToken;
        }

        const t = this.tokens[this.i];
        if (this.i === this.tokens.length - 1 && t.type === Token.EOF) {
            this.eofToken = t;
        }

        this.i++;

        return t;
    }

    public get line(): number {
        if (this.i < this.tokens.length) {
            return this.tokens[this.i].line;
        } else {
            if (this.eofToken !== null) {
                return this.eofToken.line;
            } else {
                if (this.tokens.length > 0) {
                    // have to calculate the result from the line/column of the previous
                    // token, along with the text of the token.
                    const lastToken = this.tokens[this.tokens.length - 1];
                    let line = lastToken.line;

                    const tokenText = lastToken.text;
                    if (tokenText !== null) {
                        for (const char of tokenText) {
                            if (char === "\n") {
                                line++;
                            }
                        }
                    }

                    // if no text is available, assume the token did not contain any newline characters.
                    return line;
                }
            }

        }

        // only reach this if tokens is empty, meaning EOF occurs at the first
        // position in the input
        return 1;
    }

    public get inputStream(): CharStream | null {
        if (this.i < this.tokens.length) {
            return this.tokens[this.i].inputStream;
        } else {
            if (this.eofToken !== null) {
                return this.eofToken.inputStream;
            } else {
                if (this.tokens.length > 0) {
                    return this.tokens[this.tokens.length - 1].inputStream;
                }
            }

        }

        // no input stream information is available
        return null;
    }

    public getSourceName(): string {
        if (this.sourceName !== null) {
            return this.sourceName;
        }

        const inputStream = this.inputStream;
        if (inputStream !== null) {
            return inputStream.getSourceName();
        }

        return "List";
    }

    public set tokenFactory(factory: TokenFactory<Token>) {
        this.#factory = factory;
    }

    public get tokenFactory(): TokenFactory<Token> {
        return this.#factory;
    }
}
