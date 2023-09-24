/* eslint-disable jsdoc/require-param, jsdoc/require-returns, max-len */
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
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    cache: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        this.cache = new HashMap();
    }

    /**
     * Add a context to the cache and return it. If the context already exists,
     * return that one instead and do not add a new context to the cache.
     * Protect shared cache from unsafe thread access.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    add(ctx: any) {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        if (ctx === PredictionContext.EMPTY) {
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return PredictionContext.EMPTY;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const existing = this.cache.get(ctx) || null;
        if (existing !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return existing;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.cache.set(ctx, ctx);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return ctx;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    get(ctx: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return this.cache.get(ctx) || null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get length() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.cache.length;
    }
}
