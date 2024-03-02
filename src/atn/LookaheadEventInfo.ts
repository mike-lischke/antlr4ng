/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionEventInfo } from "./DecisionEventInfo.js";

export interface LookaheadEventInfo extends DecisionEventInfo {
    /**
     * The alternative chosen by adaptivePredict(), not necessarily
     * the outermost alt shown for a rule; left-recursive rules have
     * user-level alts that differ from the rewritten rule with a (...) block
     * and a (..)* loop.
     */
    predictedAlt: number;
}
