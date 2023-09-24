/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class Interval {
    start: any;
    stop: any;
    constructor(start: any, stop: any) {
        this.start = start;
        this.stop = stop;
    }

    static of(a: any, b: any) {
        // cache just a..a
        // @ts-expect-error TS(2339): Property 'INTERVAL_POOL_MAX_VALUE' does not exist ... Remove this comment to see the full error message
        if (a != b || a < 0 || a > Interval.INTERVAL_POOL_MAX_VALUE) {
            return new Interval(a, b);
        }

        // @ts-expect-error TS(2339): Property 'cache' does not exist on type 'typeof In... Remove this comment to see the full error message
        if (Interval.cache[a] === null) {
            // @ts-expect-error TS(2339): Property 'cache' does not exist on type 'typeof In... Remove this comment to see the full error message
            Interval.cache[a] = new Interval(a, a);
        }

        // @ts-expect-error TS(2339): Property 'cache' does not exist on type 'typeof In... Remove this comment to see the full error message
        return Interval.cache[a];
    }

    equals(o: any) {
        if (!(o instanceof Interval)) {
            return false;
        }

        return this.start === o.start && this.stop === o.stop;
    }

    hashCode() {
        let hash = 23;
        hash = hash * 31 + this.start;
        hash = hash * 31 + this.stop;

        return hash;
    }

    startsBeforeDisjoint(other: any) {
        return this.start < other.start && this.stop < other.start;
    }

    startsBeforeNonDisjoint(other: any) {
        return this.start <= other.start && this.stop >= other.start;
    }

    startsAfter(other: any) { return this.start > other.start; }

    startsAfterDisjoint(other: any) {
        return this.start > other.stop;
    }

    startsAfterNonDisjoint(other: any) {
        return this.start > other.start && this.start <= other.stop; // this.stop>=other.stop implied
    }

    disjoint(other: any) {
        return this.startsBeforeDisjoint(other) || this.startsAfterDisjoint(other);
    }

    adjacent(other: any) {
        return this.start === other.stop + 1 || this.stop === other.start - 1;
    }

    properlyContains(other: any) {
        return other.start >= this.start && other.stop <= this.stop;
    }

    union(other: any) {
        return Interval.of(Math.min(this.start, other.start), Math.max(this.stop, other.stop));
    }

    intersection(other: any) {
        return Interval.of(Math.max(this.start, other.start), Math.min(this.stop, other.stop));
    }

    differenceNotProperlyContained(other: any) {
        let diff = null;

        // other.start to left of this.start (or same)
        if (other.startsBeforeNonDisjoint(this)) {
            diff = Interval.of(Math.max(this.start, other.stop + 1),
                this.stop);
        }

        // other.start to right of this.start
        else if (other.startsAfterNonDisjoint(this)) {
            diff = Interval.of(this.start, other.start - 1);
        }

        return diff;
    }

    toString() {
        if (this.start === this.stop) {
            return this.start.toString();
        } else {
            return this.start.toString() + ".." + this.stop.toString();
        }
    }

    get length() {
        if (this.stop < this.start) {
            return 0;
        }

        return this.stop - this.start + 1;
    }
}

// @ts-expect-error TS(2339): Property 'INVALID_INTERVAL' does not exist on type... Remove this comment to see the full error message
Interval.INVALID_INTERVAL = new Interval(-1, -2);
// @ts-expect-error TS(2339): Property 'INTERVAL_POOL_MAX_VALUE' does not exist ... Remove this comment to see the full error message
Interval.INTERVAL_POOL_MAX_VALUE = 1000;
// @ts-expect-error TS(2339): Property 'cache' does not exist on type 'typeof In... Remove this comment to see the full error message
Interval.cache = new Array(Interval.INTERVAL_POOL_MAX_VALUE + 1);
// @ts-expect-error TS(2339): Property 'cache' does not exist on type 'typeof In... Remove this comment to see the full error message
Interval.cache.fill(null);
