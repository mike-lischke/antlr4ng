/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFAState } from "../dfa/DFAState.js";
import { getCachedPredictionContext } from "./PredictionContextUtils.js";
import { HashMap } from "../misc/HashMap.js";
import { ATN } from "./ATN.js";
import { PredictionContextCache } from "./PredictionContextCache.js";
import { PredictionContext } from "./PredictionContext.js";

export class ATNSimulator {
    /** Must distinguish between missing edge and edge we know leads nowhere */

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly ERROR = new DFAState(0x7FFFFFFF);

    public readonly atn: ATN;

    /**
     * The context cache maps all PredictionContext objects that are ==
     * to a single cached copy. This cache is shared across all contexts
     * in all ATNConfigs in all DFA states.  We rebuild each ATNConfigSet
     * to use only cached nodes/graphs in addDFAState(). We don't want to
     * fill this during closure() since there are lots of contexts that
     * pop up but are not used ever again. It also greatly slows down closure().
     *
     * <p>This cache makes a huge difference in memory and a little bit in speed.
     * For the Java grammar on java.*, it dropped the memory requirements
     * at the end from 25M to 16M. We don't store any of the full context
     * graphs in the DFA because they are limited to local context only,
     * but apparently there's a lot of repetition there as well. We optimize
     * the config contexts before storing the config set in the DFA states
     * by literally rebuilding them with cached subgraphs only.</p>
     *
     * <p>I tried a cache for use during closure operations, that was
     * whacked after each adaptivePredict(). It cost a little bit
     * more time I think and doesn't save on the overall footprint
     * so it's not worth the complexity.</p>
     */
    protected readonly sharedContextCache: PredictionContextCache | null = null;

    public constructor(atn: ATN, sharedContextCache: PredictionContextCache | null) {

        this.atn = atn;
        this.sharedContextCache = sharedContextCache;

        return this;
    }

    public getCachedContext(context: PredictionContext): PredictionContext {
        if (this.sharedContextCache === null) {
            return context;
        }
        const visited = new HashMap<PredictionContext, PredictionContext>();

        return getCachedPredictionContext(context, this.sharedContextCache, visited);
    }
}
