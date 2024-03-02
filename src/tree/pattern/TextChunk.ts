/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Chunk } from "./Chunk.js";

/**
 * Represents a span of raw text (concrete syntax) between tags in a tree
 * pattern string.
 */
export class TextChunk extends Chunk {
    public readonly text: string;

    /**
     * Constructs a new instance of {@link TextChunk} with the specified text.
     *
     * @param text The text of this chunk.
     */
    public constructor(text: string) {
        super();

        this.text = text;
    }

    /**
     * @returns the result of {@link #getText()} in single quotes.
     */
    public override toString(): string {
        return "'" + this.text + "'";
    }
}
