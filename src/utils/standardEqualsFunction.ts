/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */
interface Comparible {equals: (b: unknown) => boolean}

export const isComparable = (a: unknown): a is Comparible => {
    return typeof a === "object" && a !== null && "equals" in a && typeof a.equals === "function";
};

export const standardEqualsFunction = (a: Comparible | null, b:unknown):boolean => {
    return a ? a.equals(b) : a === b;
};
