/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { ATNStateType } from "./ATNStateType.js";
import { BlockStartState } from "./BlockStartState.js";

/**
 * Terminal node of a simple {@code (a|b|c)} block
 */
export class BlockEndState extends ATNState {
    public startState: BlockStartState | null = null;

    public override get stateType(): number {
        return ATNStateType.BLOCK_END;
    }

}
