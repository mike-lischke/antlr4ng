/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { standardHashCodeFunction } from "../utils/standardHashCodeFunction.js";
import { standardEqualsFunction } from "../utils/standardEqualsFunction.js";
import { arrayToString } from "../utils/arrayToString.js";

const HASH_KEY_PREFIX = "h-";

export class HashSet {
    data: any;
    equalsFunction: any;
    hashFunction: any;

    constructor(hashFunction: any, equalsFunction: any) {
        this.data = {};
        this.hashFunction = hashFunction || standardHashCodeFunction;
        this.equalsFunction = equalsFunction || standardEqualsFunction;
    }

    add(value: any) {
        const key = HASH_KEY_PREFIX + this.hashFunction(value);
        if (key in this.data) {
            const values = this.data[key];
            for (let i = 0; i < values.length; i++) {
                if (this.equalsFunction(value, values[i])) {
                    return values[i];
                }
            }
            values.push(value);
            return value;
        } else {
            this.data[key] = [value];
            return value;
        }
    }

    has(value: any) {
        return this.get(value) != null;
    }

    get(value: any) {
        const key = HASH_KEY_PREFIX + this.hashFunction(value);
        if (key in this.data) {
            const values = this.data[key];
            for (let i = 0; i < values.length; i++) {
                if (this.equalsFunction(value, values[i])) {
                    return values[i];
                }
            }
        }
        return null;
    }

    values() {
        // @ts-expect-error TS(2550): Property 'flatMap' does not exist on type 'string[... Remove this comment to see the full error message
        return Object.keys(this.data).filter(key => key.startsWith(HASH_KEY_PREFIX)).flatMap((key: any) => this.data[key], this);
    }

    toString() {
        return arrayToString(this.values());
    }

    get length() {
        return Object.keys(this.data).filter(key => key.startsWith(HASH_KEY_PREFIX)).map(key => this.data[key].length, this).reduce((accum, item) => accum + item, 0);
    }
}
