/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { Transition } from "./Transition.js";
import { TransitionType } from "./TransitionType.js";

export class RuleTransition extends Transition {
    public ruleIndex: number;
    public precedence: number;
    public followState: ATNState;

    public constructor(ruleStart: ATNState, ruleIndex: number, precedence: number, followState: ATNState) {
        super(ruleStart);
        // ptr to the rule definition object for this rule ref
        this.ruleIndex = ruleIndex;
        this.precedence = precedence;
        // what node to begin computations following ref to rule
        this.followState = followState;
    }

    public override get isEpsilon(): boolean {
        return true;
    }

    public override get serializationType(): number {
        return TransitionType.RULE;
    }

    public override matches(_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean {
        return false;
    }
}
