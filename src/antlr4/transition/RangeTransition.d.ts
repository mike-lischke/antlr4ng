/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import ATNState from "../state/ATNState.js";
import Transition from "./Transition.js";

export declare class RangeTransition extends Transition {
    public start: number;
    public stop: number;

    public constructor(target: ATNState, start: number, stop: number);

    public matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
    public toString(): string;
}

export default RangeTransition;
