/* eslint-disable jsdoc/require-jsdoc, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function escapeWhitespace(s: any, escapeSpaces: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    s = s.replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
    if (escapeSpaces) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        s = s.replace(/ /g, "\u00B7");
    }
    // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
    return s;
}
