/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { EmptyPredictionContext } from "./EmptyPredictionContext.js";
import { PredictionContext } from "./PredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";

export const createSingletonPredictionContext = (parent: PredictionContext | undefined,
    returnState: number): SingletonPredictionContext => {
    if (returnState === PredictionContext.EMPTY_RETURN_STATE && parent === null) {
        // someone can pass in the bits of an array ctx that mean $
        return EmptyPredictionContext.instance as SingletonPredictionContext;
    } else {
        return new SingletonPredictionContext(parent, returnState);
    }
};
