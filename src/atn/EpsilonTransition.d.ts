/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "../atn/ATNState.js";
import { Transition } from "./Transition.js";

export declare class EpsilonTransition extends Transition {
    public outermostPrecedenceReturn: number;

    public constructor(target: ATNState, outermostPrecedenceReturn: number);

    public matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
    public toString(): string;
}
