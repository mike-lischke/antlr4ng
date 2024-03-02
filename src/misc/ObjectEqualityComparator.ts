/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { IComparable } from "../utils/helpers.js";
import { EqualityComparator } from "./EqualityComparator.js";

/**
 * This default implementation of {@link EqualityComparator} uses object equality
 * for comparisons by calling {@link Object.hashCode} and {@link Object.equals}.
 */
export class ObjectEqualityComparator implements EqualityComparator<IComparable> {
    public static readonly instance: ObjectEqualityComparator = new ObjectEqualityComparator();

    public hashCode(obj: IComparable): number {
        if (obj == null) {
            return 0;
        }

        return obj.hashCode();
    }

    public equals(a: IComparable, b: IComparable): boolean {
        if (a == null) {
            return b == null;
        }

        return a.equals(b);
    }

}
