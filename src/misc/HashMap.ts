/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IComparable, standardEqualsFunction, standardHashCodeFunction } from "../utils/helpers.js";
import { EqualsFunction, HashFunction } from "./HashSet.js";

interface Entry<Key extends IComparable, Value> { key: Key, value: Value; }

export class HashMap<TKey extends IComparable, TValue> {
    private data: Record<string, Entry<TKey, TValue>[]>;
    private hashFunction: HashFunction<TKey>;
    private equalsFunction: EqualsFunction<TKey>;

    public constructor(hashFunction?: HashFunction<TKey>, equalsFunction?: EqualsFunction<TKey>) {
        this.data = {};
        this.hashFunction = hashFunction ?? standardHashCodeFunction;
        this.equalsFunction = equalsFunction ?? standardEqualsFunction;
    }

    public set(key: TKey, value: TValue): TValue {
        const hashKey = this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            for (const entry of entries) {
                if (this.equalsFunction(key, entry.key)) {
                    const oldValue = entry.value;
                    entry.value = value;

                    return oldValue;
                }
            }
            entries.push({ key, value });

            return value;
        } else {
            this.data[hashKey] = [{ key, value }];

            return value;
        }
    }

    public containsKey(key: TKey): boolean {
        const hashKey = this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            for (const entry of entries) {
                if (this.equalsFunction(key, entry.key)) {
                    return true;
                }
            }
        }

        return false;
    }

    public get(key: TKey): TValue | null {
        const hashKey = this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            for (const entry of entries) {
                if (this.equalsFunction(key, entry.key)) {
                    return entry.value;
                }
            }
        }

        return null;
    }

    public entries(): Array<Entry<TKey, TValue>> {
        return Object.keys(this.data).flatMap((key) => {
            return this.data[key];
        }, this);
    }

    public getKeys(): TKey[] {
        return this.entries().map((e) => { return e.key; });
    }

    public getValues(): TValue[] {
        return this.entries().map((e) => { return e.value; });
    }

    public toString(): string {
        const ss = this.entries().map((e) => { return "{" + e.key + ":" + e.value + "}"; });

        return "[" + ss.join(", ") + "]";
    }

    public get length(): number {
        return Object.keys(this.data).map((key) => {
            return this.data[key].length;
        }, this).reduce((accumulator, item) => {
            return accumulator + item;
        }, 0);
    }
}
