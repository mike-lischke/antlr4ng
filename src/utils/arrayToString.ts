/* eslint-disable jsdoc/require-jsdoc, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { valueToString } from "./valueToString.js";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function arrayToString(a: any) {
    return Array.isArray(a) ? ("[" + a.map(valueToString).join(", ") + "]") : "null";
}
