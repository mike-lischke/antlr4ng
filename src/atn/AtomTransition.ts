/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class AtomTransition extends Transition {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    label: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    label_: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    serializationType: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(target: any, label: any) {
        super(target);
        // The token type or character value; or, signifies special label.
        // eslint-disable-next-line no-underscore-dangle
        this.label_ = label;
        this.label = this.makeLabel();
        this.serializationType = TransitionType.ATOM;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    makeLabel() {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const s = new IntervalSet();
        // eslint-disable-next-line no-underscore-dangle
        s.addOne(this.label_);
        // eslint-disable-next-line padding-line-between-statements
        return s;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        // eslint-disable-next-line no-underscore-dangle
        return this.label_ === symbol;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this.label_;
    }
}
