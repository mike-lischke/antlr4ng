/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";
import { HashCode } from "../misc/HashCode.js";

export class SingletonPredictionContext extends PredictionContext {
    public readonly parent: PredictionContext | null;
    public readonly returnState: number;

    public constructor(parent: PredictionContext | null, returnState: number) {
        let hashCode = 0;
        const hash = new HashCode();
        if (parent !== null) {
            hash.update(parent, returnState);
        } else {
            hash.update(1);
        }
        hashCode = hash.finish();
        super(hashCode);
        this.parent = parent;
        this.returnState = returnState;
    }

    public static create(parent: PredictionContext | null, returnState: number): SingletonPredictionContext {
        if (returnState === PredictionContext.EMPTY_RETURN_STATE && parent === null) {
            // someone can pass in the bits of an array ctx that mean $
            return PredictionContext.EMPTY as SingletonPredictionContext;
        } else {
            return new SingletonPredictionContext(parent, returnState);
        }
    }

    public getParent(_index: number): PredictionContext | null {
        return this.parent;
    }

    public getReturnState(_index: number): number {
        return this.returnState;
    }

    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof SingletonPredictionContext)) {
            return false;
        } else if (this.hashCode() !== other.hashCode()) {
            return false; // can't be same if hash is different
        } else {
            if (this.returnState !== other.returnState) { return false; }
            else if (this.parent == null) { return other.parent == null; }
            else { return this.parent.equals(other.parent); }
        }
    }

    public override toString(): string {
        const up = this.parent === null ? "" : this.parent.toString();
        if (up.length === 0) {
            if (this.returnState === PredictionContext.EMPTY_RETURN_STATE) {
                return "$";
            } else {
                return "" + this.returnState;
            }
        } else {
            return "" + this.returnState + " " + up;
        }
    }

    public get length(): number {
        return 1;
    }

}
