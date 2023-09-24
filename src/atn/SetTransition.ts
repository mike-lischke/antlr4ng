/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// A transition containing a set of values.
import { IntervalSet } from "../misc/IntervalSet.js";
import { Token } from '../Token.js';
import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class SetTransition extends Transition {
    label: any;
    serializationType: any;
    constructor(target: any, set: any) {
        super(target);
        this.serializationType = TransitionType.SET;
        if (set !== undefined && set !== null) {
            this.label = set;
        } else {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            this.label = new IntervalSet();
            // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
            this.label.addOne(Token.INVALID_TYPE);
        }
    }

    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return this.label.contains(symbol);
    }

    toString() {
        return this.label.toString();
    }
}
