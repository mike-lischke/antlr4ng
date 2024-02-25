/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/** Expresses the Java concept of object equality (equality based on the content of two objects). */
export interface IComparable {
    equals(obj: unknown): boolean;
    hashCode(): number;
}

export const isComparable = (candidate: unknown): candidate is IComparable => {
    return typeof (candidate as IComparable).equals === "function";
};

const valueToString = (v: null | string): string => {
    return v === null ? "null" : v;
};

/**
 * @param value The array to stringify.
 *
 * @returns a human readable string of an array (usually for debugging and testing).
 */
export const arrayToString = (value: unknown[] | null): string => {
    return Array.isArray(value) ? ("[" + value.map(valueToString).join(", ") + "]") : "null";
};

/**
 * Compares two arrays for equality, using object equality for elements.
 *
 * @param a The first array to compare.
 * @param b The second array to compare.
 *
 * @returns `true` if `a` and `b` are equal.
 */
export const equalArrays = <T extends IComparable | null>(a: T[], b: T[]): boolean => {
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

        if (!left || !left.equals(right)) {
            return false;
        }
    }

    return true;
};

/**
 * Compares two number arrays for equality.
 *
 * @param a The first array to compare.
 * @param b The second array to compare.
 *
 * @returns `true` if `a` and `b` are equal.
 */
export const equalNumberArrays = (a: number[], b: number[]): boolean => {
    if (a === b) {
        return true;
    }

    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
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
