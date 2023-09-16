/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { AbstractPredicateTransition } from "../atn/AbstractPredicateTransition.js";
import { Predicate } from "../atn/Predicate.js";
import { ATNState } from "../atn/ATNState.js";

export declare class PredicateTransition extends AbstractPredicateTransition {
    public ruleIndex: number;
    public predIndex: number;
    public isCtxDependent: boolean;
    public isEpsilon: boolean;

    public constructor(target: ATNState, ruleIndex: number, predIndex: number, isCtxDependent: boolean);

    public matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
    public getPredicate(): Predicate;
    public toString(): string;
}
