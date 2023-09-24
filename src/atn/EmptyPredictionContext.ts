/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";

export class EmptyPredictionContext extends SingletonPredictionContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    returnState: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
        super(null, PredictionContext.EMPTY_RETURN_STATE);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    isEmpty() {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getParent(index: any) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getReturnState(index: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.returnState;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        return this === other;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return "$";
    }
}

// eslint-disable-next-line no-multiple-empty-lines

// @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
PredictionContext.EMPTY = new EmptyPredictionContext();
