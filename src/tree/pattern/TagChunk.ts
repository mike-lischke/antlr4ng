/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Chunk } from "./Chunk.js";

/**
 * Represents a placeholder tag in a tree pattern. A tag can have any of the
 * following forms.
 *
 * <ul>
 * <li>{@code expr}: An unlabeled placeholder for a parser rule {@code expr}.</li>
 * <li>{@code ID}: An unlabeled placeholder for a token of type {@code ID}.</li>
 * <li>{@code e:expr}: A labeled placeholder for a parser rule {@code expr}.</li>
 * <li>{@code id:ID}: A labeled placeholder for a token of type {@code ID}.</li>
 * </ul>
 *
 * This class does not perform any validation on the tag or label names aside
 * from ensuring that the tag is a non-null, non-empty string.
 */
export class TagChunk extends Chunk {
    public readonly tag: string;

    public readonly label: string | null;

    /**
     * Construct a new instance of {@link TagChunk} using the specified tag and
     * no label.
     *
     * @param tag The tag, which should be the name of a parser rule or token
     * type.
     *
     * @throws IllegalArgumentException if {@code tag} is {@code null} or
     * empty.
     */
    public constructor(tag: string | null);
    /**
     * Construct a new instance of {@link TagChunk} using the specified label
     * and tag.
     *
     * @param label The label for the tag. If this is {@code null}, the
     * {@link TagChunk} represents an unlabeled tag.
     * @param tag The tag, which should be the name of a parser rule or token
     * type.
     *
     * @throws IllegalArgumentException if {@code tag} is {@code null} or
     * empty.
     */
    public constructor(label: string | null, tag: string);
    public constructor(...args: unknown[]) {
        let label: string | null;
        let tag: string;

        if (args.length === 1) {
            label = null;
            tag = args[0] as string;
        } else {
            label = args[0] as string | null;
            tag = args[1] as string;
        }

        super();
        if (!tag) {
            throw new Error("tag cannot be null or empty");
        }

        this.label = label;
        this.tag = tag;
    }

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * This method returns a text representation of the tag chunk. Labeled tags
     * are returned in the form {@code label:tag}, and unlabeled tags are
     * returned as just the tag name.
     */
    public override toString(): string {
        if (this.label !== null) {
            return this.label + ":" + this.tag;
        }

        return this.tag;
    }
}
