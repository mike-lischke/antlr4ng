/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { Transition } from "./Transition.js";

export declare class ActionTransition extends Transition {
    public ruleIndex: number;
    public actionIndex: number;
    public isCtxDependent: boolean;
    public isEpsilon: boolean;

    public constructor(target: ATNState, ruleIndex: number, actionIndex: number, isCtxDependent: boolean);

    public matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
    public toString(): string;
}
