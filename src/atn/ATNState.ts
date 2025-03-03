/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { IComparable } from "../utils/helpers.js";
import { Transition } from "./Transition.js";

export class ATNState implements IComparable {
    public static readonly INVALID_STATE_NUMBER = -1;
    public static readonly INVALID_TYPE = 0;
    public static readonly BASIC = 1;
    public static readonly RULE_START = 2;
    public static readonly BLOCK_START = 3;
    public static readonly PLUS_BLOCK_START = 4;
    public static readonly STAR_BLOCK_START = 5;
    public static readonly TOKEN_START = 6;
    public static readonly RULE_STOP = 7;
    public static readonly BLOCK_END = 8;
    public static readonly STAR_LOOP_BACK = 9;
    public static readonly STAR_LOOP_ENTRY = 10;
    public static readonly PLUS_LOOP_BACK = 11;
    public static readonly LOOP_END = 12;

    public static readonly stateType: number = ATNState.INVALID_STATE_NUMBER;

    public stateNumber: number = 0;
    public ruleIndex: number = 0; // at runtime, we don't have Rule objects
    public epsilonOnlyTransitions: boolean = false;

    /** Used to cache lookahead during parsing, not used during construction */
    public nextTokenWithinRule?: IntervalSet;

    /** Track the transitions emanating from this ATN state. */
    public transitions: Transition[] = [];

    public hashCode(): number {
        return this.stateNumber;
    }

    public equals(other: ATNState): boolean {
        return this.stateNumber === other.stateNumber;
    }

    public toString(): string {
        return `${this.stateNumber}`;
    }

    public addTransitionAtIndex(index: number, transition: Transition): void {
        if (this.transitions.length === 0) {
            this.epsilonOnlyTransitions = transition.isEpsilon;
        } else if (this.epsilonOnlyTransitions !== transition.isEpsilon) {
            this.epsilonOnlyTransitions = false;
        }

        this.transitions.splice(index, 0, transition);
    }

    public addTransition(transition: Transition): void {
        if (this.transitions.length === 0) {
            this.epsilonOnlyTransitions = transition.isEpsilon;
        } else if (this.epsilonOnlyTransitions !== transition.isEpsilon) {
            this.epsilonOnlyTransitions = false;
        }

        this.transitions.push(transition);
    }

    public setTransition(i: number, e: Transition): void {
        this.transitions.splice(i, 1, e);
    }

    public removeTransition(index: number): Transition {
        const t = this.transitions.splice(index, 1);

        return t[0];
    }

}
