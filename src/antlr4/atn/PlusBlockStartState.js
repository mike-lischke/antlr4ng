/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BlockStartState } from "./BlockStartState.js";
import { ATNState } from "./ATNState.js";

/**
 * Start of {@code (A|B|...)+} loop. Technically a decision state, but
 * we don't use for code generation; somebody might need it, so I'm defining
 * it for completeness. In reality, the {@link PlusLoopbackState} node is the
 * real decision-making note for {@code A+}
 */
export class PlusBlockStartState extends BlockStartState {
    constructor() {
        super();
        this.stateType = ATNState.PLUS_BLOCK_START;
        this.loopBackState = null;
        return this;
    }
}
