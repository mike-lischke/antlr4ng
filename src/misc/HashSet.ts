/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { standardHashCodeFunction, standardEqualsFunction, arrayToString, IComparable } from "../utils/helpers.js";

export type HashFunction = (a: string | IComparable) => number;
export type EqualsFunction = (a: IComparable | null, b: unknown) => boolean;

export class HashSet<T extends IComparable> {
    private data: { [key: string]: T[]; };
    private hashFunction: HashFunction;
    private equalsFunction: EqualsFunction;

    public constructor(hashFunction?: HashFunction, equalsFunction?: EqualsFunction) {
        this.data = {};
        this.hashFunction = hashFunction ?? standardHashCodeFunction;
        this.equalsFunction = equalsFunction ?? standardEqualsFunction;
    }

    public add(value: T): T {
        const key = this.hashFunction(value);
        if (key in this.data) {
            const entries = this.data[key];
            for (const entry of entries) {
                if (this.equalsFunction(value, entry)) {
                    return entry;
                }
            }

            entries.push(value);

            return value;
        } else {
            this.data[key] = [value];

            return value;
        }
    }

    public has(value: T): boolean {
        return this.get(value) != null;
    }

    public get(value: T): T | null {
        const key = this.hashFunction(value);
        if (key in this.data) {
            const entries = this.data[key];

            for (const entry of entries) {
                if (this.equalsFunction(value, entry)) {
                    return entry;
                }
            }
        }

        return null;
    }

    public values(): T[] {
        return Object.keys(this.data).flatMap((key) => {
            return this.data[key];
        }, this);
    }

    public toString(): string {
        return arrayToString(this.values());
    }

    public get length(): number {
        return Object.keys(this.data).map((key) => {
            return this.data[key].length;
        }, this).reduce((accumulator, item) => {
            return accumulator + item;
        }, 0);
    }
}
