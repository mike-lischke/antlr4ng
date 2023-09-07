/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntervalSet } from "../misc/IntervalSet.js";
import ATNState from "../state/ATNState.js";

export declare interface ITransitionSerializationTypes {
    /* eslint-disable @typescript-eslint/naming-convention */

    EpsilonTransition: number;
    RangeTransition: number;
    RuleTransition: number;
    PredicateTransition: number;
    AtomTransition: number;
    ActionTransition: number;
    SetTransition: number;
    NotSetTransition: number;
    WildcardTransition: number;
    PrecedencePredicateTransition: number;

    /* eslint-enable @typescript-eslint/naming-convention */
}

export declare class Transition {
    /* eslint-disable @typescript-eslint/naming-convention */

    public static EPSILON: number;
    public static RANGE: number;
    public static RULE: number;
    public static PREDICATE: number;
    public static ATOM: number;
    public static ACTION: number;
    public static SET: number;
    public static NOT_SET: number;
    public static WILDCARD: number;
    public static PRECEDENCE: number;

    /* eslint-enable @typescript-eslint/naming-convention */

    public static serializationNames: string[];
    public static serializationTypes: ITransitionSerializationTypes;
    public static serializationType: number;

    public isEpsilon: boolean;
    public target: ATNState;
    public label: IntervalSet | null;
    public serializationType: number;

    public constructor(target: ATNState);
}

export default Transition;
