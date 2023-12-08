/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import { CharStream } from "./CharStream.js";

/**
 * Utility functions to create Character streams from various sources.
 *
 * All returned InputStreams support the full range of Unicode
 * up to U+10FFFF (the default behavior of InputStream only supports
 * code points up to U+FFFF).
 */
// TODO: remove this class, as it does not provide any value compared to CharStream.
// Java CharStreams class is a factory for CharStream instances from various sources (files, channels and whatnot).
// In TypeScript we always work with strings as input and let the application take care to load them.
export class CharStreams {
    // Creates an CharStream from a string.
    public static fromString(str: string): CharStream {
        return new CharStream(str);
    }
}
