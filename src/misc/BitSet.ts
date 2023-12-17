/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class BitSet implements Iterable<number>{
    private data: BigUint64Array;

    /**
     * Creates a new bit set. All bits are initially `false`.
     *
     * @param data Optional initial data.
     */
    public constructor(data?: bigint[]) {
        if (data) {
            // Only use the lower 64 bits.
            this.data = new BigUint64Array(data.map((value) => { return BigInt.asUintN(64, value); }));
        } else {
            this.data = new BigUint64Array(1);
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
                    if (currentWord !== 0n) {
                        const t = currentWord & -currentWord;
                        const value = (currentIndex << 6) + this.bitCount(t - 1n);
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
            this.data = new BigUint64Array();
        } else {
            this.resize(index);
            this.data[index >>> 6] &= ~BigInt(1 << index);
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
        let k = 0;
        for (; k + 7 < minCount; k += 8) {
            this.data[k] |= set.data[k];
            this.data[k + 1] |= set.data[k + 1];
            this.data[k + 2] |= set.data[k + 2];
            this.data[k + 3] |= set.data[k + 3];
            this.data[k + 4] |= set.data[k + 4];
            this.data[k + 5] |= set.data[k + 5];
            this.data[k + 6] |= set.data[k + 6];
            this.data[k + 7] |= set.data[k + 7];
        }

        for (; k < minCount; ++k) {
            this.data[k] |= set.data[k];
        }

        if (this.data.length < set.data.length) {
            this.resize((set.data.length << 6) - 1);
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

        const slot = index >>> 6;
        if (slot >= this.data.length) {
            return false;
        }

        return (this.data[slot] & (1n << BigInt(index % 64))) !== 0n;
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
            while (w !== 0n) {
                const t = w & -w;
                result[pos++] = (k << 6) + this.bitCount((t - 1n) | 0n);
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
        this.data[index >>> 6] |= (1n << BigInt(index % 64));
    }

    /**
     * @returns a string representation of this bit set.
     */
    public toString(): string {
        return "{" + this.values().join(", ") + "}";
    }

    private resize(index: number): void {
        const count = (index + 64) >>> 6;
        if (count <= this.data.length) {
            return;
        }

        const data = new BigUint64Array(count);
        data.set(this.data);
        data.fill(0n, this.data.length);

        this.data = data;
    };

    private bitCount(v: bigint): number { // a.k.a. hamming weight
        v = v - ((v >> 1n) & 0x5555555555555555n);
        v = (v & 0x3333333333333333n) + ((v >> 2n) & 0x3333333333333333n);
        v = (v + (v >> 4n)) & 0x0f0f0f0f0f0f0f0fn;
        v = v + (v >> 8n);
        v = v + (v >> 16n);
        v = v + (v >> 32n);

        return Number(v) & 0x7f;
    };

}
