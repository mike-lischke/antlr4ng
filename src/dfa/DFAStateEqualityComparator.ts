/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { EqualityComparator } from "../misc/EqualityComparator.js";
import { DFAState } from "./index.js";

/**
 * The comparator for DFA states.
 */
export class DFAStateEqualityComparator implements EqualityComparator<Partial<DFAState>> {
    public static readonly instance = new DFAStateEqualityComparator();

    public hashCode(state: Partial<DFAState>): number {
        return DFAState.hashCode(state);
    }

    public equals(a: Partial<DFAState>, b: Partial<DFAState>): boolean {
        return DFAState.equals(a, b);
    }

}
