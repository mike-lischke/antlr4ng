/* eslint-disable jsdoc/require-param, jsdoc/require-returns */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredictionContext } from "./PredictionContext.js";
import { HashMap } from "../misc/HashMap.js";

/**
 * Used to cache {@link PredictionContext} objects. Its used for the shared
 * context cash associated with contexts in DFA states. This cache
 * can be used for both lexers and parsers.
 */
export class PredictionContextCache {
    cache: any;

    constructor() {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        this.cache = new HashMap();
    }

    /**
     * Add a context to the cache and return it. If the context already exists,
     * return that one instead and do not add a new context to the cache.
     * Protect shared cache from unsafe thread access.
     */
    add(ctx: any) {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        if (ctx === PredictionContext.EMPTY) {
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            return PredictionContext.EMPTY;
        }
        const existing = this.cache.get(ctx) || null;
        if (existing !== null) {
            return existing;
        }
        this.cache.set(ctx, ctx);
        return ctx;
    }

    get(ctx: any) {
        return this.cache.get(ctx) || null;
    }

    get length() {
        return this.cache.length;
    }
}
