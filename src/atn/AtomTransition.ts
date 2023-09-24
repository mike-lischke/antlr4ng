/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class AtomTransition extends Transition {
    label: any;
    label_: any;
    serializationType: any;
    constructor(target: any, label: any) {
        super(target);
        // The token type or character value; or, signifies special label.
        this.label_ = label;
        this.label = this.makeLabel();
        this.serializationType = TransitionType.ATOM;
    }

    makeLabel() {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const s = new IntervalSet();
        s.addOne(this.label_);
        return s;
    }

    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return this.label_ === symbol;
    }

    toString() {
        return this.label_;
    }
}
