/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IComparable, standardEqualsFunction, standardHashCodeFunction } from "../utils/helpers.js";
import { EqualsFunction, HashFunction } from "./HashSet.js";

interface Entry<Key extends IComparable, Value> { key: Key, value: Value; }

export class HashMap<Key extends IComparable, Value> {
    private data: { [key: string]: Array<Entry<Key, Value>>; };
    private hashFunction: HashFunction;
    private equalsFunction: EqualsFunction;

    public constructor(hashFunction?: HashFunction, equalsFunction?: EqualsFunction) {
        this.data = {};
        this.hashFunction = hashFunction ?? standardHashCodeFunction;
        this.equalsFunction = equalsFunction ?? standardEqualsFunction;
    }

    public set(key: Key, value: Value): Value {
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

    public containsKey(key: Key): boolean {
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

    public get(key: Key): Value | null {
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

    public entries(): Array<Entry<Key, Value>> {
        return Object.keys(this.data).flatMap((key) => {
            return this.data[key];
        }, this);
    }

    public getKeys(): Key[] {
        return this.entries().map((e) => { return e.key; });
    }

    public getValues(): Value[] {
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
