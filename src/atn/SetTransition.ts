/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { Token } from "../Token.js";
import { ATNState } from "./ATNState.js";
import { Transition } from "./Transition.js";

/** A transition containing a set of values. */
export class SetTransition extends Transition {
    public set: IntervalSet;

    public constructor(target: ATNState, set: IntervalSet) {
        super(target);
        if (set) {
            this.set = set;
        } else {
            this.set = IntervalSet.of(Token.INVALID_TYPE, Token.INVALID_TYPE);
        }
    }

    public get transitionType(): number {
        return Transition.SET;
    }

    public override get label(): IntervalSet {
        return this.set;
    }

    public override matches(symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean {
        return this.set.contains(symbol);
    }

    public override toString(): string {
        return this.set.toString();
    }
}
