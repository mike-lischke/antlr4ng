/*
* Copyright (c) The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/

/* eslint-disable jsdoc/require-returns , jsdoc/require-param */

import { Token } from "../Token.js";
import { Interval } from "./Interval.js";
import { Lexer } from "../Lexer.js";
import { Vocabulary } from "../Vocabulary.js";

/**
 * This class implements the `IntSet` backed by a sorted array of
 * non-overlapping intervals. It is particularly efficient for representing
 * large collections of numbers, where the majority of elements appear as part
 * of a sequential range of numbers that are all part of the set. For example,
 * the set { 1, 2, 3, 4, 7, 8 } may be represented as { [1, 4], [7, 8] }.
 *
 * This class is able to represent sets containing any combination of values in
 * the range {@link Integer#MIN_VALUE} to {@link Integer#MAX_VALUE}
 * (inclusive).
 */
export class IntervalSet {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static COMPLETE_CHAR_SET = IntervalSet.of(Lexer.MIN_CHAR_VALUE, Lexer.MAX_CHAR_VALUE);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static EMPTY_SET = new IntervalSet();

    /** The list of sorted, disjoint intervals. */
    private intervals: Interval[] = [];
    private readOnly: boolean = false;

    static {
        IntervalSet.COMPLETE_CHAR_SET.readOnly = true;
        IntervalSet.EMPTY_SET.readOnly = true;
    }

    public constructor(set?: IntervalSet) {
        if (set) {
            this.addSet(set);
        }
    }

    /** Create a set with all ints within range [a..b] (inclusive) */
    public static of(a: number, b: number): IntervalSet {
        const s = new IntervalSet();
        s.addRange(a, b);

        return s;
    }

    public [Symbol.iterator](): IterableIterator<Interval> {
        return this.intervals[Symbol.iterator]();
    }

    /**
     * Returns the minimum value contained in the set if not isNil().
     *
     * @returns the minimum value contained in the set.
     */
    public get minElement(): number {
        if (this.intervals.length === 0) {
            return Token.INVALID_TYPE;
        }

        return this.intervals[0].start;
    }

    /**
     * Returns the maximum value contained in the set if not isNil().
     *
     * @returns the maximum value contained in the set.
     */
    public get maxElement(): number {
        if (this.intervals.length === 0) {
            return Token.INVALID_TYPE;
        }

        return this.intervals[this.intervals.length - 1].stop;
    }

    public get isNil(): boolean {
        return this.intervals.length === 0;
    }

    public clear(): void {
        if (this.readOnly) {
            throw new Error("can't alter readonly IntervalSet");
        }

        this.intervals = [];
    }

    /**
     * Add a single element to the set.  An isolated element is stored
     *  as a range el..el.
     */
    public addOne(v: number): void {
        this.addInterval(new Interval(v, v));
    }

    /**
     * Add interval; i.e., add all integers from a to b to set.
     *  If b < a, do nothing.
     *  Keep list in sorted order (by left range value).
     *  If overlap, combine ranges. For example,
     *  If this is {1..5, 10..20}, adding 6..7 yields
     *  {1..5, 6..7, 10..20}. Adding 4..8 yields {1..8, 10..20}.
     */
    public addRange(l: number, h: number): void {
        this.addInterval(new Interval(l, h));
    }

    public addInterval(addition: Interval): void {
        if (this.readOnly) {
            throw new Error("can't alter readonly IntervalSet");
        }

        if (this.intervals.length === 0) {
            this.intervals.push(addition);
        } else {
            // find insert pos
            for (let pos = 0; pos < this.intervals.length; pos++) {
                const existing = this.intervals[pos];

                if (addition.equals(existing)) {
                    return;
                }

                // If both intervals are adjacent or overlap just at start or stop, merge them into a single interval.
                if (addition.adjacent(existing) || !addition.disjoint(existing)) {
                    const bigger = addition.union(existing);
                    this.intervals[pos] = bigger;

                    // make sure we didn't just create an interval that
                    // should be merged with next interval in list
                    for (let sub = pos + 1; sub < this.intervals.length; /* don't increase sub here */) {
                        const next = this.intervals[sub];

                        if (!bigger.adjacent(next) && bigger.disjoint(next)) {
                            break;
                        }

                        // If we bump up against or overlap next, merge.
                        this.intervals.splice(sub, 1);
                        this.intervals[pos] = bigger.union(next);
                    }

                    return;
                }

                if (addition.startsBeforeDisjoint(existing)) {
                    // Insert before current position. There can't be any overlap with the previous interval,
                    // as we checked that iin the previous loop.
                    this.intervals.splice(pos, 0, addition);

                    return;
                }
            }

            // Addition starts after last interval. Just add it.
            this.intervals.push(addition);
        }
    }

    public addSet(other: IntervalSet): this {
        other.intervals.forEach((toAdd) => { return this.addInterval(toAdd); }, this);

        return this;
    }

    public complement(vocabulary?: IntervalSet): IntervalSet;
    public complement(minElement: number, maxElement: number): IntervalSet;
    public complement(vocabularyOrMinElement?: IntervalSet | number, maxElement?: number): IntervalSet {
        if (!vocabularyOrMinElement) {
            return new IntervalSet();
        }

        const result = new IntervalSet();
        if (vocabularyOrMinElement instanceof IntervalSet) {
            if (vocabularyOrMinElement.isNil) {
                return new IntervalSet(); // nothing in common with null set
            }

            result.addSet(vocabularyOrMinElement);
        } else {
            result.addInterval(new Interval(vocabularyOrMinElement, maxElement ?? 0));
        }

        return result.subtract(this);
    }

    /** combine all sets in the array returned the or'd value */
    public or(sets: IntervalSet[]): IntervalSet {
        const result = new IntervalSet();
        result.addSet(this);
        sets.forEach((set) => {
            return result.addSet(set);
        });

        return result;
    }

    public and(other: IntervalSet): IntervalSet {
        if (other.isNil) {
            // nothing in common with null set
            return new IntervalSet();
        }

        const myIntervals = this.intervals;
        const theirIntervals = other.intervals;
        let intersection;
        const mySize = myIntervals.length;
        const theirSize = theirIntervals.length;
        let i = 0;
        let j = 0;

        // Iterate down both interval lists looking for non-disjoint intervals.
        while (i < mySize && j < theirSize) {
            const mine = myIntervals[i];
            const theirs = theirIntervals[j];

            if (mine.startsBeforeDisjoint(theirs)) {
                // Move this iterator looking for interval that might overlap.
                i++;
            } else if (theirs.startsBeforeDisjoint(mine)) {
                // Move other iterator looking for interval that might overlap.
                j++;
            } else if (mine.properlyContains(theirs)) {
                // Overlap, add intersection, get next theirs.
                if (!intersection) {
                    intersection = new IntervalSet();
                }

                intersection.addInterval(mine.intersection(theirs));
                j++;
            } else if (theirs.properlyContains(mine)) {
                // Overlap, add intersection, get next mine.
                if (!intersection) {
                    intersection = new IntervalSet();
                }

                intersection.addInterval(mine.intersection(theirs));
                i++;
            } else if (!mine.disjoint(theirs)) {
                // Overlap, add intersection.
                if (!intersection) {
                    intersection = new IntervalSet();
                }

                intersection.addInterval(mine.intersection(theirs));

                // Move the iterator of lower range [a..b], but not
                // the upper range as it may contain elements that will collide
                // with the next iterator. So, if mine=[0..115] and
                // theirs=[115..200], then intersection is 115 and move mine
                // but not theirs as theirs may collide with the next range
                // in thisIter.
                // move both iterators to next ranges
                if (mine.startsAfterNonDisjoint(theirs)) {
                    j++;
                }
                else if (theirs.startsAfterNonDisjoint(mine)) {
                    i++;
                }
            }
        }

        if (!intersection) {
            return new IntervalSet();
        }

        return intersection;
    }

    /**
     * Compute the set difference between two interval sets. The specific
     * operation is {@code left - right}. If either of the input sets is
     * {@code null}, it is treated as though it was an empty set.
     */
    public subtract(other: IntervalSet): IntervalSet {
        if (this.isNil) {
            return new IntervalSet();
        }

        const result = new IntervalSet(this);
        if (other.isNil) {
            // Other set has no elements; just return the copy of the current set.
            return result;
        }

        let resultI = 0;
        let rightI = 0;
        while (resultI < result.intervals.length && rightI < other.intervals.length) {
            const resultInterval = result.intervals[resultI];
            const rightInterval = other.intervals[rightI];

            // operation: (resultInterval - rightInterval) and update indexes

            if (rightInterval.stop < resultInterval.start) {
                rightI++;
                continue;
            }

            if (rightInterval.start > resultInterval.stop) {
                resultI++;
                continue;
            }

            let beforeCurrent = null;
            let afterCurrent = null;
            if (rightInterval.start > resultInterval.start) {
                beforeCurrent = new Interval(resultInterval.start, rightInterval.start - 1);
            }

            if (rightInterval.stop < resultInterval.stop) {
                afterCurrent = new Interval(rightInterval.stop + 1, resultInterval.stop);
            }

            if (beforeCurrent != null) {
                if (afterCurrent != null) {
                    // split the current interval into two
                    result.intervals[resultI] = beforeCurrent;
                    result.intervals.splice(resultI + 1, 0, afterCurrent);
                    resultI++;
                    rightI++;
                    continue;
                } else {
                    // replace the current interval
                    result.intervals[resultI] = beforeCurrent;
                    resultI++;
                    continue;
                }
            } else {
                if (afterCurrent != null) {
                    // replace the current interval
                    result.intervals[resultI] = afterCurrent;
                    rightI++;
                    continue;
                } else {
                    // remove the current interval (thus no need to increment resultI)
                    result.intervals.splice(resultI, 1);
                    continue;
                }
            }
        }

        // If rightI reached right.intervals.size(), no more intervals to subtract from result.
        // If resultI reached result.intervals.size(), we would be subtracting from an empty set.
        // Either way, we are done.
        return result;
    }

    public contains(el: number): boolean {
        const n = this.intervals.length;
        let l = 0;
        let r = n - 1;

        // Binary search for the element in the (sorted, disjoint) array of intervals.
        while (l <= r) {
            const m = Math.floor((l + r) / 2);
            const interval = this.intervals[m];
            if (interval.stop < el) {
                l = m + 1;
            } else if (interval.start > el) {
                r = m - 1;
            } else {
                return true;
            }
        }

        return false;
    }

    public removeRange(toRemove: Interval): void {
        if (this.readOnly) {
            throw new Error("can't alter readonly IntervalSet");
        }

        if (toRemove.start === toRemove.stop) {
            this.removeOne(toRemove.start);
        } else if (this.intervals !== null) {
            let pos = 0;
            for (const existing of this.intervals) {
                // intervals are ordered
                if (toRemove.stop <= existing.start) {
                    return;
                } else if (toRemove.start > existing.start && toRemove.stop < existing.stop) {
                    // check for including range, split it
                    this.intervals[pos] = new Interval(existing.start, toRemove.start);
                    const x = new Interval(toRemove.stop, existing.stop);
                    this.intervals.splice(pos, 0, x);

                    return;
                } else if (toRemove.start <= existing.start && toRemove.stop >= existing.stop) {
                    // check for included range, remove it
                    this.intervals.splice(pos, 1);
                    pos = pos - 1; // need another pass
                } else if (toRemove.start < existing.stop) {
                    // check for lower boundary
                    this.intervals[pos] = new Interval(existing.start, toRemove.start);
                } else if (toRemove.stop < existing.stop) {
                    // check for upper boundary
                    this.intervals[pos] = new Interval(toRemove.stop, existing.stop);
                }

                pos += 1;
            }
        }
    }

    public removeOne(value: number): void {
        if (this.readOnly) {
            throw new Error("can't alter readonly IntervalSet");
        }

        for (let i = 0; i < this.intervals.length; i++) {
            const existing = this.intervals[i];
            // intervals are ordered
            if (value < existing.start) {
                return;
            } else if (value === existing.start && value === existing.stop) {
                // check for single value range
                this.intervals.splice(i, 1);

                return;
            } else if (value === existing.start) {
                // check for lower boundary
                this.intervals[i] = new Interval(existing.start + 1, existing.stop);

                return;
            } else if (value === existing.stop) {
                // check for upper boundary
                this.intervals[i] = new Interval(existing.start, existing.stop);

                return;
            } else if (value < existing.stop) {
                // split existing range
                const replace = new Interval(existing.start, value);
                this.intervals[i] = new Interval(value + 1, existing.stop);
                this.intervals.splice(i, 0, replace);

                return;
            }
        }
    }

    public toString(elementsAreChar?: boolean): string;
    public toString(vocabulary: Vocabulary): string;
    public toString(elementsAreCharOrVocabulary?: boolean | Vocabulary): string {
        if (this.intervals.length === 0) {
            return "{}";
        }

        let result = "";
        if (this.length > 1) {
            result += "{";
        }

        let elementsAreChar = false;
        let vocabulary;
        if (elementsAreCharOrVocabulary instanceof Vocabulary) {
            vocabulary = elementsAreCharOrVocabulary;
        } else if (Array.isArray(elementsAreCharOrVocabulary)) {
            vocabulary = Vocabulary.fromTokenNames(elementsAreCharOrVocabulary);
        } else {
            elementsAreChar = elementsAreCharOrVocabulary ?? false;
        }

        for (let i = 0; i < this.intervals.length; ++i) {
            const interval = this.intervals[i];

            const start = interval.start;
            const stop = interval.stop;
            if (start === stop) {
                if (start === Token.EOF) {
                    result += "<EOF>";
                } else if (elementsAreChar) {
                    result += "'" + String.fromCodePoint(start) + "'";
                } else if (vocabulary) {
                    result += this.elementName(vocabulary, start);
                } else {
                    result += start;
                }
            } else {
                if (elementsAreChar) {
                    result += "'" + String.fromCodePoint(start) + "'..'" + String.fromCodePoint(stop) + "'";
                } else if (vocabulary) {
                    for (let i = start; i <= stop; ++i) {
                        if (i > start) {
                            result += ", ";
                        }

                        result += this.elementName(vocabulary, i);
                    }

                } else {
                    result += start + ".." + stop;
                }
            }

            if (i < this.intervals.length - 1) {
                result += ", ";
            }
        }

        if (this.length > 1) {
            result += "}";
        }

        return result;
    }

    public toArray(): number[] {
        const data = [];
        for (const interval of this.intervals) {
            for (let j = interval.start; j <= interval.stop; j++) {
                data.push(j);
            }
        }

        return data;
    }

    public get length(): number {
        let result = 0;
        const intervalCount = this.intervals.length;
        if (intervalCount === 1) {
            const firstInterval = this.intervals[0];

            return firstInterval.stop - firstInterval.start + 1;
        }

        for (const interval of this.intervals) {
            result += interval.length;
        }

        return result;
    }

    public isReadonly(): boolean {
        return this.readOnly;
    }

    public setReadonly(readonly: boolean): void {
        if (this.readOnly && !readonly) {
            throw new Error("can't alter readonly IntervalSet");
        }

        this.readOnly = readonly;
    }

    protected elementName(vocabulary: Vocabulary, token: number): string | null {
        if (token === Token.EOF) {
            return "<EOF>";
        } else if (token === Token.EPSILON) {
            return "<EPSILON>";
        } else {
            return vocabulary.getDisplayName(token);
        }
    }

}
