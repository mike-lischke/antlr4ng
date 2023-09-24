/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class ActionTransition extends Transition {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    actionIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    isCtxDependent: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    isEpsilon: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    ruleIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    serializationType: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(target: any, ruleIndex: any, actionIndex: any, isCtxDependent: any) {
        super(target);
        this.serializationType = TransitionType.ACTION;
        this.ruleIndex = ruleIndex;
        this.actionIndex = actionIndex === undefined ? -1 : actionIndex;
        this.isCtxDependent = isCtxDependent === undefined ? false : isCtxDependent; // e.g., $i ref in pred
        this.isEpsilon = true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return "action_" + this.ruleIndex + ":" + this.actionIndex;
    }
}
