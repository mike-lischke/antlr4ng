/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export declare class CharStream {
    public index: number; // defined as property
    public size: number;// defined as property

    public constructor(data: string);
    public constructor(data: string, decodeToUnicodeCodePoints: boolean);
    public reset(): void;
    public consume(): void;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LA(offset: number): number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LT(offset: number): number;
    public mark(): number;
    public release(marker: number): void;
    public seek(index: number): void;
    public getText(start: number, stop: number): string;
    public toString(): string;
}

export default CharStream;
