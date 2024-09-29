/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { HashSet } from "../src/misc/HashSet.js";
import type { IComparable } from "../src/utils/helpers.js";

class Number implements IComparable {
    public constructor(public value: number) { }

    public hashCode(): number {
        return this.value;
    }

    public equals(other: Number): boolean {
        return this.value === other.value;
    }

    public toString(): string {
        return this.value.toString();
    }
}

describe("HashSet", () => {
    let set: HashSet<Number>;

    beforeEach(() => {
        set = new HashSet<Number>();
    });

    it("Adding elements", () => {
        expect(set.add(new Number(1))).toBe(true);
        expect(set.add(new Number(2))).toBe(true);
        expect(set.add(new Number(1))).toBe(false); // Duplicate element
        expect(set.size).toBe(2);
    });

    it("Getting elements", () => {
        set.add(new Number(1));
        set.add(new Number(2));
        expect(set.get(new Number(1)).value).toBe(1);
        expect(set.get(new Number(2)).value).toBe(2);
        expect(set.get(new Number(3))).toBeUndefined();
    });

    it("Remove elements", () => {
        set.add(new Number(1));
        set.add(new Number(2));
        expect(set.remove(new Number(1))).toBe(true);
        expect(set.remove(new Number(3))).toBe(false);
        expect(set.size).toBe(1);
    });

    it("Contains elements", () => {
        set.add(new Number(1));
        set.add(new Number(2));
        expect(set.contains(new Number(1))).toBe(true);
        expect(set.contains(new Number(3))).toBe(false);
    });

    it("Clear the set", () => {
        set.add(new Number(1));
        set.add(new Number(2));
        set.clear();
        expect(set.size).toBe(0);
        expect(set.contains(new Number(1))).toBe(false);
    });

    it("Set size", () => {
        expect(set.size).toBe(0);
        set.add(new Number(1));
        expect(set.size).toBe(1);
    });

    it("Set is empty", () => {
        expect(set.isEmpty).toBe(true);
        set.add(new Number(1));
        expect(set.isEmpty).toBe(false);
    });

    it("Set iteration", () => {
        const a = new Number(1);
        set.add(a);
        const b = new Number(2);
        set.add(b);
        const elements = Array.from(set);
        expect(elements).toContain(a);
        expect(elements).toContain(b);
    });

    it("Set hash code", () => {
        set.add(new Number(1));
        set.add(new Number(2));
        const hashCode = set.hashCode();
        expect(hashCode).toBe(-352383585);
    });

    it("Set equality", () => {
        const set1 = new HashSet<Number>();
        const set2 = new HashSet<Number>();
        set1.add(new Number(1));
        set1.add(new Number(2));
        set2.add(new Number(1));
        set2.add(new Number(2));
        expect(set1.equals(set2)).toBe(true);
        set2.add(new Number(3));
        expect(set1.equals(set2)).toBe(false);
    });

    it("Add array to a set", () => {
        const collection = [new Number(1), new Number(2), new Number(3)];
        set.addAll(collection);
        expect(set.size).toBe(3);
        expect(set.contains(new Number(1))).toBe(true);
        expect(set.contains(new Number(2))).toBe(true);
        expect(set.contains(new Number(3))).toBe(true);
    });

    it("Set contains all elements from an array", () => {
        const collection = [new Number(1), new Number(2), new Number(3)];
        set.addAll(collection);
        expect(set.containsAll(collection)).toBe(true);
        expect(set.containsAll([new Number(1), new Number(4)])).toBe(false);
    });

    it("Set toString", () => {
        set.add(new Number(1));
        set.add(new Number(2));
        expect(set.toString()).toBe("{1, 2}");
    });

    it("Set toTableString", () => {
        set.add(new Number(1));
        set.add(new Number(2));
        const tableString = set.toTableString();
        expect(typeof tableString).toBe("string");
    });
});
