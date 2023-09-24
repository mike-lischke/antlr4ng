/* eslint-disable jsdoc/require-jsdoc, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function stringToCharArray(str: any) {
    // eslint-disable-next-line prefer-const, @typescript-eslint/no-unsafe-argument
    let result = new Uint16Array(str.length);
    for (let i = 0; i < str.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        result[i] = str.charCodeAt(i);
    }
    // eslint-disable-next-line padding-line-between-statements
    return result;
}
