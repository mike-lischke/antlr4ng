/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class PredictionContext {
    cachedHashCode: any;
    getReturnState: any;
    length: any;
    constructor(cachedHashCode: any) {
        this.cachedHashCode = cachedHashCode;
    }

    /**
     * Stores the computed hash code of this {@link PredictionContext}. The hash
     * code is computed in parts to match the following reference algorithm.
     *
     * <pre>
     * private int referenceHashCode() {
     * int hash = {@link MurmurHash//initialize MurmurHash.initialize}({@link
     * //INITIAL_HASH});
     *
     * for (int i = 0; i &lt; {@link //size()}; i++) {
     * hash = {@link MurmurHash//update MurmurHash.update}(hash, {@link //getParent
     * getParent}(i));
     * }
     *
     * for (int i = 0; i &lt; {@link //size()}; i++) {
     * hash = {@link MurmurHash//update MurmurHash.update}(hash, {@link
     * //getReturnState getReturnState}(i));
     * }
     *
     * hash = {@link MurmurHash//finish MurmurHash.finish}(hash, 2// {@link
     * //size()});
     * return hash;
     * }
     * </pre>
     * This means only the {@link //EMPTY} context is in set.
     */
    isEmpty() {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        return this === PredictionContext.EMPTY;
    }

    hasEmptyPath() {
        // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
        return this.getReturnState(this.length - 1) === PredictionContext.EMPTY_RETURN_STATE;
    }

    hashCode() {
        return this.cachedHashCode;
    }

    updateHashCode(hash: any) {
        hash.update(this.cachedHashCode);
    }
}

/**
 * Represents {@code $} in local context prediction, which means wildcard.
 * {@code//+x =//}.
 */
// @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
PredictionContext.EMPTY = null;

/**
 * Represents {@code $} in an array in full context mode, when {@code $}
 * doesn't mean wildcard: {@code $ + x = [$,x]}. Here,
 * {@code $} = {@link //EMPTY_RETURN_STATE}.
 */
// @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
PredictionContext.EMPTY_RETURN_STATE = 0x7FFFFFFF;

// @ts-expect-error TS(2339): Property 'globalNodeCount' does not exist on type ... Remove this comment to see the full error message
PredictionContext.globalNodeCount = 1;
// @ts-expect-error TS(2339): Property 'id' does not exist on type 'typeof Predi... Remove this comment to see the full error message
PredictionContext.id = PredictionContext.globalNodeCount;
// @ts-expect-error TS(2339): Property 'trace_atn_sim' does not exist on type 't... Remove this comment to see the full error message
PredictionContext.trace_atn_sim = false;
