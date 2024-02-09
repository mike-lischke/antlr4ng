/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { ATNState } from "./ATNState.js";
import { AtomTransition } from "./AtomTransition.js";
import { RangeTransition } from "./RangeTransition.js";
import type { Transition } from "./Transition.js";

/* eslint-disable jsdoc/require-param */

/**
 * Utility class to create {@link AtomTransition}, {@link RangeTransition},
 * and {@link SetTransition} appropriately based on the range of the input.
 *
 * Previously, we distinguished between atom and range transitions for
 * Unicode code points <= U+FFFF and those above. We used a set
 * transition for a Unicode code point > U+FFFF. Now that we can serialize
 * 32-bit int/chars in the ATN serialization, this is no longer necessary.
 */
export abstract class CodePointTransitions {
    /** @returns new {@link AtomTransition}     */
    public static createWithCodePoint(target: ATNState, codePoint: number): Transition {
        return CodePointTransitions.createWithCodePointRange(target, codePoint, codePoint);
    }

    /** @returns new {@link AtomTransition} if range represents one atom else {@link SetTransition}. */
    public static createWithCodePointRange(target: ATNState, codePointFrom: number, codePointTo: number): Transition {
        return codePointFrom === codePointTo
            ? new AtomTransition(target, codePointFrom)
            : new RangeTransition(target, codePointFrom, codePointTo);
    }
}
