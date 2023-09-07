/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import IntervalSet from "../misc/IntervalSet.js";
import ATNState from "../state/ATNState.js";
import Transition from "./Transition.js";

export declare class SetTransition extends Transition {
    public set: IntervalSet;

    public constructor(target: ATNState, set: IntervalSet);

    public matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
    public toString(): string;
}

export default SetTransition;
