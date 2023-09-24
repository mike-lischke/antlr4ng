/* eslint-disable jsdoc/require-param, jsdoc/require-returns, jsdoc/require-jsdoc, jsdoc/require-param-description, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { RuleContext } from "./RuleContext.js";
import { PredictionContext } from "./PredictionContext.js";
import { ArrayPredictionContext } from "./ArrayPredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";
import { EmptyPredictionContext } from "./EmptyPredictionContext.js";
import { HashMap } from "../misc/HashMap.js";

/**
 * Convert a {@link RuleContext} tree to a {@link PredictionContext} graph.
 * Return {@link //EMPTY} if {@code outerContext} is empty or null.
 */
// @ts-expect-error TS(7023): 'predictionContextFromRuleContext' implicitly has ... Remove this comment to see the full error message
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function predictionContextFromRuleContext(atn: any, outerContext: any) {
    if (outerContext === undefined || outerContext === null) {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Ru... Remove this comment to see the full error message
        outerContext = RuleContext.EMPTY;
    }
    // if we are in RuleContext of start rule, s, then PredictionContext
    // is EMPTY. Nobody called us. (if we are empty, return empty)
    // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Ru... Remove this comment to see the full error message
    if (outerContext.parent === null || outerContext === RuleContext.EMPTY) {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return PredictionContext.EMPTY;
    }
    // If we have a parent, convert it to a PredictionContext graph
    // @ts-expect-error TS(7022): 'parent' implicitly has type 'any' because it does... Remove this comment to see the full error message
    const parent = predictionContextFromRuleContext(atn, outerContext.parent);
    const state = atn.states[outerContext.invokingState];
    const transition = state.transitions[0];
    // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
    return SingletonPredictionContext.create(parent, transition.followState.stateNumber);
}

// @ts-expect-error TS(7023): 'getCachedPredictionContext' implicitly has return... Remove this comment to see the full error message
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function getCachedPredictionContext(context: any, contextCache: any, visited: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (context.isEmpty()) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return context;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    let existing = visited.get(context) || null;
    if (existing !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return existing;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    existing = contextCache.get(context);
    if (existing !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        visited.set(context, existing);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return existing;
    }
    let changed = false;
    let parents = [];
    for (let i = 0; i < parents.length; i++) {
        // @ts-expect-error TS(7022): 'parent' implicitly has type 'any' because it does... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const parent = getCachedPredictionContext(context.getParent(i), contextCache, visited);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (changed || parent !== context.getParent(i)) {
            if (!changed) {
                parents = [];
                for (let j = 0; j < context.length; j++) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    parents[j] = context.getParent(j);
                }
                changed = true;
            }
            parents[i] = parent;
        }
    }
    if (!changed) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        contextCache.add(context);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        visited.set(context, context);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return context;
    }
    let updated = null;
    if (parents.length === 0) {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        updated = PredictionContext.EMPTY;
    } else if (parents.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        updated = SingletonPredictionContext.create(parents[0], context
            .getReturnState(0));
    } else {
        updated = new ArrayPredictionContext(parents, context.returnStates);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    contextCache.add(updated);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    visited.set(updated, updated);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    visited.set(context, updated);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return updated;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function merge(a: any, b: any, rootIsWildcard: any, mergeCache: any) {
    // share same graph if both same
    if (a === b) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return a;
    }
    if (a instanceof SingletonPredictionContext && b instanceof SingletonPredictionContext) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-use-before-define
        return mergeSingletons(a, b, rootIsWildcard, mergeCache);
    }
    // At least one of a or b is array
    // If one is $ and rootIsWildcard, return $ as * wildcard
    if (rootIsWildcard) {
        if (a instanceof EmptyPredictionContext) {
            return a;
        }
        if (b instanceof EmptyPredictionContext) {
            return b;
        }
    }
    // convert singleton so both are arrays to normalize
    if (a instanceof SingletonPredictionContext) {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        a = new ArrayPredictionContext([a.getParent()], [a.returnState]);
    }
    if (b instanceof SingletonPredictionContext) {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        b = new ArrayPredictionContext([b.getParent()], [b.returnState]);
    }
    // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-use-before-define
    return mergeArrays(a, b, rootIsWildcard, mergeCache);
}

/**
 * Merge two {@link ArrayPredictionContext} instances.
 *
 * <p>Different tops, different parents.<br>
 * <embed src="images/ArrayMerge_DiffTopDiffPar.svg" type="image/svg+xml"/></p>
 *
 * <p>Shared top, same parents.<br>
 * <embed src="images/ArrayMerge_ShareTopSamePar.svg" type="image/svg+xml"/></p>
 *
 * <p>Shared top, different parents.<br>
 * <embed src="images/ArrayMerge_ShareTopDiffPar.svg" type="image/svg+xml"/></p>
 *
 * <p>Shared top, all shared parents.<br>
 * <embed src="images/ArrayMerge_ShareTopSharePar.svg"
 * type="image/svg+xml"/></p>
 *
 * <p>Equal tops, merge parents and reduce top to
 * {@link SingletonPredictionContext}.<br>
 * <embed src="images/ArrayMerge_EqualTop.svg" type="image/svg+xml"/></p>
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function mergeArrays(a: any, b: any, rootIsWildcard: any, mergeCache: any) {
    if (mergeCache !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        let previous = mergeCache.get(a, b);
        if (previous !== null) {
            // @ts-expect-error TS(2339): Property 'trace_atn_sim' does not exist on type 't... Remove this comment to see the full error message
            // eslint-disable-next-line curly
            if (PredictionContext.trace_atn_sim) console.log("mergeArrays a=" + a + ",b=" + b + " -> previous");
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return previous;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        previous = mergeCache.get(b, a);
        if (previous !== null) {
            // @ts-expect-error TS(2339): Property 'trace_atn_sim' does not exist on type 't... Remove this comment to see the full error message
            // eslint-disable-next-line curly
            if (PredictionContext.trace_atn_sim) console.log("mergeArrays a=" + a + ",b=" + b + " -> previous");
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return previous;
        }
    }
    // merge sorted payloads a + b => M
    let i = 0; // walks a
    let j = 0; // walks b
    let k = 0; // walks target M array

    let mergedReturnStates = new Array(a.returnStates.length + b.returnStates.length).fill(0);
    let mergedParents = new Array(a.returnStates.length + b.returnStates.length).fill(null);
    // walk and merge to yield mergedParents, mergedReturnStates
    while (i < a.returnStates.length && j < b.returnStates.length) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const a_parent = a.parents[i];
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const b_parent = b.parents[j];
        if (a.returnStates[i] === b.returnStates[j]) {
            // same payload (stack tops are equal), must yield merged singleton
            const payload = a.returnStates[i];
            // $+$ = $
            // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
            const bothDollars = payload === PredictionContext.EMPTY_RETURN_STATE &&
                a_parent === null && b_parent === null;
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const ax_ax = (a_parent !== null && b_parent !== null && a_parent === b_parent); // ax+ax
            // ->
            // ax
            if (bothDollars || ax_ax) {
                mergedParents[k] = a_parent; // choose left
                mergedReturnStates[k] = payload;
            } else { // ax+ay -> a'[x,y]
                mergedParents[k] = merge(a_parent, b_parent, rootIsWildcard, mergeCache);
                mergedReturnStates[k] = payload;
            }
            i += 1; // hop over left one as usual
            j += 1; // but also skip one in right side since we merge
        } else if (a.returnStates[i] < b.returnStates[j]) { // copy a[i] to M
            mergedParents[k] = a_parent;
            mergedReturnStates[k] = a.returnStates[i];
            i += 1;
        } else { // b > a, copy b[j] to M
            mergedParents[k] = b_parent;
            mergedReturnStates[k] = b.returnStates[j];
            j += 1;
        }
        k += 1;
    }
    // copy over any payloads remaining in either array
    if (i < a.returnStates.length) {
        for (let p = i; p < a.returnStates.length; p++) {
            mergedParents[k] = a.parents[p];
            mergedReturnStates[k] = a.returnStates[p];
            k += 1;
        }
    } else {
        for (let p = j; p < b.returnStates.length; p++) {
            mergedParents[k] = b.parents[p];
            mergedReturnStates[k] = b.returnStates[p];
            k += 1;
        }
    }
    // trim merged if we combined a few that had same stack tops
    if (k < mergedParents.length) { // write index < last position; trim
        if (k === 1) { // for just one merged element, return singleton top
            // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
            const a_ = SingletonPredictionContext.create(mergedParents[0],
                mergedReturnStates[0]);
            if (mergeCache !== null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                mergeCache.set(a, b, a_);
            }
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return a_;
        }
        mergedParents = mergedParents.slice(0, k);
        mergedReturnStates = mergedReturnStates.slice(0, k);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const M = new ArrayPredictionContext(mergedParents, mergedReturnStates);

    // if we created same array as a or b, return that instead
    // TODO: track whether this is possible above during merge sort for speed
    if (M.equals(a)) {
        if (mergeCache !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            mergeCache.set(a, b, a);
        }
        // @ts-expect-error TS(2339): Property 'trace_atn_sim' does not exist on type 't... Remove this comment to see the full error message
        // eslint-disable-next-line curly
        if (PredictionContext.trace_atn_sim) console.log("mergeArrays a=" + a + ",b=" + b + " -> a");
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return a;
    }
    if (M.equals(b)) {
        if (mergeCache !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            mergeCache.set(a, b, b);
        }
        // @ts-expect-error TS(2339): Property 'trace_atn_sim' does not exist on type 't... Remove this comment to see the full error message
        // eslint-disable-next-line curly
        if (PredictionContext.trace_atn_sim) console.log("mergeArrays a=" + a + ",b=" + b + " -> b");
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return b;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    combineCommonParents(mergedParents);

    if (mergeCache !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        mergeCache.set(a, b, M);
    }

    // @ts-expect-error TS(2339): Property 'trace_atn_sim' does not exist on type 't... Remove this comment to see the full error message
    // eslint-disable-next-line curly
    if (PredictionContext.trace_atn_sim) console.log("mergeArrays a=" + a + ",b=" + b + " -> " + M);

    return M;
}

/**
 * Make pass over all <em>M</em> {@code parents}; merge any {@code equals()}
 * ones.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function combineCommonParents(parents: any) {
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
    const uniqueParents = new HashMap();

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let p = 0; p < parents.length; p++) {
        const parent = parents[p];
        if (!(uniqueParents.containsKey(parent))) {
            uniqueParents.set(parent, parent);
        }
    }
    for (let q = 0; q < parents.length; q++) {
        parents[q] = uniqueParents.get(parents[q]);
    }
}

/**
 * Merge two {@link SingletonPredictionContext} instances.
 *
 * <p>Stack tops equal, parents merge is same; return left graph.<br>
 * <embed src="images/SingletonMerge_SameRootSamePar.svg"
 * type="image/svg+xml"/></p>
 *
 * <p>Same stack top, parents differ; merge parents giving array node, then
 * remainders of those graphs. A new root node is created to point to the
 * merged parents.<br>
 * <embed src="images/SingletonMerge_SameRootDiffPar.svg"
 * type="image/svg+xml"/></p>
 *
 * <p>Different stack tops pointing to same parent. Make array node for the
 * root where both element in the root point to the same (original)
 * parent.<br>
 * <embed src="images/SingletonMerge_DiffRootSamePar.svg"
 * type="image/svg+xml"/></p>
 *
 * <p>Different stack tops pointing to different parents. Make array node for
 * the root where each element points to the corresponding original
 * parent.<br>
 * <embed src="images/SingletonMerge_DiffRootDiffPar.svg"
 * type="image/svg+xml"/></p>
 *
 * @param a the first {@link SingletonPredictionContext}
 * @param b the second {@link SingletonPredictionContext}
 * @param rootIsWildcard {@code true} if this is a local-context merge,
 * otherwise false to indicate a full-context merge
 * @param mergeCache
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function mergeSingletons(a: any, b: any, rootIsWildcard: any, mergeCache: any) {
    if (mergeCache !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        let previous = mergeCache.get(a, b);
        if (previous !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return previous;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        previous = mergeCache.get(b, a);
        if (previous !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return previous;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const rootMerge = mergeRoot(a, b, rootIsWildcard);
    if (rootMerge !== null) {
        if (mergeCache !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            mergeCache.set(a, b, rootMerge);
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return rootMerge;
    }
    if (a.returnState === b.returnState) {
        const parent = merge(a.parent, b.parent, rootIsWildcard, mergeCache);
        // if parent is same as existing a or b parent or reduced to a parent,
        // return it
        if (parent === a.parent) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return a; // ax + bx = ax, if a=b
        }
        if (parent === b.parent) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return b; // ax + bx = bx, if a=b
        }
        // else: ax + ay = a'[x,y]
        // merge parents x and y, giving array node with x,y then remainders
        // of those graphs. dup a, a' points at merged array
        // new joined parent so create new singleton pointing to it, a'
        const spc = SingletonPredictionContext.create(parent, a.returnState);
        if (mergeCache !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            mergeCache.set(a, b, spc);
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return spc;
    } else { // a != b payloads differ
        // see if we can collapse parents due to $+x parents if local ctx
        let singleParent = null;
        if (a === b || (a.parent !== null && a.parent === b.parent)) { // ax +
            // bx =
            // [a,b]x
            singleParent = a.parent;
        }
        if (singleParent !== null) { // parents are same
            // sort payloads and use same parent
            const payloads = [a.returnState, b.returnState];
            if (a.returnState > b.returnState) {
                payloads[0] = b.returnState;
                payloads[1] = a.returnState;
            }
            const parents = [singleParent, singleParent];
            const apc = new ArrayPredictionContext(parents, payloads);
            if (mergeCache !== null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                mergeCache.set(a, b, apc);
            }
            // eslint-disable-next-line padding-line-between-statements
            return apc;
        }
        // parents differ and can't merge them. Just pack together
        // into array; can't merge.
        // ax + by = [ax,by]
        const payloads = [a.returnState, b.returnState];
        let parents = [a.parent, b.parent];
        if (a.returnState > b.returnState) { // sort by payload
            payloads[0] = b.returnState;
            payloads[1] = a.returnState;
            parents = [b.parent, a.parent];
        }
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
        const a_ = new ArrayPredictionContext(parents, payloads);
        if (mergeCache !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            mergeCache.set(a, b, a_);
        }
        // eslint-disable-next-line padding-line-between-statements
        return a_;
    }
}

/**
 * Handle case where at least one of {@code a} or {@code b} is
 * {@link //EMPTY}. In the following diagrams, the symbol {@code $} is used
 * to represent {@link //EMPTY}.
 *
 * <h2>Local-Context Merges</h2>
 *
 * <p>These local-context merge operations are used when {@code rootIsWildcard}
 * is true.</p>
 *
 * <p>{@link //EMPTY} is superset of any graph; return {@link //EMPTY}.<br>
 * <embed src="images/LocalMerge_EmptyRoot.svg" type="image/svg+xml"/></p>
 *
 * <p>{@link //EMPTY} and anything is {@code //EMPTY}, so merged parent is
 * {@code //EMPTY}; return left graph.<br>
 * <embed src="images/LocalMerge_EmptyParent.svg" type="image/svg+xml"/></p>
 *
 * <p>Special case of last merge if local context.<br>
 * <embed src="images/LocalMerge_DiffRoots.svg" type="image/svg+xml"/></p>
 *
 * <h2>Full-Context Merges</h2>
 *
 * <p>These full-context merge operations are used when {@code rootIsWildcard}
 * is false.</p>
 *
 * <p><embed src="images/FullMerge_EmptyRoots.svg" type="image/svg+xml"/></p>
 *
 * <p>Must keep all contexts; {@link //EMPTY} in array is a special value (and
 * null parent).<br>
 * <embed src="images/FullMerge_EmptyRoot.svg" type="image/svg+xml"/></p>
 *
 * <p><embed src="images/FullMerge_SameRoot.svg" type="image/svg+xml"/></p>
 *
 * @param a the first {@link SingletonPredictionContext}
 * @param b the second {@link SingletonPredictionContext}
 * @param rootIsWildcard {@code true} if this is a local-context merge,
 * otherwise false to indicate a full-context merge
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function mergeRoot(a: any, b: any, rootIsWildcard: any) {
    if (rootIsWildcard) {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        if (a === PredictionContext.EMPTY) {
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return PredictionContext.EMPTY; // // + b =//
        }
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        if (b === PredictionContext.EMPTY) {
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return PredictionContext.EMPTY; // a +// =//
        }
    } else {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        if (a === PredictionContext.EMPTY && b === PredictionContext.EMPTY) {
            // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return PredictionContext.EMPTY; // $ + $ = $
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        } else if (a === PredictionContext.EMPTY) { // $ + x = [$,x]
            const payloads = [b.returnState,
            // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
            PredictionContext.EMPTY_RETURN_STATE];
            const parents = [b.parent, null];
            // eslint-disable-next-line padding-line-between-statements
            return new ArrayPredictionContext(parents, payloads);
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        } else if (b === PredictionContext.EMPTY) { // x + $ = [$,x] ($ is always first if present)
            // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
            const payloads = [a.returnState, PredictionContext.EMPTY_RETURN_STATE];
            const parents = [a.parent, null];
            // eslint-disable-next-line padding-line-between-statements
            return new ArrayPredictionContext(parents, payloads);
        }
    }
    // eslint-disable-next-line padding-line-between-statements
    return null;
}

// ter's recursive version of Sam's getAllNodes()
// @ts-expect-error TS(7023): 'getAllContextNodes' implicitly has return type 'a... Remove this comment to see the full error message
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
export function getAllContextNodes(context: any, nodes: any, visited: any) {
    if (nodes === null) {
        nodes = [];
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return getAllContextNodes(context, nodes, visited);
    } else if (visited === null) {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        visited = new HashMap();
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return getAllContextNodes(context, nodes, visited);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (context === null || visited.containsKey(context)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return nodes;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        visited.set(context, context);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        nodes.push(context);
        for (let i = 0; i < context.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            getAllContextNodes(context.getParent(i), nodes, visited);
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return nodes;
    }
}
