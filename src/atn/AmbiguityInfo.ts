/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BitSet } from "../index.js";
import { DecisionEventInfo } from "./DecisionEventInfo.js";

/**
 * This class represents profiling event information for an ambiguity.
 * Ambiguities are decisions where a particular input resulted in an SLL
 * conflict, followed by LL prediction also reaching a conflict state
 * (indicating a true ambiguity in the grammar).
 *
 * This event may be reported during SLL prediction in cases where the
 * conflicting SLL configuration set provides sufficient information to
 * determine that the SLL conflict is truly an ambiguity. For example, if none
 * of the ATN configurations in the conflicting SLL configuration set have
 * traversed a global follow transition (i.e.
 * {@link ATNConfig.reachesIntoOuterContext} is 0 for all configurations), then
 * the result of SLL prediction for that input is known to be equivalent to the
 * result of LL prediction for that input.
 *
 * In some cases, the minimum represented alternative in the conflicting LL
 * configuration set is not equal to the minimum represented alternative in the
 * conflicting SLL configuration set. Grammars and inputs which result in this
 * scenario are unable to use {@link PredictionMode#SLL}, which in turn means
 * they cannot use the two-stage parsing strategy to improve parsing performance
 * for that input.
 *
 * @see ParserATNSimulator#reportAmbiguity
 * @see ANTLRErrorListener#reportAmbiguity
 */
export interface AmbiguityInfo extends DecisionEventInfo {
    /** The set of alternative numbers for this decision event that lead to a valid parse. */
    ambigAlts?: BitSet;
}
