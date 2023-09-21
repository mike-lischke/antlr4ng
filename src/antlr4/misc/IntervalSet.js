/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from '../Token.js';
import { Interval } from "./Interval.js";
import { Lexer } from "../Lexer.js";
import { Vocabulary } from "../Vocabulary.js";

export class IntervalSet {
    static COMPLETE_CHAR_SET = IntervalSet.of(Lexer.MIN_CHAR_VALUE, Lexer.MAX_CHAR_VALUE);
    static EMPTY_SET = new IntervalSet();

    static {
        IntervalSet.COMPLETE_CHAR_SET.readonly = true;
        IntervalSet.EMPTY_SET.readonly = true;
    }

    constructor(set) {
        this.intervals = [];
        this.readOnly = false;

        if (set) {
            this.addSet(set);
        }
    }

    static of(a, b) {
        const s = new IntervalSet();
        s.addRange(a, b);

        return s;
    }

    get minElement() {
        if (this.intervals.length === 0) {
            return Token.INVALID_TYPE;
        }

        return this.intervals[0].start;
    }

    get maxElement() {
        if (this.intervals.length === 0) {
            return Token.INVALID_TYPE;
        }

        return this.intervals[this.intervals.length - 1].stop;
    }

    get isNil() {
        return this.intervals.length === 0;
    }

    clear() {
        if (this.readOnly) {
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        this.intervals = [];
    }

    addOne(v) {
        this.addInterval(new Interval(v, v));
    }

    addRange(l, h) {
        this.addInterval(new Interval(l, h));
    }

    addInterval(addition) {
        if (this.readOnly) {
            throw new IllegalStateException("can't alter readonly IntervalSet");
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

    addSet(other) {
        other.intervals.forEach(toAdd => this.addInterval(toAdd), this);

        return this;
    }

    complement(vocabularyOrMinElement, maxElement) {
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
            result.addInterval(new Interval(vocabularyOrMinElement, maxElement));
        }

        return result.subtract(this);
    }

    or(sets) {
        const result = new IntervalSet();
        result.addSet(this);
        sets.forEach(set => result.addSet(set), this);

        return result;
    }

    and(other) {
        if (other.isNil) {
            // nothing in common with null set
            return new IntervalSet();
        }

        let myIntervals = this.intervals;
        let theirIntervals = other.intervals;
        let intersection;
        let mySize = myIntervals.length;
        let theirSize = theirIntervals.length;
        let i = 0;
        let j = 0;

        // Iterate down both interval lists looking for non-disjoint intervals.
        while (i < mySize && j < theirSize) {
            let mine = myIntervals[i];
            let theirs = theirIntervals[j];

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

    subtract(other) {
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

    contains(el) {
        if (this.intervals === null) {
            return false;
        } else {
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
    }

    removeRange(toRemove) {
        if (this.readOnly) {
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        if (toRemove.start === toRemove.stop) {
            this.removeOne(toRemove.start);
        } else if (this.intervals !== null) {
            let pos = 0;
            for (let n = 0; n < this.intervals.length; n++) {
                const existing = this.intervals[pos];
                // intervals are ordered
                if (toRemove.stop <= existing.start) {
                    return;
                }
                // check for including range, split it
                else if (toRemove.start > existing.start && toRemove.stop < existing.stop) {
                    this.intervals[pos] = new Interval(existing.start, toRemove.start);
                    const x = new Interval(toRemove.stop, existing.stop);
                    this.intervals.splice(pos, 0, x);
                    return;
                }
                // check for included range, remove it
                else if (toRemove.start <= existing.start && toRemove.stop >= existing.stop) {
                    this.intervals.splice(pos, 1);
                    pos = pos - 1; // need another pass
                }
                // check for lower boundary
                else if (toRemove.start < existing.stop) {
                    this.intervals[pos] = new Interval(existing.start, toRemove.start);
                }
                // check for upper boundary
                else if (toRemove.stop < existing.stop) {
                    this.intervals[pos] = new Interval(toRemove.stop, existing.stop);
                }
                pos += 1;
            }
        }
    }

    removeOne(value) {
        if (this.readOnly) {
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        if (this.intervals !== null) {
            for (let i = 0; i < this.intervals.length; i++) {
                const existing = this.intervals[i];
                // intervals are ordered
                if (value < existing.start) {
                    return;
                }
                // check for single value range
                else if (value === existing.start && value === existing.stop) {
                    this.intervals.splice(i, 1);
                    return;
                }
                // check for lower boundary
                else if (value === existing.start) {
                    this.intervals[i] = new Interval(existing.start + 1, existing.stop);
                    return;
                }
                // check for upper boundary
                else if (value === existing.stop) {
                    this.intervals[i] = new Interval(existing.start, existing.stop);
                    return;
                }
                // split existing range
                else if (value < existing.stop) {
                    const replace = new Interval(existing.start, value);
                    existing.start = value + 1;
                    this.intervals.splice(i, 0, replace);
                    return;
                }
            }
        }
    }

    toString(elementsAreCharOrVocabulary) {
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

        for (let i = 0; i < this.intervals.length; ++i) {
            const interval = this.intervals[i];

            const start = interval.start;
            const stop = interval.stop;
            if (start === stop) {
                if (start == Token.EOF) {
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

    elementName(vocabulary, token) {
        if (token === Token.EOF) {
            return "<EOF>";
        } else if (token === Token.EPSILON) {
            return "<EPSILON>";
        } else {
            return vocabulary.getDisplayName(token);
        }
    }

    toArray() {
        const data = [];
        if (this.intervals !== null) {
            for (let i = 0; i < this.intervals.length; i++) {
                const existing = this.intervals[i];
                for (let j = existing.start; j <= existing.stop; j++) {
                    data.push(j);
                }
            }
        }

        return data;
    }

    get length() {
        let result = 0;
        let intervalCount = this.intervals.length;
        if (intervalCount == 1) {
            const firstInterval = this.intervals[0];

            return firstInterval.stop - firstInterval.start + 1;
        }

        for (const interval of this.intervals) {
            result += interval.length;
        }

        return result;
    }

    isReadonly() {
        return this.readOnly;
    }

    setReadonly(readonly) {
        if (this.readOnly && !readonly) {
            throw new IllegalStateException("can't alter readonly IntervalSet");
        }

        this.readOnly = readonly;
    }

    [Symbol.iterator]() {
        return this.intervals[Symbol.iterator]();
    }
}
