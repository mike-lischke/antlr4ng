/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { isComparable } from "./standardEqualsFunction.js";

export const equalArrays = (a: unknown, b: unknown): boolean => {
    if (!Array.isArray(a) || !Array.isArray(b)) {
        return false;
    }
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i]) {
            continue;
        }

        if(!isComparable(a) || !a.equals(b[i])){
            return false;
        }
    }

    return true;
};
