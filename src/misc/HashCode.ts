/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export type HashableTypes = string | number | boolean | IHashUpdatable | HashableTypes[] | null;

export interface IHashUpdatable {
    updateHashCode(hash: HashCode): void;
}

const c1 = 0xCC9E2D51;
const c2 = 0x1B873593;
const r1 = 15;
const r2 = 13;
const m = 5;
const n = 0xE6546B64;

export class HashCode {
    private count: number;
    private hash: number;

    public constructor() {
        this.count = 0;
        this.hash = 0;
    }

    public static hashStuff(...values: HashableTypes[]): number {
        const hash = new HashCode();
        hash.update(values);

        return hash.finish();
    }

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

    public update(...values: HashableTypes[]): void {
        for (const value of values) {
            if (value == null) {
                continue;
            }

            if (Array.isArray(value)) {
                this.update(...value);
            } else {
                let k = 0;
                switch (typeof (value)) {
                    case "undefined":
                    case "function": {
                        continue;
                    }

                    case "number": {
                        k = value;
                        break;
                    }

                    case "boolean": {
                        k = value ? 1237 : 4327;
                        break;
                    }

                    case "string": {
                        k = HashCode.hashString(this.hash, value);
                        break;
                    }

                    default: {
                        value.updateHashCode(this);

                        continue;
                    }
                }

                this.count = this.count + 1;
                k = Math.imul(k, c1);
                k = (k << r1) | (k >>> (32 - r1));
                k = Math.imul(k, c2);

                let hash = this.hash ^ k;
                hash = (hash << r2) | (hash >>> (32 - r2));
                this.hash = Math.imul(hash, m) + n;
            }
        }
    }

    /**
     * Update the internal hash value with a pre-computed hash value.
     *
     * @param k The pre-computed hash value.
     */
    public updateWithHashCode(k: number): void {
        this.count = this.count + 1;
        k = Math.imul(k, c1);
        k = (k << r1) | (k >>> (32 - r1));
        k = Math.imul(k, c2);

        let hash = this.hash ^ k;
        hash = (hash << r2) | (hash >>> (32 - r2));
        this.hash = Math.imul(hash, m) + n;
    }

    public finish(): number {
        let hash = this.hash ^ (this.count * 4);
        hash ^= hash >>> 16;
        hash = Math.imul(hash, 0x85EBCA6B);
        hash ^= hash >>> 13;
        hash = Math.imul(hash, 0xC2B2AE35);
        hash ^= hash >>> 16;

        return hash;
    }
}
