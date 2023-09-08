/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { AbstractPredicateTransition } from "../atn/AbstractPredicateTransition.js";
import { PrecedencePredicate } from "../atn/PrecedencePredicate.js";
import { ATNState } from "../state/ATNState.js";

export declare class PrecedencePredicateTransition extends AbstractPredicateTransition {
    public precedence: number;

    public constructor(target: ATNState, precedence: number);

    public matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
    public getPredicate(): PrecedencePredicate;
    public toString(): string;
}
