/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ATNState {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    atn: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    epsilonOnlyTransitions: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    nextTokenWithinRule: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    ruleIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    stateNumber: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    transitions: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get stateType() {
        // @ts-expect-error TS(2339): Property 'INVALID_STATE_NUMBER' does not exist on ... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return ATNState.INVALID_STATE_NUMBER;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return `${this.stateNumber}`;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        if (other instanceof ATNState) {
            return this.stateNumber === other.stateNumber;
        } else {
            return false;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    isNonGreedyExitState() {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addTransition(trans: any, index: any) {
        if (index === undefined) {
            index = -1;
        }
        if (this.transitions.length === 0) {
            this.epsilonOnlyTransitions = trans.isEpsilon;
        } else if (this.epsilonOnlyTransitions !== trans.isEpsilon) {
            this.epsilonOnlyTransitions = false;
        }
        if (index === -1) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.transitions.push(trans);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.transitions.splice(index, 1, trans);
        }
    }
}

// @ts-expect-error TS(2339): Property 'INVALID_STATE_NUMBER' does not exist on ... Remove this comment to see the full error message
ATNState.INVALID_STATE_NUMBER = -1;
