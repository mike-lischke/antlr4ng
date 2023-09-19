/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { ATNState } from "../atn/ATNState.js";
import { TransitionType } from "./TransitionType.js";

export declare abstract class Transition {
    public isEpsilon: boolean;
    public target: ATNState;
    public label: IntervalSet | null;
    public serializationType: TransitionType;

    public constructor(target: ATNState);

    public abstract matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
}
