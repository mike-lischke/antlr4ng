/* eslint-disable jsdoc/require-jsdoc, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function titleCase(str: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    return str.replace(/\w\S*/g, function (txt: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}
