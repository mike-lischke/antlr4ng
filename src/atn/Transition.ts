/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import { ATNState } from "./ATNState.js";

/**
 * An ATN transition between any two ATN states.  Subclasses define
 * atom, set, epsilon, action, predicate, rule transitions.
 *
 * This is a one way link.  It emanates from a state (usually via a list of
 * transitions) and has a target state.
 *
 * Since we never have to change the ATN transitions once we construct it,
 * we can fix these transitions as specific classes. The DFA transitions
 * on the other hand need to update the labels as it adds transitions to
 * the states. We'll use the term Edge for the DFA to distinguish them from
 * ATN transitions.
 */
export abstract class Transition {
    public static readonly INVALID = 0;
    public static readonly EPSILON = 1;
    public static readonly RANGE = 2;
    public static readonly RULE = 3;
    public static readonly PREDICATE = 4; // e.g., {isType(input.LT(1))}
    public static readonly ATOM = 5;
    public static readonly ACTION = 6;
    public static readonly SET = 7; // ~(A|B) or ~atom, wildcard, which convert to next
    public static readonly NOT_SET = 8;
    public static readonly WILDCARD = 9;
    public static readonly PRECEDENCE = 10;

    /** The target of this transition. */
    public target: ATNState;

    public constructor(target: ATNState) {
        this.target = target;
    }

    /**
     * Determines if the transition is an "epsilon" transition.
     *
     * The default implementation returns `false`.
     *
     * @returns `true` if traversing this transition in the ATN does not
     * consume an input symbol; otherwise, `false` if traversing this
     * transition consumes (matches) an input symbol.
     */
    public get isEpsilon(): boolean {
        return false;
    }

    public get label(): IntervalSet | null {
        return null;
    }

    public toString(): string {
        return "";
    }

    public abstract get transitionType(): number;
    public abstract matches(symbol: number, minVocabSymbol: number, maxVocabSymbol: number): boolean;
}
