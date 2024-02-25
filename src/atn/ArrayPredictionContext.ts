/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";

import { equalArrays, equalNumberArrays } from "../utils/helpers.js";

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
        super(PredictionContext.calculateHashCodeList(parents, returnStates));

        this.parents = parents;
        this.returnStates = returnStates;

        return this;
    }

    public override isEmpty(): boolean {
        // since EMPTY_RETURN_STATE can only appear in the last position, we
        // don't need to verify that size==1
        return this.returnStates[0] === PredictionContext.EMPTY_RETURN_STATE;
    }

    public get length(): number {
        return this.returnStates.length;
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

        if (!(other instanceof ArrayPredictionContext) || this.hashCode() !== other.hashCode()) {
            return false; // can't be same if hash is different
        }

        return equalNumberArrays(this.returnStates, other.returnStates) &&
            equalArrays(this.parents, other.parents);

    }

    public override toString(): string {
        if (this.isEmpty()) {
            return "[]";
        }

        const entries: string[] = [];
        for (let i = 0; i < this.returnStates.length; i++) {
            if (this.returnStates[i] === PredictionContext.EMPTY_RETURN_STATE) {
                entries.push("$");
                continue;
            }

            entries.push(this.returnStates[i]!.toString());
            if (this.parents[i]) {
                entries.push(this.parents[i]!.toString());
            } else {
                entries.push("null");
            }
        }

        return `[${entries.join(", ")}]`;
    }
}
