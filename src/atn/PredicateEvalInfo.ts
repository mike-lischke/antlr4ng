/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionEventInfo } from "./DecisionEventInfo.js";
import { SemanticContext } from "./SemanticContext.js";

/**
 * This interface represents profiling event information for semantic predicate
 * evaluations which occur during prediction.
 */
export interface PredicateEvalInfo extends DecisionEventInfo {
    /** The semantic context which was evaluated. */
    semctx: SemanticContext;

    /**
     * The alternative number for the decision which is guarded by the semantic
     * context {@link #semctx}. Note that other ATN
     * configurations may predict the same alternative which are guarded by
     * other semantic contexts and/or {@link SemanticContext#NONE}.
     */
    predictedAlt: number;

    /** The result of evaluating the semantic context {@link #semctx}. */
    evalResult: boolean;
}
