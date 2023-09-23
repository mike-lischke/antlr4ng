/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

// Not using an enum here, as this creates trouble with isolated modules.
/** constants for serialization */
export declare class TransitionType {
    public static readonly EPSILON: number;
    public static readonly RANGE: number;
    public static readonly RULE: number;
    public static readonly PREDICATE: number; // e.g., {isType(input.LT(1))}?
    public static readonly ATOM: number;
    public static readonly ACTION: number;
    public static readonly SET: number; // ~(A|B) or ~atom, wildcard, which convert to next 2
    public static readonly NOT_SET: number;
    public static readonly WILDCARD: number;
    public static readonly PRECEDENCE: number;
}
