/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { ATNStateType } from "./ATNStateType.js";

export class RuleStartState extends ATNState {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    isPrecedenceRule: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        super();
        this.isPrecedenceRule = false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get stateType() {
        return ATNStateType.RULE_START;
    }
}
