/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { Transition } from "./Transition.js";
import { TransitionType } from './TransitionType.js';

export class RangeTransition extends Transition {
    label: any;
    serializationType: any;
    start: any;
    stop: any;
    constructor(target: any, start: any, stop: any) {
        super(target);
        this.serializationType = TransitionType.RANGE;
        this.start = start;
        this.stop = stop;
        this.label = this.makeLabel();
    }

    makeLabel() {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const s = new IntervalSet();
        s.addRange(this.start, this.stop);
        return s;
    }

    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return symbol >= this.start && symbol <= this.stop;
    }

    toString() {
        return "'" + String.fromCharCode(this.start) + "'..'" + String.fromCharCode(this.stop) + "'";
    }
}
