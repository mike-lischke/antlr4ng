/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { standardHashCodeFunction, standardEqualsFunction, arrayToString, IComparable } from "../utils/helpers.js";

export interface HashFunction<T extends IComparable = IComparable> {
    (a: T): number;
}

export interface EqualsFunction<T extends IComparable = IComparable> {
    (a: T | null, b: T | null): boolean;
}

export class HashSet<T extends IComparable> {
    #size = 0;
    #data: Record<string, T[]>;

    private hashFunction: HashFunction;
    private equalsFunction: EqualsFunction;

    public constructor(hashFunction?: HashFunction<T> | null, equalsFunction?: EqualsFunction<T> | null) {
        this.#data = {};
        this.#size = 0;
        this.hashFunction = hashFunction ?? standardHashCodeFunction;
        this.equalsFunction = equalsFunction ?? standardEqualsFunction;
    }

    public add(value: T): T {
        const key = this.hashFunction(value);
        const entries = this.#data[key];
        if (entries) {
            const entry = entries.find((entry) => this.equalsFunction(value, entry));
            if (entry) {
                return entry;
            }
            entries.push(value);
        } else {
            this.#data[key] = [value];
        }
        this.#size++;
        return value;
    }

    public has(value: T): boolean {
        return this.get(value) !== null;
    }

    public get(value: T): T | null {
        return this.#data[this.hashFunction(value)]?.find((entry) => this.equalsFunction(value, entry)) ?? null;
    }

    public values(): T[] {
        // Reduce is faster then flatMap (https://measurethat.net/Benchmarks/Show/29489)
        return Object.values(this.#data).reduce((accumulator, entries) => {
            accumulator.push(...entries);
            return accumulator;
        }, []);
    }

    public toString(): string {
        return arrayToString(this.values());
    }

    public get length(): number {
        return this.#size;
    }
}
