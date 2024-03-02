/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { Transition } from "./Transition.js";
import { ATNState } from "./ATNState.js";

export class AtomTransition extends Transition {
    /** The token type or character value; or, signifies special label. */
    public labelValue: number;

    #label: IntervalSet;

    public constructor(target: ATNState, label: number) {
        super(target);
        this.labelValue = label;
        this.#label = IntervalSet.of(label, label);
    }

    public override get label(): IntervalSet {
        return this.#label;
    }

    public override get transitionType(): number {
        return Transition.ATOM;
    }

    public override matches(symbol: number): boolean {
        return this.labelValue === symbol;
    }

    public override toString(): string {
        return this.labelValue.toString();
    }
}
