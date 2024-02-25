/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFAState } from "../dfa/DFAState.js";
import { getCachedPredictionContext } from "./PredictionContextUtils.js";
import { ATN } from "./ATN.js";
import { PredictionContextCache } from "./PredictionContextCache.js";
import { PredictionContext } from "./PredictionContext.js";
import { HashMap } from "../misc/HashMap.js";
import { ObjectEqualityComparator } from "../misc/ObjectEqualityComparator.js";

export abstract class ATNSimulator {
    /** Must distinguish between missing edge and edge we know leads nowhere */
    public static readonly ERROR = DFAState.fromState(0x7FFFFFFF);

    public readonly atn: ATN;

    /**
     * The context cache maps all PredictionContext objects that are ==
     * to a single cached copy. This cache is shared across all contexts
     * in all ATNConfigs in all DFA states.  We rebuild each ATNConfigSet
     * to use only cached nodes/graphs in addDFAState(). We don't want to
     * fill this during closure() since there are lots of contexts that
     * pop up but are not used ever again. It also greatly slows down closure().
     *
     * This cache makes a huge difference in memory and a little bit in speed.
     * For the Java grammar on java.*, it dropped the memory requirements
     * at the end from 25M to 16M. We don't store any of the full context
     * graphs in the DFA because they are limited to local context only,
     * but apparently there's a lot of repetition there as well. We optimize
     * the config contexts before storing the config set in the DFA states
     * by literally rebuilding them with cached subgraphs only.
     *
     * I tried a cache for use during closure operations, that was
     * whacked after each adaptivePredict(). It cost a little bit
     * more time I think and doesn't save on the overall footprint
     * so it's not worth the complexity.
     */
    public readonly sharedContextCache?: PredictionContextCache;

    public constructor(atn: ATN, sharedContextCache?: PredictionContextCache) {
        this.atn = atn;
        this.sharedContextCache = sharedContextCache;

        return this;
    }

    public getCachedContext(context: PredictionContext): PredictionContext {
        if (!this.sharedContextCache) {
            return context;
        }
        const visited = new HashMap<PredictionContext, PredictionContext>(ObjectEqualityComparator.instance);

        return getCachedPredictionContext(context, this.sharedContextCache, visited);
    }

    /**
     * Clear the DFA cache used by the current instance. Since the DFA cache may
     * be shared by multiple ATN simulators, this method may affect the
     * performance (but not accuracy) of other parsers which are being used
     * concurrently.
     *
     * @throws UnsupportedOperationException if the current instance does not
     * support clearing the DFA.
     */
    public abstract clearDFA(): void;

    public abstract reset(): void;
}
