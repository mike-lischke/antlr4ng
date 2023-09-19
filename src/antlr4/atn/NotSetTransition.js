/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SetTransition } from "./SetTransition.js";
import { TransitionType } from "./TransitionType.js";

export class NotSetTransition extends SetTransition {
    constructor(target, set) {
        super(target, set);
        this.serializationType = TransitionType.NOT_SET;
    }

    matches(symbol, minVocabSymbol, maxVocabSymbol) {
        return symbol >= minVocabSymbol && symbol <= maxVocabSymbol &&
            !super.matches(symbol, minVocabSymbol, maxVocabSymbol);
    }

    toString() {
        return '~' + super.toString();
    }
}
