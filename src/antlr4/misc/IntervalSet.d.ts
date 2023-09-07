/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import Interval from "./Interval.js";

export declare class IntervalSet {
    public isNil: boolean;
    public minElement: number;
    public maxElement: number;
    public intervals: Interval[];

    public get length(): number;

    public constructor(intervals?: Interval[]);

    public static of(a: number, b: number): IntervalSet;

    public first(v: number): number;
    public addOne(v: number): void;
    public addRange(l: number, h: number): void;
    public addInterval(other: Interval): void;
    public addSet(other: IntervalSet): void;
    public reduce(pos: number): void;
    public complement(start: number, stop: number): IntervalSet;
    public contains(i: number): boolean;
    public removeRange(l: number, h: number): void;
    public removeOne(v: number): void;
    public toString(literalNames?: Array<string | null>, symbolicNames?: string[], elemsAreChar?: boolean): string;
    public toCharString(): string;
    public toIndexString(): string;
    public toTokenString(literalNames?: Array<string | null>, symbolicNames?: string[]): string;
    public elementName(literalNames?: Array<string | null>, symbolicNames?: string[], index?: number): string;
    public toArray(): number[];
}

export default IntervalSet;
