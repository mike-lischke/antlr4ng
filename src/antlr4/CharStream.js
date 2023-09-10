/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from './Token.js';

/**
 * If decodeToUnicodeCodePoints is true, the input is treated
 * as a series of Unicode code points.
 *
 * Otherwise, the input is treated as a series of 16-bit UTF-16 code
 * units.
 */
export class CharStream {
    constructor(data, decodeToUnicodeCodePoints) {
        this.name = "";
        this.stringData = data;
        this.decodeToUnicodeCodePoints = decodeToUnicodeCodePoints ?? false;

        this._index = 0;
        this.data = [];
        if (this.decodeToUnicodeCodePoints) {
            for (let i = 0; i < this.stringData.length;) {
                const codePoint = this.stringData.codePointAt(i);
                this.data.push(codePoint);
                i += codePoint <= 0xFFFF ? 1 : 2;
            }
        } else {
            this.data = new Array(this.stringData.length);
            for (let i = 0; i < this.stringData.length; i++) {
                this.data[i] = this.stringData.charCodeAt(i);
            }
        }
        this._size = this.data.length;
    }

    /**
     * Reset the stream so that it's in the same state it was
     * when the object was created *except* the data array is not
     * touched.
     */
    reset() {
        this._index = 0;
    }

    consume() {
        if (this._index >= this._size) {
            // assert this.LA(1) == Token.EOF
            throw ("cannot consume EOF");
        }
        this._index += 1;
    }

    LA(offset) {
        if (offset === 0) {
            return 0; // undefined
        }
        if (offset < 0) {
            offset += 1; // e.g., translate LA(-1) to use offset=0
        }
        const pos = this._index + offset - 1;
        if (pos < 0 || pos >= this._size) { // invalid
            return Token.EOF;
        }
        return this.data[pos];
    }

    // mark/release do nothing; we have entire buffer
    mark() {
        return -1;
    }

    release(marker) {
    }

    /**
     * consume() ahead until p==_index; can't just set p=_index as we must
     * update line and column. If we seek backwards, just set p
     */
    seek(_index) {
        if (_index <= this._index) {
            this._index = _index; // just jump; don't update stream state (line,
            // ...)
            return;
        }
        // seek forward
        this._index = Math.min(_index, this._size);
    }

    getText(interval) {
        return this.getText(interval.start, interval.stop);
    }

    getText(start, stop) {
        if (stop >= this._size) {
            stop = this._size - 1;
        }
        if (start >= this._size) {
            return "";
        } else {
            if (this.decodeToUnicodeCodePoints) {
                let result = "";
                for (let i = start; i <= stop; i++) {
                    result += String.fromCodePoint(this.data[i]);
                }
                return result;
            } else {
                return this.stringData.slice(start, stop + 1);
            }
        }
    }

    toString() {
        return this.stringData;
    }

    get index() {
        return this._index;
    }

    get size() {
        return this._size;
    }

    getSourceName() {
        if (this.name) {
            return this.name;
        } else {
            return IntStream.UNKNOWN_SOURCE_NAME;
        }
    }
}
