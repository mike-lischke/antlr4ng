/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { valueToString } from "./valueToString.js";

export const arrayToString = (value: unknown[]): string => {
    return Array.isArray(value) ? ("[" + value.map(valueToString).join(", ") + "]") : "null";
};
