/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATN } from "./ATN.js";
import { Transition } from "./Transition.js";

import type { EpsilonTransition } from "./EpsilonTransition.js";
import type { BasicState } from "./BasicState.js";

/**
 * The following images show the relation of states and
 * {@link ATNState} for various grammar constructs.
 *
 * <ul>
 *
 * <li>Solid edges marked with an &//0949; indicate a required
 * {@link EpsilonTransition}.</li>
 *
 * <li>Dashed edges indicate locations where any transition derived from
 * {@link Transition} might appear.</li>
 *
 * <li>Dashed nodes are place holders for either a sequence of linked
 * {@link BasicState} states or the inclusion of a block representing a nested
 * construct in one of the forms below.</li>
 *
 * <li>Nodes showing multiple outgoing alternatives with a {@code ...} support
 * any number of alternatives (one or more). Nodes without the {@code ...} only
 * support the exact number of alternatives shown in the diagram.</li>
 *
 * </ul>
 *
 * <h2>Basic Blocks</h2>
 *
 * <h3>Rule</h3>
 *
 * <embed src="images/Rule.svg" type="image/svg+xml"/>
 *
 * <h3>Block of 1 or more alternatives</h3>
 *
 * <embed src="images/Block.svg" type="image/svg+xml"/>
 *
 * <h2>Greedy Loops</h2>
 *
 * <h3>Greedy Closure: {@code (...)*}</h3>
 *
 * <embed src="images/ClosureGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Greedy Positive Closure: {@code (...)+}</h3>
 *
 * <embed src="images/PositiveClosureGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Greedy Optional: {@code (...)?}</h3>
 *
 * <embed src="images/OptionalGreedy.svg" type="image/svg+xml"/>
 *
 * <h2>Non-Greedy Loops</h2>
 *
 * <h3>Non-Greedy Closure: {@code (...)*?}</h3>
 *
 * <embed src="images/ClosureNonGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Non-Greedy Positive Closure: {@code (...)+?}</h3>
 *
 * <embed src="images/PositiveClosureNonGreedy.svg" type="image/svg+xml"/>
 *
 * <h3>Non-Greedy Optional: {@code (...)??}</h3>
 *
 * <embed src="images/OptionalNonGreedy.svg" type="image/svg+xml"/>
 */
export declare class ATNState {
    /* eslint-disable @typescript-eslint/naming-convention */

    public static readonly INVALID_TYPE: number;
    public static readonly BASIC: number;
    public static readonly RULE_START: number;
    public static readonly BLOCK_START: number;
    public static readonly PLUS_BLOCK_START: number;
    public static readonly STAR_BLOCK_START: number;
    public static readonly TOKEN_START: number;
    public static readonly RULE_STOP: number;
    public static readonly BLOCK_END: number;
    public static readonly STAR_LOOP_BACK: number;
    public static readonly STAR_LOOP_ENTRY: number;
    public static readonly PLUS_LOOP_BACK: number;
    public static readonly LOOP_END: number;

    public static readonly INVALID_STATE_NUMBER: number;

    /* eslint-enable @typescript-eslint/naming-convention */

    public static readonly serializationNames: string[];

    public atn: ATN | null;
    public stateNumber: number;
    public stateType: number | null;
    public ruleIndex: number;
    public epsilonOnlyTransitions: boolean;
    public transitions: Transition[];

    public constructor();

    public toString(): string;
    public equals(other: unknown): boolean;
    public isNonGreedyExitState(): boolean;
    public addTransition(transition: Transition, index: number): void;
}
