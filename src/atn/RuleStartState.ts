/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { RuleStopState } from "./RuleStopState.js";

export class RuleStartState extends ATNState {
    public static override readonly stateType = ATNState.RULE_START;

    public stopState?: RuleStopState;
    public isLeftRecursiveRule: boolean = false;
    public isPrecedenceRule: boolean = false;
}
