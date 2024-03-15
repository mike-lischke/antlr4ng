/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { PredictionContext } from "./PredictionContext.js";
import { ArrayPredictionContext } from "./ArrayPredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";
import { EmptyPredictionContext } from "./EmptyPredictionContext.js";
import { ATN } from "./ATN.js";
import { PredictionContextCache } from "./PredictionContextCache.js";
import { DoubleDict } from "../utils/DoubleDict.js";
import { ParserRuleContext } from "../ParserRuleContext.js";
import { RuleTransition } from "./RuleTransition.js";
import { HashMap } from "../misc/HashMap.js";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator.js";

/**
 * Convert a {@link RuleContext} tree to a {@link PredictionContext} graph.
 * Return {@link EMPTY} if `outerContext` is empty or null.
 */
export const predictionContextFromRuleContext = (atn: ATN, outerContext?: ParserRuleContext): PredictionContext => {
    if (!outerContext) {
        outerContext = ParserRuleContext.empty;
    }

    // if we are in RuleContext of start rule, s, then PredictionContext
    // is EMPTY. Nobody called us. (if we are empty, return empty)
    if (!outerContext.parent || outerContext === ParserRuleContext.empty) {
        return PredictionContext.EMPTY;
    }

    // If we have a parent, convert it to a PredictionContext graph
    const parent = predictionContextFromRuleContext(atn, outerContext.parent);
    const state = atn.states[outerContext.invokingState]!;
    const transition = state.transitions[0] as RuleTransition;

    return SingletonPredictionContext.create(parent, transition.followState.stateNumber);
};

export const getCachedPredictionContext = (context: PredictionContext, contextCache: PredictionContextCache,
    visited: HashMap<PredictionContext, PredictionContext>): PredictionContext => {
    if (context.isEmpty()) {
        return context;
    }

    let existing = visited.get(context);
    if (existing) {
        return existing;
    }

    existing = contextCache.get(context);
    if (existing) {
        visited.set(context, existing);

        return existing;
    }

    let changed = false;
    let parents = [];
    for (let i = 0; i < parents.length; i++) {
        const parent = getCachedPredictionContext(context.getParent(i)!, contextCache, visited);
        if (changed || parent !== context.getParent(i)) {
            if (!changed) {
                parents = [];
                for (let j = 0; j < context.length; j++) {
                    parents[j] = context.getParent(j);
                }
                changed = true;
            }
            parents[i] = parent;
        }
    }

    if (!changed) {
        contextCache.add(context);
        visited.set(context, context);

        return context;
    }

    let updated;
    if (parents.length === 0) {
        updated = PredictionContext.EMPTY;
    } else if (parents.length === 1) {
        updated = SingletonPredictionContext.create(parents[0] ?? undefined, context.getReturnState(0));
    } else {
        updated = new ArrayPredictionContext(parents, (context as ArrayPredictionContext).returnStates);
    }

    contextCache.add(updated);
    visited.set(updated, updated);
    visited.set(context, updated);

    return updated;
};

export const merge = (a: PredictionContext, b: PredictionContext, rootIsWildcard: boolean,
    mergeCache: DoubleDict<PredictionContext, PredictionContext, PredictionContext> | null): PredictionContext => {
    // share same graph if both same
    if (a === b) {
        return a;
    }

    if (a instanceof SingletonPredictionContext && b instanceof SingletonPredictionContext) {
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
        a = new ArrayPredictionContext([a.parent], [a.returnState]);
    }

    if (b instanceof SingletonPredictionContext) {
        b = new ArrayPredictionContext([b.parent], [b.returnState]);
    }

    return mergeArrays(a as ArrayPredictionContext, b as ArrayPredictionContext, rootIsWildcard, mergeCache);
};

/**
 * Merge two {@link ArrayPredictionContext} instances.
 *
 * Different tops, different parents.<br>
 * <embed src="images/ArrayMerge_DiffTopDiffPar.svg" type="image/svg+xml"/>
 *
 * Shared top, same parents.<br>
 * <embed src="images/ArrayMerge_ShareTopSamePar.svg" type="image/svg+xml"/>
 *
 * Shared top, different parents.<br>
 * <embed src="images/ArrayMerge_ShareTopDiffPar.svg" type="image/svg+xml"/>
 *
 * Shared top, all shared parents.<br>
 * <embed src="images/ArrayMerge_ShareTopSharePar.svg"
 * type="image/svg+xml"/>
 *
 * Equal tops, merge parents and reduce top to
 * {@link SingletonPredictionContext}.<br>
 * <embed src="images/ArrayMerge_EqualTop.svg" type="image/svg+xml"/>
 */
const mergeArrays = (a: ArrayPredictionContext, b: ArrayPredictionContext, rootIsWildcard: boolean,
    mergeCache: DoubleDict<PredictionContext, PredictionContext, PredictionContext> | null): PredictionContext => {
    if (mergeCache) {
        let previous = mergeCache.get(a, b);
        if (previous) {
            return previous;
        }

        previous = mergeCache.get(b, a);
        if (previous) {
            return previous;
        }
    }

    // merge sorted payloads a + b => M
    let i = 0; // walks a
    let j = 0; // walks b
    let k = 0; // walks target M array

    let mergedReturnStates = new Array<number>(a.returnStates.length + b.returnStates.length).fill(0);
    let mergedParents = new Array<PredictionContext | null>(a.returnStates.length + b.returnStates.length).fill(null);

    // walk and merge to yield mergedParents, mergedReturnStates
    while (i < a.returnStates.length && j < b.returnStates.length) {
        const aParent = a.parents[i];
        const bParent = b.parents[j];
        if (a.returnStates[i] === b.returnStates[j]) {
            // same payload (stack tops are equal), must yield merged singleton
            const payload = a.returnStates[i];
            // $+$ = $
            const bothDollars = payload === PredictionContext.EMPTY_RETURN_STATE &&
                aParent === null && bParent === null;
            const axAx = (aParent !== null && bParent !== null && aParent === bParent); // ax+ax
            // ->
            // ax
            if (bothDollars || axAx) {
                mergedParents[k] = aParent; // choose left
                mergedReturnStates[k] = payload;
            } else { // ax+ay -> a'[x,y]
                mergedParents[k] = merge(aParent!, bParent!, rootIsWildcard, mergeCache);
                mergedReturnStates[k] = payload;
            }
            i += 1; // hop over left one as usual
            j += 1; // but also skip one in right side since we merge
        } else if (a.returnStates[i] < b.returnStates[j]) { // copy a[i] to M
            mergedParents[k] = aParent;
            mergedReturnStates[k] = a.returnStates[i];
            i += 1;
        } else { // b > a, copy b[j] to M
            mergedParents[k] = bParent;
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
            const aNew = SingletonPredictionContext.create(mergedParents[0] ?? undefined, mergedReturnStates[0]);
            if (mergeCache !== null) {
                mergeCache.set(a, b, aNew);
            }

            return aNew;
        }
        mergedParents = mergedParents.slice(0, k);
        mergedReturnStates = mergedReturnStates.slice(0, k);
    }

    const merged = new ArrayPredictionContext(mergedParents, mergedReturnStates);

    // if we created same array as a or b, return that instead
    // TODO: track whether this is possible above during merge sort for speed
    if (merged.equals(a)) {
        if (mergeCache !== null) {
            mergeCache.set(a, b, a);
        }

        if (PredictionContext.traceATNSimulator) {
            console.log("mergeArrays a=" + a + ",b=" + b + " -> a");
        }

        return a;
    }

    if (merged.equals(b)) {
        if (mergeCache !== null) {
            mergeCache.set(a, b, b);
        }

        return b;
    }

    combineCommonParents(mergedParents);

    if (mergeCache !== null) {
        mergeCache.set(a, b, merged);
    }

    if (PredictionContext.traceATNSimulator) {
        console.log("mergeArrays a=" + a + ",b=" + b + " -> " + merged);
    }

    return merged;
};

/**
 * Make pass over all *M* `parents`; merge any `equals()`
 * ones.
 */
export const combineCommonParents = (parents: Array<PredictionContext | null>): void => {
    const uniqueParents = new HashMap<PredictionContext, PredictionContext>(ObjectEqualityComparator.instance);

    for (const parent of parents) {
        if (parent) {
            if (!(uniqueParents.containsKey(parent))) {
                uniqueParents.set(parent, parent);
            }
        }
    }

    for (let q = 0; q < parents.length; q++) {
        if (parents[q]) {
            parents[q] = uniqueParents.get(parents[q]!) ?? null;
        }
    }
};

/**
 * Merge two {@link SingletonPredictionContext} instances.
 *
 * Stack tops equal, parents merge is same; return left graph.<br>
 * <embed src="images/SingletonMerge_SameRootSamePar.svg"
 * type="image/svg+xml"/>
 *
 * Same stack top, parents differ; merge parents giving array node, then
 * remainders of those graphs. A new root node is created to point to the
 * merged parents.<br>
 * <embed src="images/SingletonMerge_SameRootDiffPar.svg"
 * type="image/svg+xml"/>
 *
 * Different stack tops pointing to same parent. Make array node for the
 * root where both element in the root point to the same (original)
 * parent.<br>
 * <embed src="images/SingletonMerge_DiffRootSamePar.svg"
 * type="image/svg+xml"/>
 *
 * Different stack tops pointing to different parents. Make array node for
 * the root where each element points to the corresponding original
 * parent.<br>
 * <embed src="images/SingletonMerge_DiffRootDiffPar.svg"
 * type="image/svg+xml"/>
 *
 * @param a the first {@link SingletonPredictionContext}
 * @param b the second {@link SingletonPredictionContext}
 * @param rootIsWildcard `true` if this is a local-context merge,
 * otherwise false to indicate a full-context merge
 * @param mergeCache tbd
 */
export const mergeSingletons = (a: SingletonPredictionContext, b: SingletonPredictionContext,
    rootIsWildcard: boolean,
    mergeCache: DoubleDict<PredictionContext, PredictionContext, PredictionContext> | null): PredictionContext => {
    if (mergeCache !== null) {
        let previous = mergeCache.get(a, b);
        if (previous !== null) {
            return previous;
        }
        previous = mergeCache.get(b, a);
        if (previous !== null) {
            return previous;
        }
    }

    const rootMerge = mergeRoot(a, b, rootIsWildcard);
    if (rootMerge !== null) {
        if (mergeCache !== null) {
            mergeCache.set(a, b, rootMerge);
        }

        return rootMerge;
    }

    if (a.returnState === b.returnState) {
        const parent = merge(a.parent!, b.parent!, rootIsWildcard, mergeCache);
        // if parent is same as existing a or b parent or reduced to a parent,
        // return it
        if (parent === a.parent) {
            return a; // ax + bx = ax, if a=b
        }

        if (parent === b.parent) {
            return b; // ax + bx = bx, if a=b
        }

        // else: ax + ay = a'[x,y]
        // merge parents x and y, giving array node with x,y then remainders
        // of those graphs. dup a, a' points at merged array
        // new joined parent so create new singleton pointing to it, a'
        const spc = SingletonPredictionContext.create(parent, a.returnState);
        if (mergeCache !== null) {
            mergeCache.set(a, b, spc);
        }

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
                mergeCache.set(a, b, apc);
            }

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
        const aNew = new ArrayPredictionContext(parents, payloads);
        if (mergeCache !== null) {
            mergeCache.set(a, b, aNew);
        }

        return aNew;
    }
};

/**
 * Handle case where at least one of `a` or `b` is
 * {@link EMPTY}. In the following diagrams, the symbol `$` is used
 * to represent {@link EMPTY}.
 *
 * <h2>Local-Context Merges</h2>
 *
 * These local-context merge operations are used when `rootIsWildcard`
 * is true.
 *
 * {@link EMPTY} is superset of any graph; return {@link EMPTY}.<br>
 * <embed src="images/LocalMerge_EmptyRoot.svg" type="image/svg+xml"/>
 *
 * {@link EMPTY} and anything is `//EMPTY`, so merged parent is
 * `//EMPTY`; return left graph.<br>
 * <embed src="images/LocalMerge_EmptyParent.svg" type="image/svg+xml"/>
 *
 * Special case of last merge if local context.<br>
 * <embed src="images/LocalMerge_DiffRoots.svg" type="image/svg+xml"/>
 *
 * <h2>Full-Context Merges</h2>
 *
 * These full-context merge operations are used when `rootIsWildcard`
 * is false.
 *
 * <embed src="images/FullMerge_EmptyRoots.svg" type="image/svg+xml"/>
 *
 * Must keep all contexts; {@link EMPTY} in array is a special value (and
 * null parent).<br>
 * <embed src="images/FullMerge_EmptyRoot.svg" type="image/svg+xml"/>
 *
 * <embed src="images/FullMerge_SameRoot.svg" type="image/svg+xml"/>
 *
 * @param a the first {@link SingletonPredictionContext}
 * @param b the second {@link SingletonPredictionContext}
 * @param rootIsWildcard `true` if this is a local-context merge,
 * otherwise false to indicate a full-context merge
 */
export const mergeRoot = (a: SingletonPredictionContext, b: SingletonPredictionContext,
    rootIsWildcard: boolean): PredictionContext | null => {
    if (rootIsWildcard) {
        if (a === PredictionContext.EMPTY || b === PredictionContext.EMPTY) {
            return PredictionContext.EMPTY; // // + b =// or // a +// =//
        }
    } else {
        if (a === PredictionContext.EMPTY && b === PredictionContext.EMPTY) {
            return PredictionContext.EMPTY; // $ + $ = $
        }

        if (a === PredictionContext.EMPTY) { // $ + x = [$,x]
            const payloads = [b.returnState,
            PredictionContext.EMPTY_RETURN_STATE];
            const parents = [b.parent, null];

            return new ArrayPredictionContext(parents, payloads);
        }

        if (b === PredictionContext.EMPTY) { // x + $ = [$,x] ($ is always first if present)
            const payloads = [a.returnState, PredictionContext.EMPTY_RETURN_STATE];
            const parents = [a.parent, null];

            return new ArrayPredictionContext(parents, payloads);
        }
    }

    return null;
};
