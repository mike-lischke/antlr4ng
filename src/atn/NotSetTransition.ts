/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SetTransition } from "./SetTransition.js";
import { Transition } from "./Transition.js";

export class NotSetTransition extends SetTransition {
    public override get transitionType(): number {
        return Transition.NOT_SET;
    }

    public override matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean {
        return symbol >= minVocabSymbol && symbol <= maxVocabSymbol &&
            !super.matches(symbol, minVocabSymbol, maxVocabSymbol);
    }

    public override toString(): string {
        return "~" + super.toString();
    }
}
