/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export const escapeWhitespace = (s: string, escapeSpaces = false): string => {
    s = s.replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
    if (escapeSpaces) {
        s = s.replace(/ /g, "\u00B7");
    }

    return s;
};
