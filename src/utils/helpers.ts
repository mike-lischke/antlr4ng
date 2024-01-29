/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/** Expresses the Java concept of object equality (equality based on the content of two objects). */
export interface IComparable<T = unknown> {
    equals(obj: T | null): boolean;
    hashCode(): number;
}

function isComparable(candidate: unknown): candidate is IComparable {
    return typeof (candidate as IComparable).equals === "function";
}

/**
 * @param value The array to stringify.
 *
 * @returns a human readable string of an array (usually for debugging and testing).
 */
export const arrayToString = (value: unknown): string => {
    return Array.isArray(value) ? `[${value.map(v => String(v)).join(", ")}]` : String(value);
};

/**
 * Compares two arrays for equality, using object equality for elements.
 *
 * @param a The first array to compare.
 * @param b The second array to compare.
 *
 * @returns `true` if `a` and `b` are equal.
 */
export const equalArrays = (a: unknown[], b: unknown[]): boolean => {
    if (a === b) {
        return true;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        const left = a[i];
        const right = b[i];
        if (left === right) {
            continue;
        }

        if (isComparable(left) && !left.equals(right)) {
            return false;
        }
    }

    return true;
};

/**
 * Converts all non-visible whitespaces to escaped equivalents.
 *
 * @param s The string to convert.
 * @param escapeSpaces A flag indicating whether to escape spaces too.
 *
 * @returns The converted string.
 */
export const escapeWhitespace = (s: string, escapeSpaces = false): string => {
    s = s.replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
    if (escapeSpaces) {
        s = s.replace(/ /g, "\u00B7");
    }

    return s;
};

/**
 * Compares two objects for equality, using object equality.
 *
 * @param a The first object to compare.
 * @param b The second object to compare.
 *
 * @returns `true` if `a` and `b` are equal.
 */
export const standardEqualsFunction = (a: IComparable | null, b: unknown): boolean => {
    return a === b || !!a?.equals(b);
};

const stringSeedHashCode = Math.round(Math.random() * Math.pow(2, 32));

/**
 * Generates a hash code for the given string using the Murmur3 algorithm.
 *
 * @param value The string to generate a hash code for.
 *
 * @returns The generated hash code.
 */
export const stringHashCode = (value: string): number => {
    let h1b;
    let k1;

    const remainder = value.length & 3; // key.length % 4
    const bytes = value.length - remainder;
    let h1 = stringSeedHashCode;
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;
    let i = 0;

    while (i < bytes) {
        k1 =
            ((value.charCodeAt(i) & 0xff)) |
            ((value.charCodeAt(++i) & 0xff) << 8) |
            ((value.charCodeAt(++i) & 0xff) << 16) |
            ((value.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    /*  eslint-disable no-fallthrough */
    switch (remainder) {
        case 3:
            k1 ^= (value.charCodeAt(i + 2) & 0xff) << 16;
        // no-break
        case 2:
            k1 ^= (value.charCodeAt(i + 1) & 0xff) << 8;
        // no-break
        case 1:
            k1 ^= (value.charCodeAt(i) & 0xff);
            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
        default:
    }

    h1 ^= value.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
};

/**
 * Generates a hash code for the given object using either the Murmur3 algorithm (for strings) or the object's
 * `hashCode` method.
 *
 * @param a The object to generate a hash code for.
 *
 * @returns The generated hash code.
 */
export const standardHashCodeFunction = (a: string | IComparable): number => {
    return a ? typeof a === "string" ? stringHashCode(a) : a.hashCode() : -1;
};
