/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class ActionTransition extends Transition {
    actionIndex: any;
    isCtxDependent: any;
    isEpsilon: any;
    ruleIndex: any;
    serializationType: any;
    constructor(target: any, ruleIndex: any, actionIndex: any, isCtxDependent: any) {
        super(target);
        this.serializationType = TransitionType.ACTION;
        this.ruleIndex = ruleIndex;
        this.actionIndex = actionIndex === undefined ? -1 : actionIndex;
        this.isCtxDependent = isCtxDependent === undefined ? false : isCtxDependent; // e.g., $i ref in pred
        this.isEpsilon = true;
    }

    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return false;
    }

    toString() {
        return "action_" + this.ruleIndex + ":" + this.actionIndex;
    }
}