/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, expect, it } from "vitest";

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
        const bitSet = new BitSet([0xf8f800f0]);
        expect(bitSet.get(5)).toEqual(true);
        expect(bitSet.get(8)).toEqual(false);
        expect(bitSet.get(19)).toEqual(true);
        expect(bitSet.get(24)).toEqual(false);
        expect(bitSet.get(27)).toEqual(true);
        expect(bitSet.length).toEqual(14);
    });

    it("Create a BitSet with multiple values", () => {
        const bitSet = new BitSet([0x00000001, 0x7f87060]);
        expect(bitSet.get(0)).toEqual(true);
        expect(bitSet.get(32)).toEqual(false);
        expect(bitSet.get(44)).toEqual(true);
        expect(bitSet.get(47)).toEqual(false);
        expect(bitSet.get(51)).toEqual(true);
        expect(bitSet.get(59)).toEqual(false);
        expect(bitSet.length).toEqual(14);
    });

    it("Create a BitSet with values exceeding 32 bits", () => {
        const bitSet = new BitSet([0x03fe1806000, 0x333300000001, 0x444123456abcde]);
        expect(bitSet.get(5)).toEqual(false);
        expect(bitSet.get(13)).toEqual(true);
        expect(bitSet.get(33)).toEqual(false);
        expect(bitSet.get(88)).toEqual(true);
        expect(bitSet.get(94)).toEqual(true);
        expect(bitSet.get(95)).toEqual(false);
        expect(bitSet.get(2000)).toEqual(false);
        expect(bitSet.length).toEqual(23);
    });
});
