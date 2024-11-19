/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, expect, it } from "vitest";

import { OrderedHashSet, type IComparable } from "../../src/index.js";

class TestClass implements IComparable {
    #value: number;

    public constructor(value: number) {
        this.#value = value;
    }

    public equals(o: TestClass): boolean {
        return this.#value === o.#value;
    }

    public hashCode(): number {
        return this.#value;
    }
};

describe("TestOrderedHashSet", () => {
    it("general", () => {
        const set = new OrderedHashSet<TestClass>();
        expect(set.size).toBe(0);

        const obj1 = new TestClass(1);
        const obj2 = new TestClass(2);
        const obj3 = new TestClass(3);
        const obj4 = new TestClass(4);

        set.add(obj1);
        set.add(obj2);
        set.add(obj3);
        set.add(obj4);

        expect(set.size).toBe(4);
        expect(set.toArray()).toEqual([obj1, obj2, obj3, obj4]);
    });

    it("duplicates and order", () => {
        const set = new OrderedHashSet<TestClass>();
        expect(set.size).toBe(0);

        const obj1 = new TestClass(1);
        const obj2 = new TestClass(2);
        const obj3 = new TestClass(3);
        const obj4 = new TestClass(4);
        set.addAll([obj1, obj2, obj3, obj4, obj1, obj2, obj3, obj4]);

        expect(set.size).toBe(4);
        expect(set.toArray()).toEqual([obj1, obj2, obj3, obj4]);

        set.clear();
        expect(set.size).toBe(0);

        set.addAll([obj4, obj3, obj2, obj1, obj1, obj2, obj2, obj1]);
        expect(set.size).toBe(4);
        expect(set.toArray()).toEqual([obj4, obj3, obj2, obj1]);
    });

    it("iterator", () => {
        const set = new OrderedHashSet<TestClass>();
        expect(set.size).toBe(0);

        const obj1 = new TestClass(1);
        const obj2 = new TestClass(2);
        const obj3 = new TestClass(3);
        const obj4 = new TestClass(4);

        set.add(obj1);
        set.add(obj2);
        set.add(obj3);
        set.add(obj4);

        expect(set.size).toBe(4);
        const iter = set[Symbol.iterator]();
        expect(iter.next().value).toBe(obj1);
        expect(iter.next().value).toBe(obj2);
        expect(iter.next().value).toBe(obj3);
        expect(iter.next().value).toBe(obj4);
        expect(iter.next().done).toBe(true);
    });
});
