/* eslint-disable jsdoc/require-jsdoc, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function equalArrays(a: any, b: any) {
    if (!Array.isArray(a) || !Array.isArray(b))
        // eslint-disable-next-line curly
        return false;
    if (a === b)
        // eslint-disable-next-line curly
        return true;
    if (a.length !== b.length)
        // eslint-disable-next-line curly
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i])
            // eslint-disable-next-line curly
            continue;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (!a[i].equals || !a[i].equals(b[i]))
            // eslint-disable-next-line curly
            return false;
    }
    // eslint-disable-next-line padding-line-between-statements
    return true;
}
