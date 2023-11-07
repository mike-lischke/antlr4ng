/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, @typescript-eslint/naming-convention */

import { Token } from "./Token.js";
import { Interval } from "./misc/Interval.js";
import { IntStream } from "./IntStream.js";

/**
 * If decodeToUnicodeCodePoints is true, the input is treated
 * as a series of Unicode code points.
 *
 * Otherwise, the input is treated as a series of 16-bit UTF-16 code
 * units.
 */
// TODO: CharStream should be an interface, not a class.
export class CharStream implements IntStream {
    public name = "";
    public index = 0;

    private stringData: string;
    private data: number[];
    private decodeToUnicodeCodePoints: boolean;

    public constructor(data: string, decodeToUnicodeCodePoints = false) {
        this.stringData = data;
        this.decodeToUnicodeCodePoints = decodeToUnicodeCodePoints;

        this.data = [];
        if (this.decodeToUnicodeCodePoints) {
            for (let i = 0; i < this.stringData.length;) {
                const codePoint = this.stringData.codePointAt(i)!;
                this.data.push(codePoint);
                i += codePoint <= 0xFFFF ? 1 : 2;
            }
        } else {
            this.data = new Array(this.stringData.length);
            for (let i = 0; i < this.stringData.length; i++) {
                this.data[i] = this.stringData.charCodeAt(i);
            }
        }
    }

    /**
     * Reset the stream so that it's in the same state it was
     * when the object was created *except* the data array is not
     * touched.
     */
    public reset(): void {
        this.index = 0;
    }

    public consume(): void {
        if (this.index >= this.data.length) {
            throw new Error("cannot consume EOF");
        }
        this.index += 1;
    }

    public LA(offset: number): number {
        if (offset === 0) {
            return 0; // undefined
        }
        if (offset < 0) {
            offset += 1; // e.g., translate LA(-1) to use offset=0
        }
        const pos = this.index + offset - 1;
        if (pos < 0 || pos >= this.data.length) { // invalid
            return Token.EOF;
        }

        return this.data[pos];
    }

    // mark/release do nothing; we have entire buffer
    public mark(): number {
        return -1;
    }

    public release(_marker: number): void {
    }

    /**
     * consume() ahead until p==_index; can't just set p=_index as we must
     * update line and column. If we seek backwards, just set p
     */
    public seek(index: number): void {
        if (index <= this.index) {
            this.index = index; // just jump; don't update stream state (line,

            // ...)
            return;
        }
        // seek forward
        this.index = Math.min(index, this.data.length);
    }

    public getText(start: number, stop: number): string;
    public getText(interval: Interval): string;
    public getText(intervalOrStart: Interval | number, stop?: number): string {
        let begin;
        let end: number;
        if (intervalOrStart instanceof Interval) {
            begin = intervalOrStart.start;
            end = intervalOrStart.stop;
        } else {
            begin = intervalOrStart;
            end = stop ?? this.data.length - 1;
        }

        if (end >= this.data.length) {
            end = this.data.length - 1;
        }

        if (begin >= this.data.length) {
            return "";
        } else {
            if (this.decodeToUnicodeCodePoints) {
                let result = "";
                for (let i = begin; i <= end; i++) {
                    result += String.fromCodePoint(this.data[i]);
                }

                return result;
            } else {
                return this.stringData.slice(begin, end + 1);
            }
        }
    }

    public toString(): string {
        return this.stringData;
    }

    public get size(): number {
        return this.data.length;
    }

    public getSourceName(): string {
        if (this.name) {
            return this.name;
        } else {
            return IntStream.UNKNOWN_SOURCE_NAME;
        }
    }
}
