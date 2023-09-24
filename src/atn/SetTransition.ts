/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// A transition containing a set of values.
import { IntervalSet } from "../misc/IntervalSet.js";
// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from '../Token.js';
import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class SetTransition extends Transition {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    label: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    serializationType: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(target: any, set: any) {
        super(target);
        this.serializationType = TransitionType.SET;
        if (set !== undefined && set !== null) {
            this.label = set;
        } else {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            this.label = new IntervalSet();
            // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.label.addOne(Token.INVALID_TYPE);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return this.label.contains(symbol);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return this.label.toString();
    }
}
