/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from './PredictionContext.js';
import { HashCode } from "../misc/HashCode.js";

export class SingletonPredictionContext extends PredictionContext {
    parent: any;
    returnState: any;

    constructor(parent: any, returnState: any) {
        let hashCode = 0;
        const hash = new HashCode();
        if (parent !== null) {
            // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
            hash.update(parent, returnState);
        } else {
            // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
            hash.update(1);
        }
        hashCode = hash.finish();
        super(hashCode);
        this.parent = parent;
        this.returnState = returnState;
    }

    getParent(index: any) {
        return this.parent;
    }

    // @ts-expect-error TS(2425): Class 'PredictionContext' defines instance member ... Remove this comment to see the full error message
    getReturnState(index: any) {
        return this.returnState;
    }

    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof SingletonPredictionContext)) {
            return false;
        } else if (this.hashCode() !== other.hashCode()) {
            return false; // can't be same if hash is different
        } else {
            if (this.returnState !== other.returnState)
                return false;
            else if (this.parent == null)
                return other.parent == null;
            else
                return this.parent.equals(other.parent);
        }
    }

    toString() {
        const up = this.parent === null ? "" : this.parent.toString();
        if (up.length === 0) {
            // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
            if (this.returnState === PredictionContext.EMPTY_RETURN_STATE) {
                return "$";
            } else {
                return "" + this.returnState;
            }
        } else {
            return "" + this.returnState + " " + up;
        }
    }

    // @ts-expect-error TS(2611): 'length' is defined as a property in class 'Predic... Remove this comment to see the full error message
    get length() {
        return 1;
    }

    static create(parent: any, returnState: any) {
        // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
        if (returnState === PredictionContext.EMPTY_RETURN_STATE && parent === null) {
            // someone can pass in the bits of an array ctx that mean $
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            return PredictionContext.EMPTY;
        } else {
            return new SingletonPredictionContext(parent, returnState);
        }
    }
}
