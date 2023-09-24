/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";

export class EmptyPredictionContext extends SingletonPredictionContext {
    returnState: any;

    constructor() {
        // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
        super(null, PredictionContext.EMPTY_RETURN_STATE);
    }

    isEmpty() {
        return true;
    }

    getParent(index: any) {
        return null;
    }

    getReturnState(index: any) {
        return this.returnState;
    }

    equals(other: any) {
        return this === other;
    }

    toString() {
        return "$";
    }
}


// @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
PredictionContext.EMPTY = new EmptyPredictionContext();
