/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { IComparable } from "../utils/helpers.js";
import { ATN } from "./ATN.js";
import { Transition } from "./Transition.js";

export class ATNState implements IComparable {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly INVALID_STATE_NUMBER = -1;

    public atn: ATN | null;
    public stateNumber: number;
    public ruleIndex: number;
    public epsilonOnlyTransitions: boolean;
    public nextTokenWithinRule: IntervalSet | null;
    public transitions: Transition[];

    public constructor() {
        // Which ATN are we in?
        this.atn = null;
        this.ruleIndex = 0; // at runtime, we don't have Rule objects
        this.epsilonOnlyTransitions = false;

        // Track the transitions emanating from this ATN state.
        this.transitions = [];

        // Used to cache lookahead during parsing, not used during construction
        this.nextTokenWithinRule = null;
    }

    public get stateType(): number {
        return ATNState.INVALID_STATE_NUMBER;
    }

    public toString(): string {
        return `${this.stateNumber}`;
    }

    public hashCode(): number {
        return this.stateNumber;
    }

    public equals(other: unknown): boolean {
        if (other instanceof ATNState) {
            return this.stateNumber === other.stateNumber;
        } else {
            return false;
        }
    }

    public isNonGreedyExitState(): boolean {
        return false;
    }

    public addTransition(trans: Transition, index?: number): void {
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
