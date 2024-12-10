/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { HashMap } from "../misc/HashMap.js";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator.js";
import { EmptyPredictionContext } from "./EmptyPredictionContext.js";
import { PredictionContext } from "./PredictionContext.js";

/**
 * Used to cache {@link PredictionContext} objects. Its used for the shared
 * context cache associated with contexts in DFA states. This cache
 * can be used for both lexers and parsers.
 */
export class PredictionContextCache {
    private cache = new HashMap<PredictionContext, PredictionContext>(ObjectEqualityComparator.instance);

    /**
     * Add a context to the cache and return it. If the context already exists,
     * return that one instead and do not add a new context to the cache.
     * Protect shared cache from unsafe thread access.
     *
     * @param ctx tbd
     * @returns tbd
     */
    public add(ctx: PredictionContext): PredictionContext {
        if (ctx === EmptyPredictionContext.instance) {
            return ctx;
        }
        const existing = this.cache.get(ctx);
        if (existing) {
            return existing;
        }
        this.cache.set(ctx, ctx);

        return ctx;
    }

    public get(ctx: PredictionContext): PredictionContext | undefined {
        return this.cache.get(ctx);
    }

    public get length(): number {
        return this.cache.size;
    }
}
