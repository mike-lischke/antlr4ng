/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";
import { equalArrays } from "../utils/equalArrays.js";
import { HashCode } from "../misc/HashCode.js";

export class ArrayPredictionContext extends PredictionContext {
    parents: any;
    returnStates: any;

    constructor(parents: any, returnStates: any) {
        /**
         * Parent can be null only if full ctx mode and we make an array
         * from {@link //EMPTY} and non-empty. We merge {@link //EMPTY} by using
         * null parent and
         * returnState == {@link //EMPTY_RETURN_STATE}.
         */
        const h = new HashCode();
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
        h.update(parents, returnStates);
        const hashCode = h.finish();
        super(hashCode);
        this.parents = parents;
        this.returnStates = returnStates;
        return this;
    }

    isEmpty() {
        // since EMPTY_RETURN_STATE can only appear in the last position, we
        // don't need to verify that size==1
        // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
        return this.returnStates[0] === PredictionContext.EMPTY_RETURN_STATE;
    }

    getParent(index: any) {
        return this.parents[index];
    }

    // @ts-expect-error TS(2425): Class 'PredictionContext' defines instance member ... Remove this comment to see the full error message
    getReturnState(index: any) {
        return this.returnStates[index];
    }

    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof ArrayPredictionContext)) {
            return false;
        } else if (this.hashCode() !== other.hashCode()) {
            return false; // can't be same if hash is different
        } else {
            return equalArrays(this.returnStates, other.returnStates) &&
                equalArrays(this.parents, other.parents);
        }
    }

    toString() {
        if (this.isEmpty()) {
            return "[]";
        } else {
            let s = "[";
            for (let i = 0; i < this.returnStates.length; i++) {
                if (i > 0) {
                    s = s + ", ";
                }
                // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
                if (this.returnStates[i] === PredictionContext.EMPTY_RETURN_STATE) {
                    s = s + "$";
                    continue;
                }
                s = s + this.returnStates[i];
                if (this.parents[i] !== null) {
                    s = s + " " + this.parents[i];
                } else {
                    s = s + "null";
                }
            }
            return s + "]";
        }
    }

    // @ts-expect-error TS(2611): 'length' is defined as a property in class 'Predic... Remove this comment to see the full error message
    get length() {
        return this.returnStates.length;
    }
}
