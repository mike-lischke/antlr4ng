/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";

export class EmptyPredictionContext extends SingletonPredictionContext {
    /**
     * Represents {@code $} in local context prediction, which means wildcard.
     * {@code *+x = *}.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Instance = new EmptyPredictionContext();

    public constructor() {
        super(null, PredictionContext.EMPTY_RETURN_STATE);
    }

    public override isEmpty(): boolean {
        return true;
    }

    public override getParent(_index: number): PredictionContext | null {
        return null;
    }

    public override getReturnState(_index: number): number {
        return this.returnState;
    }

    public override equals(other: unknown): boolean {

        return this === other;
    }

    public override toString(): string {
        return "$";
    }

    static {
        PredictionContext.EMPTY = new EmptyPredictionContext();
    }
}
