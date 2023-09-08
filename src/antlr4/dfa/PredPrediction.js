/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * Map a predicate to a predicted alternative.
 */
export class PredPrediction {
    constructor(pred, alt) {
        this.alt = alt;
        this.pred = pred;
    }

    toString() {
        return "(" + this.pred + ", " + this.alt + ")";
    }
}
