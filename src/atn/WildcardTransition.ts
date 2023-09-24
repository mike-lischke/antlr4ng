/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class WildcardTransition extends Transition {
    serializationType: any;
    constructor(target: any) {
        super(target);
        this.serializationType = TransitionType.WILDCARD;
    }

    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return symbol >= minVocabSymbol && symbol <= maxVocabSymbol;
    }

    toString() {
        return ".";
    }
}
