/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import ATNState from "../state/ATNState.js";
import IntervalSet from "../misc/IntervalSet.js";
import SetTransition from "./SetTransition.js";

export declare class NotSetTransition extends SetTransition {
    public constructor(target: ATNState, set: IntervalSet);

    public matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
    public toString(): string;
}
