/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from '../Token.js';
import { Interval } from "./Interval.js";
import { Lexer } from "../Lexer.js";
import { Vocabulary } from "../Vocabulary.js";

export class IntervalSet {
    // @ts-expect-error TS(2339): Property 'MIN_CHAR_VALUE' does not exist on type '... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention
    static COMPLETE_CHAR_SET = IntervalSet.of(Lexer.MIN_CHAR_VALUE, Lexer.MAX_CHAR_VALUE);
    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention
    static EMPTY_SET = new IntervalSet();

    static {
        // @ts-expect-error TS(2551): Property 'readonly' does not exist on type 'Interv... Remove this comment to see the full error message
        IntervalSet.COMPLETE_CHAR_SET.readonly = true;
        // @ts-expect-error TS(2551): Property 'readonly' does not exist on type 'Interv... Remove this comment to see the full error message
        IntervalSet.EMPTY_SET.readonly = true;
    }

    // @ts-expect-error TS(7006): Parameter 'set' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    constructor(set) {
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        this.intervals = [];
        // @ts-expect-error TS(2551): Property 'readOnly' does not exist on type 'Interv... Remove this comment to see the full error message
        this.readOnly = false;

        if (set) {
            this.addSet(set);
        }
    }

    // @ts-expect-error TS(7006): Parameter 'a' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    static of(a, b) {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const s = new IntervalSet();
        s.addRange(a, b);

        return s;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get minElement() {
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        if (this.intervals.length === 0) {
            // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Token.INVALID_TYPE;
        }

        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.intervals[0].start;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get maxElement() {
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        if (this.intervals.length === 0) {
            // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Token.INVALID_TYPE;
        }

        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.intervals[this.intervals.length - 1].stop;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get isNil() {
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        return this.intervals.length === 0;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    clear() {
        // @ts-expect-error TS(2551): Property 'readOnly' does not exist on type 'Interv... Remove this comment to see the full error message
        if (this.readOnly) {
            // @ts-expect-error TS(2304): Cannot find name 'IllegalStateException'.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        this.intervals = [];
    }

    // @ts-expect-error TS(7006): Parameter 'v' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    addOne(v) {
        this.addInterval(new Interval(v, v));
    }

    // @ts-expect-error TS(7006): Parameter 'l' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    addRange(l, h) {
        this.addInterval(new Interval(l, h));
    }

    // @ts-expect-error TS(7006): Parameter 'addition' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    addInterval(addition) {
        // @ts-expect-error TS(2551): Property 'readOnly' does not exist on type 'Interv... Remove this comment to see the full error message
        if (this.readOnly) {
            // @ts-expect-error TS(2304): Cannot find name 'IllegalStateException'.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        if (this.intervals.length === 0) {
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.intervals.push(addition);
        } else {
            // find insert pos
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            for (let pos = 0; pos < this.intervals.length; pos++) {
                // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                const existing = this.intervals[pos];

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (addition.equals(existing)) {
                    return;
                }

                // If both intervals are adjacent or overlap just at start or stop, merge them into a single interval.
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (addition.adjacent(existing) || !addition.disjoint(existing)) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    const bigger = addition.union(existing);
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    this.intervals[pos] = bigger;

                    // make sure we didn't just create an interval that
                    // should be merged with next interval in list
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    for (let sub = pos + 1; sub < this.intervals.length; /* don't increase sub here */) {
                        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                        const next = this.intervals[sub];

                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        if (!bigger.adjacent(next) && bigger.disjoint(next)) {
                            break;
                        }

                        // If we bump up against or overlap next, merge.
                        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        this.intervals.splice(sub, 1);
                        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        this.intervals[pos] = bigger.union(next);
                    }

                    return;
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (addition.startsBeforeDisjoint(existing)) {
                    // Insert before current position. There can't be any overlap with the previous interval,
                    // as we checked that iin the previous loop.
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this.intervals.splice(pos, 0, addition);

                    return;
                }
            }

            // Addition starts after last interval. Just add it.
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.intervals.push(addition);
        }
    }

    // @ts-expect-error TS(7006): Parameter 'other' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    addSet(other) {
        // @ts-expect-error TS(7006): Parameter 'toAdd' implicitly has an 'any' type.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, arrow-parens, arrow-body-style
        other.intervals.forEach(toAdd => this.addInterval(toAdd), this);

        return this;
    }

    // @ts-expect-error TS(7006): Parameter 'vocabularyOrMinElement' implicitly has ... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    complement(vocabularyOrMinElement, maxElement) {
        if (!vocabularyOrMinElement) {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            return new IntervalSet();
        }

        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const result = new IntervalSet();
        if (vocabularyOrMinElement instanceof IntervalSet) {
            if (vocabularyOrMinElement.isNil) {
                // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                return new IntervalSet(); // nothing in common with null set
            }

            result.addSet(vocabularyOrMinElement);
        } else {
            result.addInterval(new Interval(vocabularyOrMinElement, maxElement));
        }

        return result.subtract(this);
    }

    // @ts-expect-error TS(7006): Parameter 'sets' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    or(sets) {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const result = new IntervalSet();
        result.addSet(this);
        // @ts-expect-error TS(7006): Parameter 'set' implicitly has an 'any' type.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, arrow-parens, arrow-body-style
        sets.forEach(set => result.addSet(set), this);

        return result;
    }

    // @ts-expect-error TS(7006): Parameter 'other' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    and(other) {
        if (other.isNil) {
            // nothing in common with null set
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            return new IntervalSet();
        }

        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        // eslint-disable-next-line prefer-const
        let myIntervals = this.intervals;
        // eslint-disable-next-line prefer-const
        let theirIntervals = other.intervals;
        let intersection;
        // eslint-disable-next-line prefer-const
        let mySize = myIntervals.length;
        // eslint-disable-next-line prefer-const
        let theirSize = theirIntervals.length;
        let i = 0;
        let j = 0;

        // Iterate down both interval lists looking for non-disjoint intervals.
        while (i < mySize && j < theirSize) {
            // eslint-disable-next-line prefer-const
            let mine = myIntervals[i];
            // eslint-disable-next-line prefer-const
            let theirs = theirIntervals[j];

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (mine.startsBeforeDisjoint(theirs)) {
                // Move this iterator looking for interval that might overlap.
                i++;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            } else if (theirs.startsBeforeDisjoint(mine)) {
                // Move other iterator looking for interval that might overlap.
                j++;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            } else if (mine.properlyContains(theirs)) {
                // Overlap, add intersection, get next theirs.
                if (!intersection) {
                    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                    intersection = new IntervalSet();
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                intersection.addInterval(mine.intersection(theirs));
                j++;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            } else if (theirs.properlyContains(mine)) {
                // Overlap, add intersection, get next mine.
                if (!intersection) {
                    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                    intersection = new IntervalSet();
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                intersection.addInterval(mine.intersection(theirs));
                i++;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            } else if (!mine.disjoint(theirs)) {
                // Overlap, add intersection.
                if (!intersection) {
                    // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
                    intersection = new IntervalSet();
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                intersection.addInterval(mine.intersection(theirs));

                // Move the iterator of lower range [a..b], but not
                // the upper range as it may contain elements that will collide
                // with the next iterator. So, if mine=[0..115] and
                // theirs=[115..200], then intersection is 115 and move mine
                // but not theirs as theirs may collide with the next range
                // in thisIter.
                // move both iterators to next ranges
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (mine.startsAfterNonDisjoint(theirs)) {
                    j++;
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                else if (theirs.startsAfterNonDisjoint(mine)) {
                    i++;
                }
            }
        }

        if (!intersection) {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            return new IntervalSet();
        }

        return intersection;
    }

    // @ts-expect-error TS(7006): Parameter 'other' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    subtract(other) {
        if (this.isNil) {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            return new IntervalSet();
        }

        const result = new IntervalSet(this);
        if (other.isNil) {
            // Other set has no elements; just return the copy of the current set.
            return result;
        }

        let resultI = 0;
        let rightI = 0;
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        while (resultI < result.intervals.length && rightI < other.intervals.length) {
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
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
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    result.intervals[resultI] = beforeCurrent;
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    result.intervals.splice(resultI + 1, 0, afterCurrent);
                    resultI++;
                    rightI++;
                    continue;
                } else {
                    // replace the current interval
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    result.intervals[resultI] = beforeCurrent;
                    resultI++;
                    continue;
                }
            } else {
                if (afterCurrent != null) {
                    // replace the current interval
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    result.intervals[resultI] = afterCurrent;
                    rightI++;
                    continue;
                } else {
                    // remove the current interval (thus no need to increment resultI)
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

    // @ts-expect-error TS(7006): Parameter 'el' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    contains(el) {
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        if (this.intervals === null) {
            return false;
        } else {
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            const n = this.intervals.length;
            let l = 0;
            let r = n - 1;

            // Binary search for the element in the (sorted, disjoint) array of intervals.
            while (l <= r) {
                const m = Math.floor((l + r) / 2);
                // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
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
    }

    // @ts-expect-error TS(7006): Parameter 'toRemove' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    removeRange(toRemove) {
        // @ts-expect-error TS(2551): Property 'readOnly' does not exist on type 'Interv... Remove this comment to see the full error message
        if (this.readOnly) {
            // @ts-expect-error TS(2304): Cannot find name 'IllegalStateException'.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        if (toRemove.start === toRemove.stop) {
            this.removeOne(toRemove.start);
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        } else if (this.intervals !== null) {
            let pos = 0;
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let n = 0; n < this.intervals.length; n++) {
                // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                const existing = this.intervals[pos];
                // intervals are ordered
                if (toRemove.stop <= existing.start) {
                    return;
                }
                // check for including range, split it
                else if (toRemove.start > existing.start && toRemove.stop < existing.stop) {
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    this.intervals[pos] = new Interval(existing.start, toRemove.start);
                    const x = new Interval(toRemove.stop, existing.stop);
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this.intervals.splice(pos, 0, x);
                    // eslint-disable-next-line padding-line-between-statements
                    return;
                }
                // check for included range, remove it
                else if (toRemove.start <= existing.start && toRemove.stop >= existing.stop) {
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this.intervals.splice(pos, 1);
                    pos = pos - 1; // need another pass
                }
                // check for lower boundary
                else if (toRemove.start < existing.stop) {
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    this.intervals[pos] = new Interval(existing.start, toRemove.start);
                }
                // check for upper boundary
                else if (toRemove.stop < existing.stop) {
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    this.intervals[pos] = new Interval(toRemove.stop, existing.stop);
                }
                pos += 1;
            }
        }
    }

    // @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    removeOne(value) {
        // @ts-expect-error TS(2551): Property 'readOnly' does not exist on type 'Interv... Remove this comment to see the full error message
        if (this.readOnly) {
            // @ts-expect-error TS(2304): Cannot find name 'IllegalStateException'.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        if (this.intervals !== null) {
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            for (let i = 0; i < this.intervals.length; i++) {
                // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                const existing = this.intervals[i];
                // intervals are ordered
                if (value < existing.start) {
                    return;
                }
                // check for single value range
                else if (value === existing.start && value === existing.stop) {
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this.intervals.splice(i, 1);
                    // eslint-disable-next-line padding-line-between-statements
                    return;
                }
                // check for lower boundary
                else if (value === existing.start) {
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    this.intervals[i] = new Interval(existing.start + 1, existing.stop);
                    // eslint-disable-next-line padding-line-between-statements
                    return;
                }
                // check for upper boundary
                else if (value === existing.stop) {
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    this.intervals[i] = new Interval(existing.start, existing.stop);
                    // eslint-disable-next-line padding-line-between-statements
                    return;
                }
                // split existing range
                else if (value < existing.stop) {
                    const replace = new Interval(existing.start, value);
                    existing.start = value + 1;
                    // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this.intervals.splice(i, 0, replace);
                    // eslint-disable-next-line padding-line-between-statements
                    return;
                }
            }
        }
    }

    // @ts-expect-error TS(7006): Parameter 'elementsAreCharOrVocabulary' implicitly... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString(elementsAreCharOrVocabulary) {
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        if (this.intervals.length === 0) {
            return "{}";
        }

        let result = "";
        if (this.length > 1) {
            result += "{";
        }

        let elementsAreChar;
        let vocabulary;
        if (elementsAreCharOrVocabulary instanceof Vocabulary) {
            vocabulary = elementsAreCharOrVocabulary;
            elementsAreChar = false;
        } else {
            elementsAreChar = elementsAreCharOrVocabulary ?? false;
        }

        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        for (let i = 0; i < this.intervals.length; ++i) {
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            const interval = this.intervals[i];

            const start = interval.start;
            const stop = interval.stop;
            if (start === stop) {
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                // eslint-disable-next-line eqeqeq
                if (start == Token.EOF) {
                    result += "<EOF>";
                } else if (elementsAreChar) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    result += "'" + String.fromCodePoint(start) + "'";
                } else if (vocabulary) {
                    result += this.elementName(vocabulary, start);
                } else {
                    result += start;
                }
            } else {
                if (elementsAreChar) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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

            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            if (i < this.intervals.length - 1) {
                result += ", ";
            }
        }

        if (this.length > 1) {
            result += "}";
        }

        return result;
    }

    // @ts-expect-error TS(7006): Parameter 'vocabulary' implicitly has an 'any' typ... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    elementName(vocabulary, token) {
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (token === Token.EOF) {
            return "<EOF>";
        // @ts-expect-error TS(2339): Property 'EPSILON' does not exist on type 'typeof ... Remove this comment to see the full error message
        } else if (token === Token.EPSILON) {
            return "<EPSILON>";
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return vocabulary.getDisplayName(token);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toArray() {
        const data = [];
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        if (this.intervals !== null) {
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < this.intervals.length; i++) {
                // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
                const existing = this.intervals[i];
                for (let j = existing.start; j <= existing.stop; j++) {
                    data.push(j);
                }
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get length() {
        let result = 0;
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        // eslint-disable-next-line prefer-const
        let intervalCount = this.intervals.length;
        // eslint-disable-next-line eqeqeq
        if (intervalCount == 1) {
            // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
            const firstInterval = this.intervals[0];

            return firstInterval.stop - firstInterval.start + 1;
        }

        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        for (const interval of this.intervals) {
            result += interval.length;
        }

        return result;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    isReadonly() {
        // @ts-expect-error TS(2551): Property 'readOnly' does not exist on type 'Interv... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.readOnly;
    }

    // @ts-expect-error TS(7006): Parameter 'readonly' implicitly has an 'any' type.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    setReadonly(readonly) {
        // @ts-expect-error TS(2551): Property 'readOnly' does not exist on type 'Interv... Remove this comment to see the full error message
        if (this.readOnly && !readonly) {
            // @ts-expect-error TS(2304): Cannot find name 'IllegalStateException'.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        // @ts-expect-error TS(2551): Property 'readOnly' does not exist on type 'Interv... Remove this comment to see the full error message
        this.readOnly = readonly;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    [Symbol.iterator]() {
        // @ts-expect-error TS(2339): Property 'intervals' does not exist on type 'Inter... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return this.intervals[Symbol.iterator]();
    }
}
