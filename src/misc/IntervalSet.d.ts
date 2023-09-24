/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Vocabulary } from "../Vocabulary.js";
import { Interval } from "./Interval.js";

export declare class IntervalSet {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly COMPLETE_CHAR_SET: IntervalSet;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EMPTY_SET: IntervalSet;

    public get isNil(): boolean;
    public get length(): number;

    public constructor(set?: IntervalSet);

    public static of(a: number, b: number): IntervalSet;

    public get minElement(): number;
    public get maxElement(): number;

    public addOne(v: number): void;
    public addRange(l: number, h: number): void;
    public addInterval(other: Interval): void;
    public addSet(other: IntervalSet): void;

    public complement(minElement: number, maxElement: number): IntervalSet;
    public complement(vocabulary: IntervalSet): IntervalSet;

    public or(sets: IntervalSet[]): IntervalSet;
    public and(other: IntervalSet): IntervalSet;
    public subtract(other: IntervalSet): IntervalSet;
    public contains(i: number): boolean;
    public removeRange(l: number, h: number): void;
    public removeOne(v: number): void;

    public toString(elementsAreChar?: boolean): string;
    public toString(vocabulary: Vocabulary): string;

    public elementName(literalNames?: Array<string | null>, symbolicNames?: string[], index?: number): string;
    public toArray(): number[];

    public isReadOnly(): boolean;
    public setReadonly(readonly: boolean): void;

    public [Symbol.iterator](): IterableIterator<Interval>;
}
