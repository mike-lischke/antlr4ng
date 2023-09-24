/* eslint-disable jsdoc/require-jsdoc */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { stringHashCode } from "./stringHashCode.js";

export function standardHashCodeFunction(a: any) {
    return a ? typeof a === 'string' ? stringHashCode(a) : a.hashCode() : -1;
}
