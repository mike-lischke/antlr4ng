/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionState } from "./DecisionState.js";

/**
 *  The start of a regular {@code (...)} block
 */
export class BlockStartState extends DecisionState {
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
 endState: any;
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
 constructor() {
     super();
     this.endState = null;
     // eslint-disable-next-line padding-line-between-statements
     return this;
 }
}
