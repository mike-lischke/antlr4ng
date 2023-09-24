/* eslint-disable jsdoc/no-undefined-types */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CommonToken } from './CommonToken.js';
import { TokenFactory } from './TokenFactory.js';

/**
 * This default implementation of {@link TokenFactory} creates
 * {@link CommonToken} objects.
 */
export class CommonTokenFactory extends TokenFactory {
    copyText: any;
    constructor(copyText: any) {
        super();
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
        this.copyText = copyText === undefined ? false : copyText;
    }

    create(source: any, type: any, text: any, channel: any, start: any, stop: any, line: any, column: any) {
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

    createThin(type: any, text: any) {
        // @ts-expect-error TS(2554): Expected 5 arguments, but got 2.
        const t = new CommonToken(null, type);
        t.text = text;
        return t;
    }
}

/**
 * The default {@link CommonTokenFactory} instance.
 *
 * <p>
 * This token factory does not explicitly copy token text when constructing
 * tokens.</p>
 */
// @ts-expect-error TS(2339): Property 'DEFAULT' does not exist on type 'typeof ... Remove this comment to see the full error message
CommonTokenFactory.DEFAULT = new CommonTokenFactory();
