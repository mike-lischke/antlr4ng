/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export function titleCase(str: any) {
    return str.replace(/\w\S*/g, function (txt: any) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
    });
}
