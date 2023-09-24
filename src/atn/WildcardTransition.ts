/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class WildcardTransition extends Transition {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    serializationType: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(target: any) {
        super(target);
        this.serializationType = TransitionType.WILDCARD;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return symbol >= minVocabSymbol && symbol <= maxVocabSymbol;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return ".";
    }
}
