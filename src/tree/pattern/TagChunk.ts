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
 * - `expr`: An unlabeled placeholder for a parser rule `expr`.
 * - `ID`: An unlabeled placeholder for a token of type `ID`.
 * - `e:expr`: A labeled placeholder for a parser rule `expr`.
 * - `id:ID`: A labeled placeholder for a token of type `ID`.
 *
 * This class does not perform any validation on the tag or label names aside
 * from ensuring that the tag is a non-null, non-empty string.
 */
export class TagChunk extends Chunk {
    public readonly tag: string;

    public readonly label?: string;

    /**
     * Construct a new instance of {@link TagChunk} using the specified tag and
     * no label.
     *
     * @param tag The tag, which should be the name of a parser rule or token
     * type.
     *
     * @throws IllegalArgumentException if `tag` is `null` or
     * empty.
     */
    public constructor(tag?: string);
    /**
     * Construct a new instance of {@link TagChunk} using the specified label
     * and tag.
     *
     * @param label The label for the tag. If this is `null`, the
     * {@link TagChunk} represents an unlabeled tag.
     * @param tag The tag, which should be the name of a parser rule or token
     * type.
     *
     * @throws IllegalArgumentException if `tag` is `null` or
     * empty.
     */
    public constructor(label: string | undefined, tag: string);
    public constructor(...args: unknown[]) {
        let label: string | undefined;
        let tag: string;

        if (args.length === 1) {
            tag = args[0] as string;
        } else {
            label = args[0] as string | undefined;
            tag = args[1] as string;
        }

        super();
        if (!tag) {
            throw new Error("tag cannot be null or empty");
        }

        this.label = label;
        this.tag = tag;
    }

    /**
     * @returns a text representation of the tag chunk. Labeled tags
     * are returned in the form `label:tag`, and unlabeled tags are
     * returned as just the tag name.
     */
    public override toString(): string {
        if (this.label !== undefined) {
            return this.label + ":" + this.tag;
        }

        return this.tag;
    }
}
