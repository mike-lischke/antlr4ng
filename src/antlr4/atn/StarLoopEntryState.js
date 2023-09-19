/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionState } from "./DecisionState.js";
import { ATNStateType } from "./ATNStateType.js";

export class StarLoopEntryState extends DecisionState {
    constructor() {
        super();
        this.precedenceRuleDecision = false;
    }

    get stateType() {
        return ATNStateType.STAR_LOOP_ENTRY;
    }

}
