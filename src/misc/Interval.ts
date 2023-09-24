/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class Interval {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    start: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    stop: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(start: any, stop: any) {
        this.start = start;
        this.stop = stop;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    static of(a: any, b: any) {
        // cache just a..a
        // @ts-expect-error TS(2339): Property 'INTERVAL_POOL_MAX_VALUE' does not exist ... Remove this comment to see the full error message
        // eslint-disable-next-line eqeqeq
        if (a != b || a < 0 || a > Interval.INTERVAL_POOL_MAX_VALUE) {
            return new Interval(a, b);
        }

        // @ts-expect-error TS(2339): Property 'cache' does not exist on type 'typeof In... Remove this comment to see the full error message
        if (Interval.cache[a] === null) {
            // @ts-expect-error TS(2339): Property 'cache' does not exist on type 'typeof In... Remove this comment to see the full error message
            Interval.cache[a] = new Interval(a, a);
        }

        // @ts-expect-error TS(2339): Property 'cache' does not exist on type 'typeof In... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Interval.cache[a];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(o: any) {
        if (!(o instanceof Interval)) {
            return false;
        }

        return this.start === o.start && this.stop === o.stop;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    hashCode() {
        let hash = 23;
        hash = hash * 31 + this.start;
        hash = hash * 31 + this.stop;

        return hash;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    startsBeforeDisjoint(other: any) {
        return this.start < other.start && this.stop < other.start;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    startsBeforeNonDisjoint(other: any) {
        return this.start <= other.start && this.stop >= other.start;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    startsAfter(other: any) { return this.start > other.start; }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    startsAfterDisjoint(other: any) {
        return this.start > other.stop;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    startsAfterNonDisjoint(other: any) {
        return this.start > other.start && this.start <= other.stop; // this.stop>=other.stop implied
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    disjoint(other: any) {
        return this.startsBeforeDisjoint(other) || this.startsAfterDisjoint(other);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    adjacent(other: any) {
        return this.start === other.stop + 1 || this.stop === other.start - 1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    properlyContains(other: any) {
        return other.start >= this.start && other.stop <= this.stop;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    union(other: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
        return Interval.of(Math.min(this.start, other.start), Math.max(this.stop, other.stop));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    intersection(other: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
        return Interval.of(Math.max(this.start, other.start), Math.min(this.stop, other.stop));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    differenceNotProperlyContained(other: any) {
        let diff = null;

        // other.start to left of this.start (or same)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (other.startsBeforeNonDisjoint(this)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            diff = Interval.of(Math.max(this.start, other.stop + 1),
                this.stop);
        }

        // other.start to right of this.start
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        else if (other.startsAfterNonDisjoint(this)) {
            diff = Interval.of(this.start, other.start - 1);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return diff;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        if (this.start === this.stop) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return this.start.toString();
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            return this.start.toString() + ".." + this.stop.toString();
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
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
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
Interval.cache.fill(null);
