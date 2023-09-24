/* eslint-disable jsdoc/require-param, jsdoc/require-returns, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// TS thinks this is an unused interface import, but instead we are importing the same named class here.
import { CharStream } from "./CharStream.js";

/**
 * Utility functions to create InputStreams from various sources.
 *
 * All returned InputStreams support the full range of Unicode
 * up to U+10FFFF (the default behavior of InputStream only supports
 * code points up to U+FFFF).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const CharStreams = {
    // Creates an InputStream from a string.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    fromString: function (str: any) {
        return new CharStream(str, true);
    },

    /**
     * Asynchronously creates an InputStream from a blob given the
     * encoding of the bytes in that blob (defaults to 'utf8' if
     * encoding is null).
     *
     * Invokes onLoad(result) on success, onError(error) on
     * failure.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    fromBlob: function (blob: any, encoding: any, onLoad: any, onError: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const reader = new window.FileReader();
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        reader.onload = function (e) {
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            const is = new CharStream(e.target.result, true);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            onLoad(is);
        };
        reader.onerror = onError;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        reader.readAsText(blob, encoding);
    },

    /**
     * Creates an InputStream from a Buffer given the
     * encoding of the bytes in that buffer (defaults to 'utf8' if
     * encoding is null).
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    fromBuffer: function (buffer: any, encoding: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return new CharStream(buffer.toString(encoding), true);
    },
};
