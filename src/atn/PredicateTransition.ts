/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SemanticContext } from "./SemanticContext.js";
import { AbstractPredicateTransition } from "./AbstractPredicateTransition.js";
import { TransitionType } from "./TransitionType.js";
import { ATNState } from "./ATNState.js";

export class PredicateTransition extends AbstractPredicateTransition {
    public readonly ruleIndex: number;
    public readonly predIndex: number;
    public readonly isCtxDependent: boolean;  // e.g., $i ref in pred

    public constructor(target: ATNState, ruleIndex: number, predIndex: number, isCtxDependent: boolean) {
        super(target);
        this.ruleIndex = ruleIndex;
        this.predIndex = predIndex;
        this.isCtxDependent = isCtxDependent; // e.g., $i ref in pred
    }

    public override get isEpsilon(): boolean {
        return true;
    }

    public matches(_symbol: number, _minVocabSymbol: number, _maxVocabSymbol: number): boolean {
        return false;
    }

    public get serializationType(): number {
        return TransitionType.PREDICATE;
    }

    public getPredicate(): SemanticContext.Predicate {
        return new SemanticContext.Predicate(this.ruleIndex, this.predIndex, this.isCtxDependent);
    }

    public override toString(): string {
        return "pred_" + this.ruleIndex + ":" + this.predIndex;
    }
}
