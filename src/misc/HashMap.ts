/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { type EqualityComparator } from "./EqualityComparator.js";
import { HashSet } from "./HashSet.js";
import { MapKeyEqualityComparator, type Bucket } from "./MapKeyEqualityOperator.js";

export class HashMap<K, V> {
    private backingStore: HashSet<Bucket<K, V>>;

    public constructor(keyComparer: EqualityComparator<K>);
    public constructor(map: HashMap<K, V>);
    public constructor(keyComparer: EqualityComparator<K> | HashMap<K, V>) {
        if (keyComparer instanceof HashMap) {
            this.backingStore = new HashSet<Bucket<K, V>>(keyComparer.backingStore);
        } else {
            this.backingStore = new HashSet<Bucket<K, V>>(new MapKeyEqualityComparator<K, V>(keyComparer));
        }
    }

    public clear(): void {
        this.backingStore.clear();
    }

    public containsKey(key: K): boolean {
        return this.backingStore.contains({ key });
    }

    public get(key: K): V | undefined {
        const bucket = this.backingStore.get({ key });
        if (!bucket) {
            return undefined;
        }

        return bucket.value;
    }

    public get isEmpty(): boolean {
        return this.backingStore.isEmpty;
    }

    /**
     * Sets the value for a key in the map. If the key is not present in the map, it is added.
     * If the key is present, the value is updated and the old value is returned.
     *
     * @param key The key to set.
     * @param value The value to set.
     *
     * @returns The old value for the key, if present.
     */
    public set(key: K, value: V): V | undefined {
        const element = this.backingStore.get({ key, value });
        let result: V | undefined;
        if (!element) {
            this.backingStore.add({ key, value });
        } else {
            result = element.value;
            element.value = value;
        }

        return result;
    }

    /**
     * Sets the value for a key in the map if the key is not already present. Otherwise the value is not changed and
     * the old value is returned.
     *
     * @param key The key to set.
     * @param value The value to set.
     *
     * @returns The current value for the key, if present.
     */
    public setIfAbsent(key: K, value: V): V | undefined {
        const element = this.backingStore.get({ key, value });
        let result: V | undefined;
        if (!element) {
            this.backingStore.add({ key, value });
        } else {
            result = element.value;
        }

        return result;
    }

    public values(): Iterable<V> {
        return this.backingStore.toArray().map((bucket) => { return bucket.value!; });
    }

    public get size(): number {
        return this.backingStore.size;
    }

    public hashCode(): number {
        return this.backingStore.hashCode();
    }

    public equals(o: HashMap<K, V>): boolean {
        return this.backingStore.equals(o.backingStore);
    }
}
