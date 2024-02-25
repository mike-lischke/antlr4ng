/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { BlockStartState } from "./BlockStartState.js";

/**
 * The block that begins a closure loop
 */
export class StarBlockStartState extends BlockStartState {
    public static override readonly stateType = ATNState.STAR_BLOCK_START;
}
