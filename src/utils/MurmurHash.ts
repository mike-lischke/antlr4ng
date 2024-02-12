/*
* Copyright (c) The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/

/*
 * Parts added + modified: copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { isComparable } from "./helpers.js";

/**
 * @author Sam Harwell
 * @author Mike Lischke
 */
export class MurmurHash {

    private static readonly defaultSeed = 701;

    private constructor() { /**/ }

    /**
     * Initialize the hash using the specified {@code seed}.
     *
     * @param seed the seed
     *
     * @returns the intermediate hash value
     */
    public static initialize(seed = MurmurHash.defaultSeed): number {
        return seed;
    }

    /**
     * Update the intermediate hash value for the next input {@code value}.
     *
     * @param hash The intermediate hash value.
     * @param value the value to add to the current hash.
     * @param deep Only used if `value` is an array and indicates that also all entries in the array are used for the
     *             hash (recursively).
     *
     * @returns the updated intermediate hash value
     */
    public static update(hash: number, value: unknown, deep = false): number {
        let actualValue = 0;
        if (typeof value !== "number") {
            if (value != null) {
                if (typeof value === "boolean") {
                    actualValue = value ? 1237 : 4327;
                } else if (typeof value === "string") {
                    actualValue = this.hashString(hash, value);
                } else if (isComparable(value)) {
                    actualValue = value.hashCode();
                } else if (Array.isArray(value)) {
                    actualValue = this.updateFromArray(hash, value, deep);
                }
            }
        } else {
            actualValue = Number.isNaN(value) ? 0 : value;
        }

        const c1 = 0xCC9E2D51;
        const c2 = 0x1B873593;
        const r1 = 15;
        const r2 = 13;
        const m = 5;
        const n = 0xE6546B64;

        actualValue = Math.imul(actualValue, c1);
        actualValue = (actualValue << r1) | (actualValue >>> (32 - r1));
        actualValue = Math.imul(actualValue, c2);

        hash = hash ^ actualValue;
        hash = (hash << r2) | (hash >>> (32 - r2));
        hash = Math.imul(hash, m) + n;

        return hash;
    }

    /**
     * An efficient hash method specifically for arrays, which does not go through the `update` method for each entry.
     * It's based on the `hashString` method and was extended to handle different array element types and even
     * nested arrays.
     *
     * @param hash The intermediate hash value.
     * @param array The array to hash.
     * @param deep If true then nested arrays are recursively hashed as well, otherwise a simple hash is used for them.
     *
     * @returns The computed hash.
     */
    public static updateFromArray(hash: number, array: ArrayLike<unknown>, deep = false): number {
        let h1 = 0xdeadbeef ^ hash;
        let h2 = 0x41c6ce57 ^ hash;

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < array.length; ++i) {
            const element = array[i];

            if (element != null) {
                let value = 0;
                switch (typeof element) {
                    case "number": {
                        value = Number.isNaN(element) ? 0 : element;

                        break;
                    }

                    case "string": {
                        value = MurmurHash.hashString(hash, element);

                        break;
                    }

                    case "boolean": {
                        value = element ? 1237 : 4327;

                        break;
                    }

                    default: {
                        if (isComparable(element)) {
                            value = element.hashCode();
                        } else if (Array.isArray(element)) {
                            if (deep) {
                                value = this.updateFromArray(11, element, deep);
                            } else {
                                value = 11;
                            }
                        }

                        break;
                    }
                }

                h1 = Math.imul(h1 ^ value, 2654435761);
                h2 = Math.imul(h2 ^ value, 1597334677);
            }
        }

        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return Math.imul(4294967296, (2097151 & h2)) + (h1 >>> 0);
    }

    /**
     * Apply the final computation steps to the intermediate value {@code hash}
     * to form the final result of the MurmurHash 3 hash function.
     *
     * @param hash The intermediate hash value.
     * @param entryCount The number of values added to the hash.
     *
     * @returns the final hash result
     */
    public static finish = (hash: number, entryCount: number): number => {
        hash ^= entryCount * 4;
        hash ^= hash >>> 16;
        hash = Math.imul(hash, 0x85EBCA6B);
        hash ^= hash >>> 13;
        hash = Math.imul(hash, 0xC2B2AE35);
        hash ^= hash >>> 16;

        return hash;
    };

    /**
     * An all-in-one convenience method to compute a hash for a single value.
     *
     * @param value The value to hash.
     * @param seed The seed for the hash value.
     *
     * @returns The computed hash.
     */
    public static hashCode = (value: unknown, seed?: number): number => {
        if (value == null) {
            return 0;
        }

        if (isComparable(value)) {
            return value.hashCode();
        }

        return MurmurHash.finish(MurmurHash.update(seed ?? MurmurHash.defaultSeed, value), 1);
    };

    /**
     * Function to hash a string. Based on the implementation found here:
     * https://stackoverflow.com/a/52171480/1137174
     *
     * @param hash The intermediate hash value.
     * @param str The string to hash.
     *
     * @returns The computed hash.
     */
    private static hashString(hash = 0, str: string): number {
        let h1 = 0xdeadbeef ^ hash;
        let h2 = 0x41c6ce57 ^ hash;
        for (const c of str) { // Correctly iterate over surrogate pairs.
            const ch = c.charCodeAt(0);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

        return Math.imul(4294967296, (2097151 & h2)) + (h1 >>> 0);
    }
}
