/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { IComparable } from "../utils/helpers.js";
import type { EqualityComparator } from "./EqualityComparator.js";

/**
 * Since `HashMap` is implemented on top of `HashSet`, we defined a bucket type which can store a
 * key-value pair. The value is optional since looking up values in the map by a key only needs to include the key.
 */
export interface Bucket<K extends IComparable, V> { key: K; value?: V; }

export class MapKeyEqualityComparator<K extends IComparable, V> implements EqualityComparator<Bucket<K, V>> {
    private readonly keyComparator: EqualityComparator<K>;

    public constructor(keyComparator: EqualityComparator<K>) {
        this.keyComparator = keyComparator;
    }

    public hashCode(obj: Bucket<K, V>): number {
        return this.keyComparator.hashCode(obj.key);
    }

    public equals(a: Bucket<K, V>, b: Bucket<K, V>): boolean {
        return this.keyComparator.equals(a.key, b.key);
    }
}
