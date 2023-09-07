/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/** An immutable inclusive interval a..b */
export declare class Interval {
    public start: number;
    public stop: number;

    public constructor(start: number, stop: number);

    /**
     * Interval objects are used readonly so share all with the
     *  same single value a==b up to some max size. Use an array as a perfect hash.
     *  Return shared object for 0..INTERVAL_POOL_MAX_VALUE or a new
     *  Interval object with a..a in it.  On Java.g4, 218623 IntervalSets
     *  have a..a (set with 1 element).
     */
    public static of(a: number, b: number): Interval;

    public clone(): Interval;
    public contains(item: number): boolean;
    public equals(o: unknown): boolean;
    public hashCode(): number;

    /** Does this start completely before other? Disjoint */
    public startsBeforeDisjoint(other: Interval): boolean;

    /** Does this start at or before other? Nondisjoint */
    public startsBeforeNonDisjoint(other: Interval): boolean;

    /** Does this.start start after other.stop? May or may not be disjoint */
    public startsAfter(other: Interval): boolean;

    /** Does this start completely after other? Disjoint */
    public startsAfterDisjoint(other: Interval): boolean;

    /** Does this start after other? NonDisjoint */
    public startsAfterNonDisjoint(other: Interval): boolean;

    /** Are both ranges disjoint? I.e., no overlap? */
    public disjoint(other: Interval): boolean;

    /** Are two intervals adjacent such as 0..41 and 42..42? */
    public adjacent(other: Interval): boolean;

    public properlyContains(other: Interval): boolean;

    /** Return the interval computed from combining this and other */
    public union(other: Interval): Interval;

    /** Return the interval in common between this and o */
    public intersection(other: Interval): Interval;

    /**
     * Return the interval with elements from this not in other;
     *  other must not be totally enclosed (properly contained)
     *  within this, which would result in two disjoint intervals
     *  instead of the single one returned by this method.
     */
    public differenceNotProperlyContained(other: Interval): Interval;

    public length(): number;
    public toString(): string;
}

export default Interval;
