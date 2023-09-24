/* eslint-disable jsdoc/require-param, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from './Token.js';
import { Interval } from "./misc/Interval.js";
import { IntStream } from "./IntStream.js";

/**
 * If decodeToUnicodeCodePoints is true, the input is treated
 * as a series of Unicode code points.
 *
 * Otherwise, the input is treated as a series of 16-bit UTF-16 code
 * units.
 */
export class CharStream {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _index: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _size: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    data: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    decodeToUnicodeCodePoints: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    name: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    stringData: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(data: any, decodeToUnicodeCodePoints: any) {
        this.name = "";
        this.stringData = data;
        this.decodeToUnicodeCodePoints = decodeToUnicodeCodePoints ?? false;

        // eslint-disable-next-line no-underscore-dangle
        this._index = 0;
        this.data = [];
        if (this.decodeToUnicodeCodePoints) {
            for (let i = 0; i < this.stringData.length;) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const codePoint = this.stringData.codePointAt(i);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                this.data.push(codePoint);
                i += codePoint <= 0xFFFF ? 1 : 2;
            }
        } else {
            this.data = new Array(this.stringData.length);
            for (let i = 0; i < this.stringData.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                this.data[i] = this.stringData.charCodeAt(i);
            }
        }
        // eslint-disable-next-line no-underscore-dangle
        this._size = this.data.length;
    }

    /**
     * Reset the stream so that it's in the same state it was
     * when the object was created *except* the data array is not
     * touched.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    reset() {
        // eslint-disable-next-line no-underscore-dangle
        this._index = 0;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    consume() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._index >= this._size) {
            // assert this.LA(1) == Token.EOF
            // eslint-disable-next-line no-throw-literal
            throw ("cannot consume EOF");
        }
        // eslint-disable-next-line no-underscore-dangle
        this._index += 1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    LA(offset: any) {
        if (offset === 0) {
            return 0; // undefined
        }
        if (offset < 0) {
            offset += 1; // e.g., translate LA(-1) to use offset=0
        }
        // eslint-disable-next-line no-underscore-dangle
        const pos = this._index + offset - 1;
        // eslint-disable-next-line no-underscore-dangle
        if (pos < 0 || pos >= this._size) { // invalid
            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Token.EOF;
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return this.data[pos];
    }

    // mark/release do nothing; we have entire buffer
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    mark() {
        return -1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    release(marker: any) {
    }

    /**
     * consume() ahead until p==_index; can't just set p=_index as we must
     * update line and column. If we seek backwards, just set p
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    seek(_index: any) {
        // eslint-disable-next-line no-underscore-dangle
        if (_index <= this._index) {
            // eslint-disable-next-line no-underscore-dangle
            this._index = _index; // just jump; don't update stream state (line,
            // ...)
            // eslint-disable-next-line padding-line-between-statements
            return;
        }
        // seek forward
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-argument
        this._index = Math.min(_index, this._size);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getText(intervalOrStart: any, stop: any) {
        let start;
        if (intervalOrStart instanceof Interval) {
            start = intervalOrStart.start;
            stop = intervalOrStart.stop;
        } else {
            start = intervalOrStart;
        }

        // eslint-disable-next-line no-underscore-dangle
        if (stop >= this._size) {
            // eslint-disable-next-line no-underscore-dangle
            stop = this._size - 1;
        }
        // eslint-disable-next-line no-underscore-dangle
        if (start >= this._size) {
            return "";
        } else {
            if (this.decodeToUnicodeCodePoints) {
                let result = "";
                for (let i = start; i <= stop; i++) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    result += String.fromCodePoint(this.data[i]);
                }
                // eslint-disable-next-line padding-line-between-statements
                return result;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
                return this.stringData.slice(start, stop + 1);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.stringData;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get index() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._index;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get size() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._size;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getSourceName() {
        if (this.name) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.name;
        } else {
            // @ts-expect-error TS(2339): Property 'UNKNOWN_SOURCE_NAME' does not exist on t... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return IntStream.UNKNOWN_SOURCE_NAME;
        }
    }
}
