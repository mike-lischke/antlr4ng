/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// The documentation was taken from the Java implementation of the class, and is rather simple.
/* eslint-disable jsdoc/require-returns, jsdoc/require-param-description, jsdoc/require-param */

/** An immutable inclusive interval a..b */
export class Interval {
    public static INVALID_INTERVAL = new Interval(-1, -2);
    public static INTERVAL_POOL_MAX_VALUE = 1000;

    private static cache: Interval[] = [];

    public readonly start: number;
    public readonly stop: number;

    private cachedHashCode: number;

    public constructor(start: number, stop: number) {
        if (start <= stop) {
            this.start = start;
            this.stop = stop;
        } else {
            this.start = stop;
            this.stop = start;
        }

        this.cachedHashCode = Math.imul(651 + start, 31) + stop;
    }

    /**
     * Creates a new interval from the given values.
     *
     * Interval objects are used readonly so share all with the
     * same single value a==b up to some max size. Use an array as a perfect hash.
     * Return shared object for 0..INTERVAL_POOL_MAX_VALUE or a new
     * Interval object with a..a in it.  On Java.g4, 218623 IntervalSets
     * have a..a (set with 1 element).
     *
     * @param a The start of the interval.
     * @param b The end of the interval (inclusive).
     *
     * @returns A cached or new interval.
     */
    public static of(a: number, b: number): Interval {
        // cache just a..a
        if (a !== b || a < 0 || a > Interval.INTERVAL_POOL_MAX_VALUE) {
            return new Interval(a, b);
        }

        if (!Interval.cache[a]) {
            Interval.cache[a] = new Interval(a, a);
        }

        return Interval.cache[a];
    }

    public equals(o: Interval): boolean {
        return this.start === o.start && this.stop === o.stop;
    }

    public hashCode(): number {
        return this.cachedHashCode;
    }

    /** Does this start completely before other? Disjoint */
    public startsBeforeDisjoint(other: Interval): boolean {
        return this.start < other.start && this.stop < other.start;
    }

    /** Does this start at or before other? Nondisjoint */
    public startsBeforeNonDisjoint(other: Interval): boolean {
        return this.start <= other.start && this.stop >= other.start;
    }

    /** Does this.start start after other.stop? May or may not be disjoint */
    public startsAfter(other: Interval): boolean {
        return this.start > other.start;
    }

    /** Does this start completely after other? Disjoint */
    public startsAfterDisjoint(other: Interval): boolean {
        return this.start > other.stop;
    }

    /** Does this start after other? NonDisjoint */
    public startsAfterNonDisjoint(other: Interval): boolean {
        return this.start > other.start && this.start <= other.stop; // this.stop >= other.stop implied
    }

    /** Are both ranges disjoint? I.e., no overlap? */
    public disjoint(other: Interval): boolean {
        return this.startsBeforeDisjoint(other) || this.startsAfterDisjoint(other);
    }

    /** Are two intervals adjacent such as 0..41 and 42..42? */
    public adjacent(other: Interval): boolean {
        return this.start === other.stop + 1 || this.stop === other.start - 1;
    }

    public properlyContains(other: Interval): boolean {
        return other.start >= this.start && other.stop <= this.stop;
    }

    /** Return the interval computed from combining this and other */
    public union(other: Interval): Interval {
        return Interval.of(Math.min(this.start, other.start), Math.max(this.stop, other.stop));
    }

    /** Return the interval in common between this and o */
    public intersection(other: Interval): Interval {
        return Interval.of(Math.max(this.start, other.start), Math.min(this.stop, other.stop));
    }

    /**
     * Return the interval with elements from this not in other;
     *  other must not be totally enclosed (properly contained)
     *  within this, which would result in two disjoint intervals
     *  instead of the single one returned by this method.
     */
    public differenceNotProperlyContained(other: Interval): Interval | null {
        let diff = null;

        if (other.startsBeforeNonDisjoint(this)) {
            // other.start to left of this.start (or same)
            diff = Interval.of(Math.max(this.start, other.stop + 1), this.stop);
        } else if (other.startsAfterNonDisjoint(this)) {
            // other.start to right of this.start
            diff = Interval.of(this.start, other.start - 1);
        }

        return diff;
    }

    public toString(): string {
        if (this.start === this.stop) {
            return this.start.toString();
        } else {
            return this.start.toString() + ".." + this.stop.toString();
        }
    }

    public get length(): number {
        if (this.stop < this.start) {
            return 0;
        }

        return this.stop - this.start + 1;
    }
}
