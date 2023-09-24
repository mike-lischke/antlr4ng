/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { HashMap } from "../misc/HashMap.js";

export class DoubleDict {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    cacheMap: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    defaultMapCtor: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(defaultMapCtor: any) {
        this.defaultMapCtor = defaultMapCtor || HashMap;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.cacheMap = new this.defaultMapCtor();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    get(a: any, b: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const d = this.cacheMap.get(a) || null;
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return d === null ? null : (d.get(b) || null);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    set(a: any, b: any, o: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        let d = this.cacheMap.get(a) || null;
        if (d === null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            d = new this.defaultMapCtor();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.cacheMap.set(a, d);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        d.set(b, o);
    }
}
