/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream } from "./CharStream.js";
import { CharStreams } from "./CharStreams.js";
import { Interval } from "./misc/Interval.js";

/**
 * @deprecated Use {@link CharStreams} instead.
 */
export declare class InputStream implements CharStream {
    public constructor(data: string);
    public constructor(data: string, decodeToUnicodeCodePoints: boolean);

    // XXX: the following methods are not implemented currently!
    public getText(interval: Interval): string;
    public getText(start: number, stop: number): string;

    public reset(): void;
    public toString(): string;

    public consume(): void;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public LA(i: number): number;

    public mark(): number;

    public release(marker: number): void;

    public get index(): number;

    public seek(index: number): void;

    public get size(): number;

    public getSourceName(): string;
}
