/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { SemanticContext } from "../atn/SemanticContext.js";

/** Map a predicate to a predicted alternative. */
export interface PredPrediction {
    pred: SemanticContext; // never null; at least SemanticContext.NONE
    alt: number;
};

export namespace PredPrediction {
    export const toString = (prediction: PredPrediction): string => {
        return `(${prediction.pred}, ${prediction.alt})`;
    };
}
