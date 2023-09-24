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
export const CharStreams = {
    // Creates an InputStream from a string.
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
    fromBlob: function (blob: any, encoding: any, onLoad: any, onError: any) {
        const reader = new window.FileReader();
        reader.onload = function (e) {
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            const is = new CharStream(e.target.result, true);
            onLoad(is);
        };
        reader.onerror = onError;
        reader.readAsText(blob, encoding);
    },

    /**
     * Creates an InputStream from a Buffer given the
     * encoding of the bytes in that buffer (defaults to 'utf8' if
     * encoding is null).
     */
    fromBuffer: function (buffer: any, encoding: any) {
        return new CharStream(buffer.toString(encoding), true);
    },
};
