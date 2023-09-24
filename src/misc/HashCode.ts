/* eslint-disable max-len, no-fallthrough */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { stringHashCode } from "../utils/stringHashCode.js";

export class HashCode {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    count: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    hash: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        this.count = 0;
        this.hash = 0;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    update() {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < arguments.length; i++) {
            // eslint-disable-next-line prefer-rest-params
            const value = arguments[i];
            if (value == null)
                // eslint-disable-next-line curly
                continue;
            if (Array.isArray(value))
                // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
                // eslint-disable-next-line curly, prefer-spread
                this.update.apply(this, value);
            else {
                let k = 0;
                switch (typeof (value)) {
                    // eslint-disable-next-line @typescript-eslint/quotes
                    case 'undefined':
                    // eslint-disable-next-line @typescript-eslint/quotes
                    case 'function':
                        continue;
                    // eslint-disable-next-line @typescript-eslint/quotes
                    case 'number':
                    // eslint-disable-next-line @typescript-eslint/quotes
                    case 'boolean':
                        // @ts-expect-error TS(2322): Type 'number | boolean' is not assignable to type ... Remove this comment to see the full error message
                        k = value;
                        break;
                    // eslint-disable-next-line @typescript-eslint/quotes
                    case 'string':
                        k = stringHashCode(value);
                        break;
                    default:
                        if (value.updateHashCode)
                            // eslint-disable-next-line curly, @typescript-eslint/no-unsafe-call
                            value.updateHashCode(this);
                        else
                            // eslint-disable-next-line curly, @typescript-eslint/no-unsafe-call
                            console.log("No updateHashCode for " + value.toString());
                        continue;
                }
                k = k * 0xCC9E2D51;
                k = (k << 15) | (k >>> (32 - 15));
                k = k * 0x1B873593;
                this.count = this.count + 1;
                let hash = this.hash ^ k;
                hash = (hash << 13) | (hash >>> (32 - 13));
                hash = hash * 5 + 0xE6546B64;
                this.hash = hash;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    finish() {
        let hash = this.hash ^ (this.count * 4);
        hash = hash ^ (hash >>> 16);
        hash = hash * 0x85EBCA6B;
        hash = hash ^ (hash >>> 13);
        hash = hash * 0xC2B2AE35;
        hash = hash ^ (hash >>> 16);
        // eslint-disable-next-line padding-line-between-statements
        return hash;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility
    static hashStuff() {
        const hash = new HashCode();
        // @ts-expect-error TS(2345): Argument of type 'IArguments' is not assignable to... Remove this comment to see the full error message
        // eslint-disable-next-line prefer-spread, prefer-rest-params
        hash.update.apply(hash, arguments);
        // eslint-disable-next-line padding-line-between-statements
        return hash.finish();
    }
}
