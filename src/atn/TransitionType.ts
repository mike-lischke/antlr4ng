/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export const TransitionType = {
    // constants for serialization
    // eslint-disable-next-line @typescript-eslint/naming-convention
    EPSILON: 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RANGE: 2,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    RULE: 3,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PREDICATE: 4, // e.g., {isType(input.LT(1))}?
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ATOM: 5,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ACTION: 6,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SET: 7, // ~(A|B) or ~atom, wildcard, which convert to next 2
    // eslint-disable-next-line @typescript-eslint/naming-convention
    NOT_SET: 8,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    WILDCARD: 9,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PRECEDENCE: 10,
};
