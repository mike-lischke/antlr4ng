/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { Transition } from "./Transition.js";
// eslint-disable-next-line @typescript-eslint/quotes
import { TransitionType } from './TransitionType.js';

export class RangeTransition extends Transition {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    label: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    serializationType: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    start: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    stop: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(target: any, start: any, stop: any) {
        super(target);
        this.serializationType = TransitionType.RANGE;
        this.start = start;
        this.stop = stop;
        this.label = this.makeLabel();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    makeLabel() {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const s = new IntervalSet();
        s.addRange(this.start, this.stop);
        // eslint-disable-next-line padding-line-between-statements
        return s;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return symbol >= this.start && symbol <= this.stop;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return "'" + String.fromCharCode(this.start) + "'..'" + String.fromCharCode(this.stop) + "'";
    }
}
