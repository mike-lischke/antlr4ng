/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention, jsdoc/require-returns, jsdoc/require-param */

import { Recognizer } from "../Recognizer.js";
import { MurmurHash } from "../utils/MurmurHash.js";
import { ATNSimulator } from "./ATNSimulator.js";

// Most of the implementation is located in PredictionContextUtils.ts, to avoid circular dependencies.

export abstract class PredictionContext {
    /**
     * Represents `$` in an array in full context mode, when `$`
     * doesn't mean wildcard: `$ + x = [$,x]`. Here,
     * `$` = {@link EMPTY_RETURN_STATE}.
     */
    public static readonly EMPTY_RETURN_STATE = 0x7FFFFFFF;

    public static traceATNSimulator = false;

    private cachedHashCode: number;

    public constructor(cachedHashCode: number) {
        this.cachedHashCode = cachedHashCode;
    }

    protected static calculateEmptyHashCode(): number {
        let hash = MurmurHash.initialize(31);
        hash = MurmurHash.finish(hash, 0);

        return hash;
    }

    protected static calculateHashCodeSingle(parent: PredictionContext, returnState: number): number {
        let hash = MurmurHash.initialize(31);
        hash = MurmurHash.updateFromComparable(hash, parent);
        hash = MurmurHash.update(hash, returnState);
        hash = MurmurHash.finish(hash, 2);

        return hash;
    }

    protected static calculateHashCodeList(parents: Array<PredictionContext | null>, returnStates: number[]): number {
        let hash = MurmurHash.initialize(31);

        for (const parent of parents) {
            hash = MurmurHash.updateFromComparable(hash, parent);
        }

        for (const returnState of returnStates) {
            hash = MurmurHash.update(hash, returnState);
        }

        hash = MurmurHash.finish(hash, 2 * parents.length);

        return hash;
    }

    public isEmpty(): boolean {
        return false;
    }

    public hasEmptyPath(): boolean {
        return this.getReturnState(this.length - 1) === PredictionContext.EMPTY_RETURN_STATE;
    }

    public hashCode(): number {
        return this.cachedHashCode;
    }

    public toString(_recog?: Recognizer<ATNSimulator>): string {
        return "";
    }

    public abstract getParent(index: number): PredictionContext | null;
    public abstract getReturnState(index: number): number;
    public abstract get length(): number;
    public abstract equals(obj: unknown): boolean;
}
