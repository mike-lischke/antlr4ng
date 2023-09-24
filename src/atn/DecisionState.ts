/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";

export class DecisionState extends ATNState {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    decision: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    nonGreedy: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        super();
        this.decision = -1;
        this.nonGreedy = false;
        // eslint-disable-next-line padding-line-between-statements
        return this;
    }
}
