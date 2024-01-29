import { IComparable, equalArrays } from '../src/utils/helpers.js';

// A custom class that implements IComparable for testing purposes.
class Comparable implements IComparable<Comparable> {
    constructor(public value: string | number | null) { }
    equals(obj: Comparable | null): boolean {
        return obj ? this.value == obj?.value : false;
    }
    hashCode(): number { return this.value ? Number(this.value) : 0; }
}

describe('equalArrays', () => {
    it('should return true for equal arrays', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2, 3];
        expect(equalArrays(arr1, arr2)).toBe(true);
    });

    it('should return false for arrays with different lengths', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 2];
        expect(equalArrays(arr1, arr2)).toBe(false);
    });

    it('should return false for arrays with different elements', () => {
        const arr1 = [1, 2, 3];
        const arr2 = [1, 4, 3];
        expect(equalArrays(arr1, arr2)).toBe(false);
    });

    it('should return true for arrays with custom objects that have an equals method', () => {
        const arr1 = [ new Comparable(1) ];
        const arr2 = [ new Comparable("1") ];
        expect(equalArrays(arr1, arr2)).toBe(true);
    });

    it('should return false for arrays with custom objects that have different equals method results', () => {
        const arr1 = [ new Comparable(1) ];
        const arr2 = [ new Comparable("2") ];
        expect(equalArrays(arr1, arr2)).toBe(false);
    });
});