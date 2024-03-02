/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./ATNState.js";
import { DecisionState } from "./DecisionState.js";
import { StarLoopbackState } from "./StarLoopbackState.js";

export class StarLoopEntryState extends DecisionState {
    public static override readonly stateType = ATNState.STAR_LOOP_ENTRY;

    // This is always set during ATN deserialization
    public loopBackState!: StarLoopbackState;

    /**
     * Indicates whether this state can benefit from a precedence DFA during SLL
     * decision making.
     *
     * This is a computed property that is calculated during ATN deserialization
     * and stored for use in {@link ParserATNSimulator} and
     * {@link ParserInterpreter}.
     *
     * @see `DFA.isPrecedenceDfa`
     */
    public precedenceRuleDecision: boolean = false;
}
