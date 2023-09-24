/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class RuleTransition extends Transition {
    followState: any;
    isEpsilon: any;
    precedence: any;
    ruleIndex: any;
    serializationType: any;
    constructor(ruleStart: any, ruleIndex: any, precedence: any, followState: any) {
        super(ruleStart);
        // ptr to the rule definition object for this rule ref
        this.ruleIndex = ruleIndex;
        this.precedence = precedence;
        // what node to begin computations following ref to rule
        this.followState = followState;
        this.serializationType = TransitionType.RULE;
        this.isEpsilon = true;
    }

    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return false;
    }
}
