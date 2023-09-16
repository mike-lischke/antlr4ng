/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "./Transition.js";

export class EpsilonTransition extends Transition {
    constructor(target, outermostPrecedenceReturn) {
        super(target);
        this.serializationType = Transition.EPSILON;
        this.isEpsilon = true;
        this.outermostPrecedenceReturn = outermostPrecedenceReturn;
    }

    matches(symbol, minVocabSymbol, maxVocabSymbol) {
        return false;
    }

    toString() {
        return "epsilon";
    }
}
