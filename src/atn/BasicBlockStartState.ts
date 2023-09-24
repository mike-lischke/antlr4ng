/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNStateType } from "./ATNStateType.js";
import { BlockStartState } from "./BlockStartState.js";

export class BasicBlockStartState extends BlockStartState {
    get stateType() {
        return ATNStateType.BLOCK_START;
    }

}
