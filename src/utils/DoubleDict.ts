/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DefaultEqualityComparator } from "../misc/DefaultEqualityComparator.js";
import { HashMap } from "../misc/HashMap.js";
import { IComparable } from "./helpers.js";

export class DoubleDict<
    Key1 extends IComparable | null | undefined, Key2 extends IComparable | null | undefined, Value>  {
    private readonly cacheMap: HashMap<Key1, HashMap<Key2, Value>>;

    public constructor() {
        this.cacheMap = new HashMap<Key1, HashMap<Key2, Value>>(DefaultEqualityComparator.instance);
    }

    public get(a: Key1, b: Key2): Value | null {
        const d = this.cacheMap.get(a) ?? null;

        return d === null ? null : (d.get(b) ?? null);
    }

    public set(a: Key1, b: Key2, o: Value): void {
        let d = this.cacheMap.get(a);
        if (!d) {
            d = new HashMap<Key2, Value>(DefaultEqualityComparator.instance);
            this.cacheMap.set(a, d);
        }

        d.set(b, o);
    }

}
