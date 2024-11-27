/*
* Copyright (c) The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/

/*
 * Parts added + modified: copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { type IComparable } from "./helpers.js";

const c1 = 0xCC9E2D51;
const c2 = 0x1B873593;
const r1 = 15;
const r2 = 13;
const m = 5;
const n = 0xE6546B64;

/** A class that implements the Murmur hash algorithm. */
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

    public static updateFromComparable(hash: number, value?: IComparable | null): number {
        return this.update(hash, value?.hashCode() ?? 0);
    }

    /**
     * Update the intermediate hash value for the next input {@code value}.
     *
     * @param hash The intermediate hash value.
     * @param value the value to add to the current hash.
     *
     * @returns the updated intermediate hash value
     */
    public static update(hash: number, value: number): number {
        value = Math.imul(value, c1);
        value = (value << r1) | (value >>> (32 - r1));
        value = Math.imul(value, c2);

        hash = hash ^ value;
        hash = (hash << r2) | (hash >>> (32 - r2));
        hash = Math.imul(hash, m) + n;

        return hash;
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
    public static finish(hash: number, entryCount: number): number {
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
    public static hashCode(value: number, seed?: number): number {
        return MurmurHash.finish(MurmurHash.update(seed ?? MurmurHash.defaultSeed, value), 1);
    };
}
