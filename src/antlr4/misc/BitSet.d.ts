/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export declare class BitSet implements Iterable<number> {
    private data: Uint16Array;

    /** Creates a new bit set. All bits are initially `false`. */
    public constructor();

    /**
     * Sets all of the bits in this `BitSet` to `false`.
     */
    public clear(): void;

    /**
     * Sets the bit specified by the index to `false`.
     *
     * @param bitIndex the index of the bit to be cleared
     *
     * @throws RangeError if the specified index is negative
     */
    public clear(bitIndex: number): void;

    /**
     * Returns the value of the bit with the specified index. The value is `true` if the bit with the index `bitIndex`
     * is currently set in this `BitSet`; otherwise, the result is `false`.
     *
     * @param bitIndex the bit index
     *
     * @throws RangeError if the specified index is negative
     */
    public get(bitIndex: number): boolean;

    /**
     * Returns the number of set bits.
     */
    public length(): number;

    /**
     * Returns the index of the first bit that is set to `true` that occurs on or after the specified starting index.
     * If no such bit exists then undefined is returned.
     *
     * @param fromIndex the index to start checking from (inclusive)
     */
    public nextSetBit(fromIndex: number): number;

    /**
     * Performs a logical **OR** of this bit set with the bit set argument. This bit set is modified so that a bit in it
     * has the value `true` if and only if it either already had the value `true` or the corresponding bit in the bit
     * set argument has the value `true`.
     *
     * @param set
     */
    public or(set: BitSet): void;

    /**
     * Sets the bit at the specified index to `true`.
     *
     * @param bitIndex a bit index
     *
     * @throws RangeError if the specified index is negative
     */
    public set(bitIndex: number): void;

    /**
     * Returns a string representation of this bit set.
     */
    public toString(): string;

    public [Symbol.iterator](): IterableIterator<number>;

}
