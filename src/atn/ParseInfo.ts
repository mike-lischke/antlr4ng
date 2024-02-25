/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns */

import { DecisionInfo, ProfilingATNSimulator } from "./index.js";

/**
 * This class provides access to specific and aggregate statistics gathered
 * during profiling of a parser.
 */
export class ParseInfo {
    protected readonly atnSimulator: ProfilingATNSimulator;

    public constructor(atnSimulator: ProfilingATNSimulator) {
        this.atnSimulator = atnSimulator;
    }

    /**
     * Gets an array of {@link DecisionInfo} instances containing the profiling
     * information gathered for each decision in the ATN.
     *
     * @returns An array of {@link DecisionInfo} instances, indexed by decision
     * number.
     */
    public getDecisionInfo(): DecisionInfo[] {
        return this.atnSimulator.getDecisionInfo();
    }

    /**
     * Gets the decision numbers for decisions that required one or more
     * full-context predictions during parsing. These are decisions for which
     * {@link DecisionInfo#llFallback} is non-zero.
     *
     * @returns A list of decision numbers which required one or more
     * full-context predictions during parsing.
     */
    public getLLDecisions(): number[] {
        const decisions = this.atnSimulator.getDecisionInfo();
        const result = new Array<number>();
        for (let i = 0; i < decisions.length; i++) {
            const fallBack = decisions[i].llFallback;
            if (fallBack > 0) {
                result.push(i);
            }
        }

        return result;
    }

    /**
     * Gets the total time spent during prediction across all decisions made
     * during parsing. This value is the sum of
     * {@link DecisionInfo#timeInPrediction} for all decisions.
     */
    public getTotalTimeInPrediction(): number {
        const decisions = this.atnSimulator.getDecisionInfo();
        let t = 0;
        for (const decision of decisions) {
            t += decision.timeInPrediction;
        }

        return t;
    }

    /**
     * Gets the total number of SLL lookahead operations across all decisions
     * made during parsing. This value is the sum of
     * {@link DecisionInfo#sllTotalLook} for all decisions.
     */
    public getTotalSLLLookaheadOps(): number {
        const decisions = this.atnSimulator.getDecisionInfo();
        let k = 0;
        for (const decision of decisions) {
            k += decision.sllTotalLook;
        }

        return k;
    }

    /**
     * Gets the total number of LL lookahead operations across all decisions
     * made during parsing. This value is the sum of
     * {@link DecisionInfo#llTotalLook} for all decisions.
     */
    public getTotalLLLookaheadOps(): number {
        const decisions = this.atnSimulator.getDecisionInfo();
        let k = 0;
        for (const decision of decisions) {
            k += decision.llTotalLook;
        }

        return k;
    }

    /**
     * Gets the total number of ATN lookahead operations for SLL prediction
     * across all decisions made during parsing.
     */
    public getTotalSLLATNLookaheadOps(): number {
        const decisions = this.atnSimulator.getDecisionInfo();
        let k = 0;
        for (const decision of decisions) {
            k += decision.sllATNTransitions;
        }

        return k;
    }

    /**
     * Gets the total number of ATN lookahead operations for LL prediction
     * across all decisions made during parsing.
     */
    public getTotalLLATNLookaheadOps(): number {
        const decisions = this.atnSimulator.getDecisionInfo();
        let k = 0;
        for (const decision of decisions) {
            k += decision.llATNTransitions;
        }

        return k;
    }

    /**
     * Gets the total number of ATN lookahead operations for SLL and LL
     * prediction across all decisions made during parsing.
     *
     *
     * This value is the sum of {@link #getTotalSLLATNLookaheadOps} and
     * {@link #getTotalLLATNLookaheadOps}.
     */
    public getTotalATNLookaheadOps(): number {
        const decisions = this.atnSimulator.getDecisionInfo();
        let k = 0;
        for (const decision of decisions) {
            k += decision.sllATNTransitions;
            k += decision.llATNTransitions;
        }

        return k;
    }

    /**
     * Gets the total number of DFA states stored in the DFA cache for all
     * decisions in the ATN.
     */
    public getDFASize(): number;
    /**
     * Gets the total number of DFA states stored in the DFA cache for a
     * particular decision.
     */
    public getDFASize(decision: number): number;
    public getDFASize(decision?: number): number {
        if (decision === undefined) {

            let n = 0;
            const decisionToDFA = this.atnSimulator.decisionToDFA;
            for (let i = 0; i < decisionToDFA.length; i++) {
                n += this.getDFASize(i);
            }

            return n;
        } else {
            const decisionToDFA = this.atnSimulator.decisionToDFA[decision];

            return decisionToDFA.length;
        }
    }

}
