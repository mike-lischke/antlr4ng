/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Transition } from "./Transition.js";
import { ATNState } from "./ATNState.js";

export class EpsilonTransition extends Transition {
    readonly #outermostPrecedenceReturn: number;

    public constructor(target: ATNState, outermostPrecedenceReturn = -1) {
        super(target);
        this.#outermostPrecedenceReturn = outermostPrecedenceReturn;
    }

    /**
     * @returns the rule index of a precedence rule for which this transition is
     * returning from, where the precedence value is 0; otherwise, -1.
     *
     * @see ATNConfig.isPrecedenceFilterSuppressed()
     * @see ParserATNSimulator.applyPrecedenceFilter(ATNConfigSet)
     * @since 4.4.1
     */
    public get outermostPrecedenceReturn(): number {
        return this.#outermostPrecedenceReturn;
    }

    public override get isEpsilon(): boolean {
        return true;
    }

    public get transitionType(): number {
        return Transition.EPSILON;
    }

    public override matches(): boolean {
        return false;
    }

    public override toString(): string {
        return "epsilon";
    }
}
