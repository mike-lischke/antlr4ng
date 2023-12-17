/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BitSet } from "../src/misc/BitSet.js";

describe("BitSet", () => {
    it("Initialize  with all bits set to false", () => {
        const bitSet = new BitSet();
        expect(bitSet.length).toEqual(0);
    });

    it("Set a single bit to true", () => {
        const bitSet = new BitSet();
        bitSet.set(5);
        expect(bitSet.get(5)).toEqual(true);
        expect(bitSet.length).toEqual(1);

        bitSet.set(1000000);
        expect(bitSet.get(1000000)).toEqual(true);
        expect(bitSet.get(1000001)).toEqual(false);
        expect(bitSet.length).toEqual(2);
    });

    it("Clear a single bit", () => {
        const bitSet = new BitSet();
        bitSet.set(5);
        bitSet.clear(5);
        expect(bitSet.get(5)).toEqual(false);
        expect(bitSet.length).toEqual(0);
    });

    it("Clear all bits", () => {
        const bitSet = new BitSet();
        bitSet.set(5);
        bitSet.set(10);
        bitSet.clear();
        expect(bitSet.length).toEqual(0);
    });

    it("Perform logical OR operation with another BitSet", () => {
        const bitSet1 = new BitSet();
        bitSet1.set(5);
        bitSet1.set(10);

        const bitSet2 = new BitSet();
        bitSet2.set(10);
        bitSet2.set(15);

        bitSet1.or(bitSet2);

        expect(bitSet1.get(5)).toEqual(true);
        expect(bitSet1.get(10)).toEqual(true);
        expect(bitSet1.get(15)).toEqual(true);
        expect(bitSet1.length).toEqual(3);
    });

    it("Return the index of the first set bit", () => {
        const bitSet = new BitSet();
        bitSet.set(5);
        bitSet.set(10);
        bitSet.set(15);

        expect(bitSet.nextSetBit(0)).toEqual(5);
        expect(bitSet.nextSetBit(6)).toEqual(10);
        expect(bitSet.nextSetBit(11)).toEqual(15);
        expect(bitSet.nextSetBit(16)).toEqual(undefined);
    });

    it("Return an array with indices of set bits", () => {
        const bitSet = new BitSet();
        bitSet.set(5);
        bitSet.set(1000);
        bitSet.set(15);

        const values = bitSet.values();
        expect(values).toEqual([5, 15, 1000]);
    });

    it("Return a string representation of the BitSet", () => {
        const bitSet = new BitSet();
        bitSet.set(5);
        bitSet.set(10);
        bitSet.set(15);

        expect(bitSet.toString()).toEqual("{5, 10, 15}");
    });

    it("Create a BitSet with predefined values", () => {
        const bitSet = new BitSet([0x003FFE1806000000n]);
        expect(bitSet.get(5)).toEqual(false);
        expect(bitSet.get(25)).toEqual(true);
        expect(bitSet.get(49)).toEqual(true);
        expect(bitSet.get(38)).toEqual(false);
        expect(bitSet.length).toEqual(17);
    });

    it("Create a BitSet with multiple values", () => {
        const bitSet = new BitSet([0x0000000000000001n, 0x003FFE1806000001n]);
        expect(bitSet.get(0)).toEqual(true);
        expect(bitSet.get(63)).toEqual(false);
        expect(bitSet.get(64)).toEqual(true);
        expect(bitSet.get(99)).toEqual(true);
        expect(bitSet.length).toEqual(19);
    });

    it("Create a BitSet with values exceeding 64 bits", () => {
        const bitSet = new BitSet([0x003FFE1806000000n, 0x333333330000000000000001n, 0x4444444123456789ABCDEF0n]);
        expect(bitSet.get(5)).toEqual(false);
        expect(bitSet.get(47)).toEqual(true);
        expect(bitSet.get(64)).toEqual(true);
        expect(bitSet.get(133)).toEqual(true);
        expect(bitSet.get(188)).toEqual(true);
        expect(bitSet.get(2000)).toEqual(false);
        expect(bitSet.length).toEqual(50);
    });

    // ...
});
