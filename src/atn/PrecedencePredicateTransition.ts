/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PrecedencePredicate } from "../atn/PrecedencePredicate.js";
import { AbstractPredicateTransition } from "../atn/AbstractPredicateTransition.js";
import { TransitionType } from "./TransitionType.js";

export class PrecedencePredicateTransition extends AbstractPredicateTransition {
    isEpsilon: any;
    precedence: any;
    serializationType: any;
    constructor(target: any, precedence: any) {
        super(target);
        this.serializationType = TransitionType.PRECEDENCE;
        this.precedence = precedence;
        this.isEpsilon = true;
    }

    matches(symbol: any, minVocabSymbol: any, maxVocabSymbol: any) {
        return false;
    }

    getPredicate() {
        return new PrecedencePredicate(this.precedence);
    }

    toString() {
        return this.precedence + " >= _p";
    }
}
