/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { Transition } from "./Transition.js";

export class ActionTransition extends Transition {
    public ruleIndex: number;
    public actionIndex: number;
    public isCtxDependent: boolean;

    public constructor(target: ATNState, ruleIndex: number, actionIndex?: number, isCtxDependent?: boolean) {
        super(target);
        this.ruleIndex = ruleIndex;
        this.actionIndex = actionIndex ?? -1;
        this.isCtxDependent = isCtxDependent ?? false; // e.g., $i ref in pred
    }

    public override get isEpsilon(): boolean {
        return true;
    }

    public get transitionType(): number {
        return Transition.ACTION;
    }

    public matches(_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean {
        return false;
    }

    public override toString(): string {
        return "action_" + this.ruleIndex + ":" + this.actionIndex;
    }
}
