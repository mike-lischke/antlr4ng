/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { standardHashCodeFunction, standardEqualsFunction, arrayToString, IComparable } from "../utils/helpers.js";

export type HashFunction = (a: string | IComparable) => number;
export type EqualsFunction = (a: IComparable | null, b: unknown) => boolean;

export class HashSet<T extends IComparable> {

    /**
     * Threshold for using hashing amd searching the bucket instead of a linear search.
     * Set to 0 to disable linear search and always use the hash function.
     */
    public static LINEAR_SEARCH_THRESHOLD = 5;

    private _values: T[] = [];
    private data: Record<string, number[]> = {};
    private hashFunction: HashFunction;
    private equalsFunction: EqualsFunction;

    public constructor(hashFunction?: HashFunction, equalsFunction?: EqualsFunction) {
        this.hashFunction = hashFunction ?? standardHashCodeFunction;
        this.equalsFunction = equalsFunction ?? standardEqualsFunction;
    }

    public add(value: T): T {
        if (this._values.length && this._values.length < HashSet.LINEAR_SEARCH_THRESHOLD) {
            const existing = this._values.find((v) => this.equalsFunction(v, value));
            if (existing !== undefined) {
                return existing;
            }
        }

        const key = this.hashFunction(value);
        const entries = this.data[key];

        if (entries && this._values.length >= HashSet.LINEAR_SEARCH_THRESHOLD) {
            const existingIndex = entries.find((entryIndex) => this.equalsFunction(value, this._values[entryIndex]));
            if (existingIndex !== undefined) {
                return this._values[existingIndex];
            }

            const index = this._values.push(value) - 1;
            entries.push(index);
            return value;
        }

        const index = this._values.push(value) - 1;
        this.data[key] = [index];
        this._values.push(value);
        return value;
    }

    public has(value: T): boolean {
        return this.get(value) != null;
    }

    public get(value: T): T | null {
        if (!this._values.length) {
            return null;
        }

        if (this._values.length < HashSet.LINEAR_SEARCH_THRESHOLD) {
            return this._values.find((v) => this.equalsFunction(v, value)) ?? null;
        }

        const key = this.hashFunction(value);
        const entries = this.data[key];
        if (entries) {
            const index = entries.find((entryIndex) => this.equalsFunction(value, this._values[entryIndex]));
            if (index !== undefined) {
                return this._values[index];
            }
        }
        return null;
    }

    public values(): T[] {
        return this._values;
    }

    public toString(): string {
        return arrayToString(this._values);
    }

    public get length(): number {
        return this._values.length;
    }
}
