/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IComparable, standardEqualsFunction, standardHashCodeFunction } from "../utils/helpers.js";
import { EqualsFunction, HashFunction } from "./HashSet.js";

interface Entry<Key extends IComparable, Value> { key: Key, value: Value; }

export class HashMap<TKey extends IComparable, TValue> {

    /**
     * Threshold for using hashing amd searching the bucket instead of a linear search.
     * Set to 0 to disable linear search and always use the hash function.
     */
    public static LINEAR_SEARCH_THRESHOLD = 5;

    #values: TValue[] = [];
    #keys: TKey[] = [];
    #data: Record<string, number[]> = {};

    private hashFunction: HashFunction;
    private equalsFunction: EqualsFunction;

    public constructor(hashFunction?: HashFunction, equalsFunction?: EqualsFunction) {
        this.hashFunction = hashFunction ?? standardHashCodeFunction;
        this.equalsFunction = equalsFunction ?? standardEqualsFunction;
    }

    public set(key: TKey, value: TValue): TValue {
        if (this.#values.length < HashMap.LINEAR_SEARCH_THRESHOLD) {
            const existingIndex = this.#values.findIndex((_, index) => this.equalsFunction(key, this.#keys[index]));
            if (existingIndex >= 0) {
                return this.replaceEntry(existingIndex, value);
            }
        }

        const hashKey = this.hashFunction(key);
        const entries = this.#data[hashKey];

        if (entries && this.#values.length >= HashMap.LINEAR_SEARCH_THRESHOLD) {
            const existingIndex = entries.find((entryIndex) => this.equalsFunction(key, this.#keys[entryIndex]));
            if (existingIndex !== undefined) {
                return this.replaceEntry(existingIndex, value);
            }
            entries.push(this.addEntry(key, value));
            return value;
        }

        this.#data[hashKey] = [ this.addEntry(key, value) ];
        return value;
    }

    private addEntry(key: TKey, value: TValue): number {
        const index = this.#keys.push(key);
        this.#values.push(value);
        return index - 1;
    }

    private replaceEntry(index: number, value: TValue): TValue {
        const oldValue = this.#values[index];
        this.#values[index] = value;
        return oldValue;
    }

    public containsKey(key: TKey): boolean {
        if (this.#keys.length) {
            if (this.#keys.length < HashMap.LINEAR_SEARCH_THRESHOLD) { 
                return this.#keys.some((k) => this.equalsFunction(key, k));
            }

            const hashKey = this.hashFunction(key);
            const entries = this.#data[hashKey];
            if (entries) {
                return entries.some((entryIndex) => this.equalsFunction(key, this.#keys[entryIndex]));
            }
        }

        return false;
    }

    public get(key: TKey): TValue | null {
        if (!this.#keys.length) {
            return null;
        }

        if (this.#values.length < HashMap.LINEAR_SEARCH_THRESHOLD) {
            return this.#values.find((_, index) => this.equalsFunction(key, this.#keys[index])) ?? null;
        }

        const hashKey = this.hashFunction(key);
        const entries = this.#data[hashKey];
        if (entries) {
            const index = entries.find((entryIndex) => this.equalsFunction(key, this.#keys[entryIndex]));
            if (index !== undefined) {
                return this.#values[index];
            }
        }
        return null;
    }

    public entries(): Array<Entry<TKey, TValue>> {
        return this.#values.map((value, index) => ({ key: this.#keys[index], value }));
    }

    public getKeys(): TKey[] {
        return this.#keys;
    }

    public getValues(): TValue[] {
        return this.#values;
    }

    public toString(): string {
        return `${this.#values.map((value, index) => `${this.#keys[index]}: ${value}`).join(", ")}`;
    }

    public get length(): number {
        return this.#values.length;
    }
}
