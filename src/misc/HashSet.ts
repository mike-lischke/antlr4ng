/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { standardHashCodeFunction } from "../utils/standardHashCodeFunction.js";
import { standardEqualsFunction } from "../utils/standardEqualsFunction.js";
import { arrayToString } from "../utils/arrayToString.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
const HASH_KEY_PREFIX = "h-";

export class HashSet {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equalsFunction: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    hashFunction: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(hashFunction: any, equalsFunction: any) {
        this.data = {};
        this.hashFunction = hashFunction || standardHashCodeFunction;
        this.equalsFunction = equalsFunction || standardEqualsFunction;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    add(value: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const key = HASH_KEY_PREFIX + this.hashFunction(value);
        if (key in this.data) {
            const values = this.data[key];
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < values.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (this.equalsFunction(value, values[i])) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return values[i];
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            values.push(value);
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return value;
        } else {
            this.data[key] = [value];
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return value;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    has(value: any) {
        return this.get(value) != null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    get(value: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const key = HASH_KEY_PREFIX + this.hashFunction(value);
        if (key in this.data) {
            const values = this.data[key];
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < values.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (this.equalsFunction(value, values[i])) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return values[i];
                }
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    values() {
        // @ts-expect-error TS(2550): Property 'flatMap' does not exist on type 'string[... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, arrow-parens, arrow-body-style, @typescript-eslint/no-explicit-any
        return Object.keys(this.data).filter(key => key.startsWith(HASH_KEY_PREFIX)).flatMap((key: any) => this.data[key], this);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return arrayToString(this.values());
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get length() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, arrow-parens, arrow-body-style
        return Object.keys(this.data).filter(key => key.startsWith(HASH_KEY_PREFIX)).map(key => this.data[key].length, this).reduce((accum, item) => accum + item, 0);
    }
}
