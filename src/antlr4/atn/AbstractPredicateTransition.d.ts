/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import ATNState from "../state/ATNState.js";
import Transition from "../transition/Transition.js";

export declare class AbstractPredicateTransition extends Transition {
    public constructor(target: ATNState);
}

export default AbstractPredicateTransition;
