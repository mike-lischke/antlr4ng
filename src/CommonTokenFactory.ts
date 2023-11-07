/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream } from "./CharStream.js";
import { CommonToken } from "./CommonToken.js";
import { TokenFactory } from "./TokenFactory.js";
import { TokenSource } from "./TokenSource.js";

/**
 * This default implementation of {@link TokenFactory} creates
 * {@link CommonToken} objects.
 */
export class CommonTokenFactory implements TokenFactory<CommonToken> {
    /**
     * The default {@link CommonTokenFactory} instance.
     *
     * <p>
     * This token factory does not explicitly copy token text when constructing
     * tokens.</p>
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly DEFAULT = new CommonTokenFactory();

    /**
     * Indicates whether {@link CommonToken#setText} should be called after
     * constructing tokens to explicitly set the text. This is useful for cases
     * where the input stream might not be able to provide arbitrary substrings
     * of text from the input after the lexer creates a token (e.g. the
     * implementation of {@link CharStream#getText} in
     * {@link UnbufferedCharStream} throws an
     * {@link UnsupportedOperationException}). Explicitly setting the token text
     * allows {@link Token#getText} to be called at any time regardless of the
     * input stream implementation.
     *
     * <p>
     * The default value is {@code false} to avoid the performance and memory
     * overhead of copying text for every token unless explicitly requested.</p>
     */
    protected readonly copyText: boolean = false;

    public constructor(copyText?: boolean) {
        /**
         * Indicates whether {@link CommonToken//setText} should be called after
         * constructing tokens to explicitly set the text. This is useful for cases
         * where the input stream might not be able to provide arbitrary substrings
         * of text from the input after the lexer creates a token (e.g. the
         * implementation of {@link CharStream//getText} in
         * {@link UnbufferedCharStream} throws an
         * {@link UnsupportedOperationException}). Explicitly setting the token text
         * allows {@link Token//getText} to be called at any time regardless of the
         * input stream implementation.
         *
         * <p>
         * The default value is {@code false} to avoid the performance and memory
         * overhead of copying text for every token unless explicitly requested.</p>
         */
        this.copyText = copyText ?? false;
    }

    public create(source: [TokenSource | null, CharStream | null], type: number, text: string | null, channel: number,
        start: number, stop: number, line: number, column: number): CommonToken {
        const t = new CommonToken(source, type, channel, start, stop);
        t.line = line;
        t.column = column;
        if (text !== null) {
            t.text = text;
        } else if (this.copyText && source[1] !== null) {
            t.text = source[1].getText(start, stop);
        }

        return t;
    }
}
