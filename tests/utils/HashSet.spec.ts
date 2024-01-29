import { HashSet } from '../../src/misc/HashSet.js';
import { IComparable } from '../../src/utils/helpers.js';

// A custom class that implements IComparable for testing purposes.
class Comparable implements IComparable<Comparable> {
    constructor(public value: string | number | null) { }
    equals(obj: Comparable | null): boolean {
        return obj ? this.value == obj?.value : false;
    }
    hashCode(): number { return this.value ? Number(this.value) : 0; }
    toString(): string { return String(this.value); }
}

describe('HashSet', () => {

    describe("add", () => {
        it('should add unique IComparable values to the set', () => {
            const set = new HashSet<Comparable>();
            const value1 = new Comparable(1);
            const value2 = new Comparable(2);

            set.add(value1);
            set.add(value2);

            expect(set.length).toBe(2);
            expect(set.has(value1)).toBe(true);
            expect(set.has(value2)).toBe(true);
        });

        it('should not add duplicate IComparable values to the set', () => {
            const set = new HashSet<Comparable>();
            const value1 = new Comparable(1);
            const value2 = new Comparable(1);

            set.add(value1);
            set.add(value2);

            expect(set.length).toBe(1);
            expect(set.has(value1)).toBe(true);
            expect(set.has(value2)).toBe(true);
            expect(set.add(value2)).toStrictEqual(value1);
        });

        it('should add unique values to the set with custom compare function', () => {
            const set = new HashSet<Comparable>(null, (a, b) => a?.value === b?.value);
            const value1 = new Comparable(1);
            const value2 = new Comparable("1");

            set.add(value1);
            set.add(value2);

            expect(set.length).toBe(2);
            expect(set.has(value1)).toBe(true);
            expect(set.has(value2)).toBe(true);
        });

        it('should not add duplicate values to the set with custom compare function', () => {
            const set = new HashSet<Comparable>(null, (a, b) => a?.value == b?.value);
            const value1 = new Comparable(1);
            const value2 = new Comparable("1");

            set.add(value1);
            set.add(value2);

            expect(set.length).toBe(1);
            expect(set.has(value1)).toBe(true);
            expect(set.has(value2)).toBe(true);
            expect(set.add(value2)).toStrictEqual(value1);
        });
    });

    describe("get", () => {
        it('should retrieve values from the set', () => {
            const set = new HashSet<Comparable>();
            const value1 = new Comparable(1);
            const value2 = new Comparable(2);

            set.add(value1);
            set.add(value2);

            expect(set.get(value1)).toBe(value1);
            expect(set.get(value2)).toBe(value2);
        });

        it('should return null for non-existing values', () => {
            const set = new HashSet<Comparable>();
            const value1 = new Comparable(1);
            const value2 = new Comparable(2);

            set.add(value1);

            expect(set.get(value2)).toBe(null);
        });
    });

    describe("values", () => {
        it('should return all values in the set', () => {
            const set = new HashSet<Comparable>();
            const value1 = new Comparable(1);
            const value2 = new Comparable(2);

            set.add(value1);
            set.add(value2);

            const values = set.values();

            expect(values.length).toBe(2);
            expect(values).toContain(value1);
            expect(values).toContain(value2);
        });

        it('should return empty array when set is empty', () => {
            const set = new HashSet<Comparable>();

            const values = set.values();

            expect(values.length).toBe(0);
        });
    });

    describe("toString", () => {
        it('should convert the set to a string', () => {
            const set = new HashSet<Comparable>();

            const value1 = new Comparable(1);
            const value2 = new Comparable(2);

            set.add(value1);
            set.add(value2);

            const str = set.toString();

            expect(str).toBe('[1, 2]');
        });
    });
});