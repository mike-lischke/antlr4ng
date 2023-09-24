/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { HashMap } from "../misc/HashMap.js";

export class DoubleDict {
    cacheMap: any;
    defaultMapCtor: any;

    constructor(defaultMapCtor: any) {
        this.defaultMapCtor = defaultMapCtor || HashMap;
        this.cacheMap = new this.defaultMapCtor();
    }

    get(a: any, b: any) {
        const d = this.cacheMap.get(a) || null;
        return d === null ? null : (d.get(b) || null);
    }

    set(a: any, b: any, o: any) {
        let d = this.cacheMap.get(a) || null;
        if (d === null) {
            d = new this.defaultMapCtor();
            this.cacheMap.set(a, d);
        }
        d.set(b, o);
    }
}
