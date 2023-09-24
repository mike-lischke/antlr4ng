/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { standardEqualsFunction } from "../utils/standardEqualsFunction.js";
import { standardHashCodeFunction } from "../utils/standardHashCodeFunction.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
const HASH_KEY_PREFIX = "h-";

export class HashMap {
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
    set(key: any, value: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const hashKey = HASH_KEY_PREFIX + this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (this.equalsFunction(key, entry.key)) {
                    const oldValue = entry.value;
                    entry.value = value;
                    // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
                    return oldValue;
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, object-shorthand
            entries.push({ key: key, value: value });
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return value;
        } else {
            // eslint-disable-next-line object-shorthand
            this.data[hashKey] = [{ key: key, value: value }];
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return value;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    containsKey(key: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const hashKey = HASH_KEY_PREFIX + this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (this.equalsFunction(key, entry.key))
                    // eslint-disable-next-line curly
                    return true;
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    get(key: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const hashKey = HASH_KEY_PREFIX + this.hashFunction(key);
        if (hashKey in this.data) {
            const entries = this.data[hashKey];
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (this.equalsFunction(key, entry.key))
                    // eslint-disable-next-line curly, @typescript-eslint/no-unsafe-return
                    return entry.value;
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    entries() {
        // @ts-expect-error TS(2550): Property 'flatMap' does not exist on type 'string[... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, arrow-parens, arrow-body-style, @typescript-eslint/no-explicit-any
        return Object.keys(this.data).filter(key => key.startsWith(HASH_KEY_PREFIX)).flatMap((key: any) => this.data[key], this);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getKeys() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, arrow-body-style
        return this.entries().map((e: any) => e.key);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getValues() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, arrow-body-style
        return this.entries().map((e: any) => e.value);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/quotes, arrow-body-style
        const ss = this.entries().map((e: any) => '{' + e.key + ':' + e.value + '}');
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/quotes
        return '[' + ss.join(", ") + ']';
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get length() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, arrow-parens, arrow-body-style
        return Object.keys(this.data).filter(key => key.startsWith(HASH_KEY_PREFIX)).map(key => this.data[key].length, this).reduce((accum, item) => accum + item, 0);
    }
}
