/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class WildcardTransition extends Transition {
    public constructor(target: ATNState) {
        super(target);
    }

    public override get serializationType(): number {
        return TransitionType.WILDCARD;
    }

    public override matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean {
        return symbol >= minVocabSymbol && symbol <= maxVocabSymbol;
    }

    public override toString(): string {
        return ".";
    }
}
