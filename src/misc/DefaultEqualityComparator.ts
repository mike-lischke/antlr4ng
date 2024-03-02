/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { IComparable } from "../index.js";
import { EqualityComparator } from "./EqualityComparator.js";
import { ObjectEqualityComparator } from "./ObjectEqualityComparator.js";

/**
 * This default implementation of {@link EqualityComparator} uses object equality
 * for comparisons, but is optimized for null/undefined, string, and number values.
 */
export class DefaultEqualityComparator implements EqualityComparator<unknown> {
    public static readonly instance = new DefaultEqualityComparator();

    public hashCode(obj: unknown): number {
        if (obj == null) {
            return 0;
        }

        return ObjectEqualityComparator.instance.hashCode(obj as IComparable);
    }

    public equals(a: unknown, b: unknown): boolean {
        if (a == null) {
            return b == null;
        }

        if (typeof a === "string" || typeof a === "number") {
            return a === b;
        }

        return ObjectEqualityComparator.instance.equals(a as IComparable, b as IComparable);
    }
}
