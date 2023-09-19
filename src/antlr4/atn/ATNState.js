/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ATNState {
    constructor() {
        // Which ATN are we in?
        this.atn = null;
        this.ruleIndex = 0; // at runtime, we don't have Rule objects
        this.epsilonOnlyTransitions = false;

        // Track the transitions emanating from this ATN state.
        this.transitions = [];

        // Used to cache lookahead during parsing, not used during construction
        this.nextTokenWithinRule = null;
    }

    get stateType() {
        return ATNState.INVALID_STATE_NUMBER;
    }

    toString() {
        return `${this.stateNumber}`;
    }

    equals(other) {
        if (other instanceof ATNState) {
            return this.stateNumber === other.stateNumber;
        } else {
            return false;
        }
    }

    isNonGreedyExitState() {
        return false;
    }

    addTransition(trans, index) {
        if (index === undefined) {
            index = -1;
        }
        if (this.transitions.length === 0) {
            this.epsilonOnlyTransitions = trans.isEpsilon;
        } else if (this.epsilonOnlyTransitions !== trans.isEpsilon) {
            this.epsilonOnlyTransitions = false;
        }
        if (index === -1) {
            this.transitions.push(trans);
        } else {
            this.transitions.splice(index, 1, trans);
        }
    }
}

ATNState.INVALID_STATE_NUMBER = -1;
