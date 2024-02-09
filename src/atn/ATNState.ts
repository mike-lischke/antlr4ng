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
    public static readonly INVALID_STATE_NUMBER = -1;

    /** Which ATN are we in? */
    public atn: ATN | null = null;

    public stateNumber: number = 0;
    public ruleIndex: number = 0; // at runtime, we don't have Rule objects
    public epsilonOnlyTransitions: boolean = false;

    /** Used to cache lookahead during parsing, not used during construction */
    public nextTokenWithinRule: IntervalSet | null = null;

    /** Track the transitions emanating from this ATN state. */
    public transitions: Transition[] = [];

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

    public toString(): string {
        return `${this.stateNumber}`;
    }

    public addTransition(index: number, transition: Transition): void;
    public addTransition(transition: Transition): void;
    public addTransition(indexOrTransition: number | Transition, trans?: Transition): void {
        let transition: Transition;
        let index = -1;
        if (typeof indexOrTransition === "number") {
            index = indexOrTransition;
            transition = trans!;
        } else {
            transition = indexOrTransition;
        }

        if (this.transitions.length === 0) {
            this.epsilonOnlyTransitions = transition.isEpsilon;
        } else if (this.epsilonOnlyTransitions !== transition.isEpsilon) {
            this.epsilonOnlyTransitions = false;
        }

        if (index === -1) {
            this.transitions.push(transition);
        } else {
            this.transitions.splice(index, 1, transition);
        }
    }

    public get stateType(): number {
        return ATNState.INVALID_STATE_NUMBER;
    }

    public setTransition(i: number, e: Transition): void {
        this.transitions.splice(i, 1, e);
    }

    public removeTransition(index: number): Transition {
        const t = this.transitions.splice(index, 1);

        return t[0];
    }

}
