/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { PredictionContext } from './PredictionContext.js';
import { HashCode } from "../misc/HashCode.js";

export class SingletonPredictionContext extends PredictionContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    parent: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    returnState: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getParent(index: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.parent;
    }

    // @ts-expect-error TS(2425): Class 'PredictionContext' defines instance member ... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getReturnState(index: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.returnState;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof SingletonPredictionContext)) {
            return false;
        } else if (this.hashCode() !== other.hashCode()) {
            return false; // can't be same if hash is different
        } else {
            if (this.returnState !== other.returnState)
                // eslint-disable-next-line curly
                return false;
            else if (this.parent == null)
                // eslint-disable-next-line curly
                return other.parent == null;
            else
                // eslint-disable-next-line curly, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
                return this.parent.equals(other.parent);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get length() {
        return 1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    static create(parent: any, returnState: any) {
        // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
        if (returnState === PredictionContext.EMPTY_RETURN_STATE && parent === null) {
            // someone can pass in the bits of an array ctx that mean $
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return PredictionContext.EMPTY;
        } else {
            return new SingletonPredictionContext(parent, returnState);
        }
    }
}
