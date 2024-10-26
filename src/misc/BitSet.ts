/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class BitSet implements Iterable<number> {
    private data: Uint32Array;

    /**
     * Creates a new bit set. All bits are initially `false`.
     *
     * @param data Optional initial data.
     */
    public constructor(data?: number[]) {
        if (data) {
            // Only use the lower 32 bits.
            this.data = new Uint32Array(data.map((value) => { return value >>> 0; }));
        } else {
            this.data = new Uint32Array(1);
        }
    }

    /**
     * @returns an iterator over all set bits.
     */
    public [Symbol.iterator](): IterableIterator<number> {
        const length = this.data.length;
        let currentIndex = 0;
        let currentWord = this.data[currentIndex];
        const words = this.data;

        return {
            [Symbol.iterator](): IterableIterator<number> {
                return this;
            },
            next: (): IteratorResult<number> => {
                while (currentIndex < length) {
                    if (currentWord !== 0) {
                        const t = currentWord & -currentWord;
                        const value = (currentIndex << 5) + this.bitCount(t - 1);
                        currentWord ^= t;

                        return { done: false, value };
                    } else {
                        currentIndex++;
                        if (currentIndex < length) {
                            currentWord = words[currentIndex];
                        }
                    }
                }

                return { done: true, value: undefined };
            },
        };
    };

    /**
     * Sets a single bit or all of the bits in this `BitSet` to `false`.
     *
     * @param index the index of the bit to be cleared, or undefined to clear all bits.
     */
    public clear(index?: number): void {
        if (index === undefined) {
            this.data = new Uint32Array();
        } else {
            this.resize(index);
            this.data[index >>> 5] &= ~(1 << index);
        }
    }

    /**
     * Performs a logical **OR** of this bit set with the bit set argument. This bit set is modified so that a bit in it
     * has the value `true` if and only if it either already had the value `true` or the corresponding bit in the bit
     * set argument has the value `true`.
     *
     * @param set the bit set to be ORed with.
     */
    public or(set: BitSet): void {
        const minCount = Math.min(this.data.length, set.data.length);
        for (let k = 0; k < minCount; ++k) {
            this.data[k] |= set.data[k];
        }

        if (this.data.length < set.data.length) {
            this.resize((set.data.length << 5) - 1);
            const c = set.data.length;
            for (let k = minCount; k < c; ++k) {
                this.data[k] = set.data[k];
            }
        }
    }

    /**
     * Returns the value of the bit with the specified index. The value is `true` if the bit with the index `bitIndex`
     * is currently set in this `BitSet`; otherwise, the result is `false`.
     *
     * @param index the bit index
     *
     * @returns the value of the bit with the specified index.
     */
    public get(index: number): boolean {
        if (index < 0) {
            throw new RangeError("index cannot be negative");
        }

        const slot = index >>> 5;
        if (slot >= this.data.length) {
            return false;
        }

        return (this.data[slot] & (1 << (index % 32))) !== 0;
    }

    /**
     * @returns the number of set bits.
     */
    public get length(): number {
        let result = 0;
        const c = this.data.length;
        const w = this.data;
        for (let i = 0; i < c; i++) {
            result += this.bitCount(w[i]);
        }

        return result;
    }

    /**
     * @returns an array with indices of set bits.
     */
    public values(): number[] {
        const result = new Array<number>(this.length);
        let pos = 0;
        const length = this.data.length;
        for (let k = 0; k < length; ++k) {
            let w = this.data[k];
            while (w !== 0) {
                const t = w & -w;
                result[pos++] = (k << 5) + this.bitCount(t - 1);
                w ^= t;
            }
        }

        return result;
    }

    /**
     * @returns the index of the first bit that is set to `true` that occurs on or after the specified starting index.
     * If no such bit exists then undefined is returned.
     *
     * @param fromIndex the index to start checking from (inclusive)
     */
    public nextSetBit(fromIndex: number): number | undefined {
        if (fromIndex < 0) {
            throw new RangeError("index cannot be negative");
        }

        // Iterate over all set bits.
        for (const index of this) {
            // Use the first index > than the specified value index.
            if (index > fromIndex) {
                return index;
            }
        }

        return undefined; // TODO: should be -1 according to JDK docs.
    }

    /**
     * Sets the bit at the specified index to `true`.
     *
     * @param index a bit index
     */
    public set(index: number): void {
        if (index < 0) {
            throw new RangeError("index cannot be negative");
        }

        this.resize(index);
        this.data[index >>> 5] |= (1 << (index % 32));
    }

    /**
     * @returns a string representation of this bit set.
     */
    public toString(): string {
        return "{" + this.values().join(", ") + "}";
    }

    private resize(index: number): void {
        const count = ((index + 32) >>> 5);
        if (count <= this.data.length) {
            return;
        }

        const data = new Uint32Array(count);
        data.set(this.data);
        data.fill(0, this.data.length);

        this.data = data;
    };

    private bitCount(v: number): number { // a.k.a. hamming weight
        v = v - ((v >> 1) & 0x55555555);
        v = (v & 0x33333333) + ((v >> 2) & 0x33333333);
        v = (v + (v >> 4)) & 0x0f0f0f0f;
        v = v + (v >> 8);
        v = v + (v >> 16);

        return v & 0x3f;
    };

}
