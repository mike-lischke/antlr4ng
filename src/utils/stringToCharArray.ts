/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export const stringToCharArray = (str: string): Uint16Array => {
    const result = new Uint16Array(str.length);

    for (let i = 0; i < str.length; i++) {
        result[i] = str.charCodeAt(i);
    }

    return result;
};
