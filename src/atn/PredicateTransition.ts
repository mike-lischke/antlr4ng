/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Predicate } from "../atn/Predicate.js";
import { AbstractPredicateTransition } from "../atn/AbstractPredicateTransition.js";
import { TransitionType } from "./TransitionType.js";

export class PredicateTransition extends AbstractPredicateTransition {
    isCtxDependent: any;
    isEpsilon: any;
    predIndex: any;
    ruleIndex: any;
    serializationType: any;
    constructor(target: any, ruleIndex: any, predIndex: any, isCtxDependent: any) {
        super(target);
        this.serializationType = TransitionType.PREDICATE;
        this.ruleIndex = ruleIndex;
        this.predIndex = predIndex;
        this.isCtxDependent = isCtxDependent; // e.g., $i ref in pred
        this.isEpsilon = true;
    }

    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return false;
    }

    getPredicate() {
        return new Predicate(this.ruleIndex, this.predIndex, this.isCtxDependent);
    }

    toString() {
        return "pred_" + this.ruleIndex + ":" + this.predIndex;
    }
}
