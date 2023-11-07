/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { ATNState } from "./ATNState.js";
import { SetTransition } from "./SetTransition.js";
import { TransitionType } from "./TransitionType.js";

export class NotSetTransition extends SetTransition {
    public constructor(target: ATNState, set: IntervalSet) {
        super(target, set);
    }

    public override get serializationType(): number {
        return TransitionType.NOT_SET;
    }

    public override matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean {
        return symbol >= minVocabSymbol && symbol <= maxVocabSymbol &&
            !super.matches(symbol, minVocabSymbol, maxVocabSymbol);
    }

    public override toString(): string {
        return "~" + super.toString();
    }
}
