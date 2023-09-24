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
 endState: any;
 constructor() {
     super();
     this.endState = null;
     return this;
 }
}
