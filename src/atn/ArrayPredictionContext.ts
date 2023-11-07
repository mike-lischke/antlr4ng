/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";
import { HashCode } from "../misc/HashCode.js";

import { equalArrays } from "../utils/helpers.js";

export class ArrayPredictionContext extends PredictionContext {
    public readonly parents: Array<PredictionContext | null> = [];
    public readonly returnStates: number[] = [];

    public constructor(parents: Array<PredictionContext | null>, returnStates: number[]) {
        /**
         * Parent can be null only if full ctx mode and we make an array
         * from {@link EMPTY} and non-empty. We merge {@link EMPTY} by using
         * null parent and
         * returnState == {@link EMPTY_RETURN_STATE}.
         */
        const h = new HashCode();
        h.update(parents, returnStates);
        const hashCode = h.finish();
        super(hashCode);
        this.parents = parents;
        this.returnStates = returnStates;

        return this;
    }

    public override isEmpty(): boolean {
        // since EMPTY_RETURN_STATE can only appear in the last position, we
        // don't need to verify that size==1
        return this.returnStates[0] === PredictionContext.EMPTY_RETURN_STATE;
    }

    public getParent(index: number): PredictionContext | null {
        return this.parents[index];
    }

    public getReturnState(index: number): number {
        return this.returnStates[index];
    }

    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof ArrayPredictionContext)) {
            return false;
        }

        if (this.hashCode() !== other.hashCode()) {
            return false; // can't be same if hash is different
        }

        return equalArrays(this.returnStates, other.returnStates) &&
            equalArrays(this.parents, other.parents);

    }

    public override toString(): string {
        if (this.isEmpty()) {
            return "[]";
        } else {
            let s = "[";
            for (let i = 0; i < this.returnStates.length; i++) {
                if (i > 0) {
                    s = s + ", ";
                }
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

    public get length(): number {
        return this.returnStates.length;
    }
}
