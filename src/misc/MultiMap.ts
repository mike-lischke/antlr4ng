/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class MultiMap<K extends string, V> extends Map<K, V[]> {
    public map(key: K, value: V): void {
        let elementsForKey = this.get(key);
        if (!elementsForKey) {
            elementsForKey = new Array<V>();
            this.set(key, elementsForKey);
        }

        elementsForKey.push(value);
    }

    public getPairs(): Array<[K, V]> {
        const pairs = new Array<[K, V]>();
        for (const key of this.keys()) {
            const keys = this.get(key) ?? [];
            for (const value of keys) {
                pairs.push([key, value]);
            }
        }

        return pairs;
    }
}
