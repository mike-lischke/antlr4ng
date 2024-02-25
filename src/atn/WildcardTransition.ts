/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "./Transition.js";

export class WildcardTransition extends Transition {
    public override get transitionType(): number {
        return Transition.WILDCARD;
    }

    public override matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean {
        return symbol >= minVocabSymbol && symbol <= maxVocabSymbol;
    }

    public override toString(): string {
        return ".";
    }
}
