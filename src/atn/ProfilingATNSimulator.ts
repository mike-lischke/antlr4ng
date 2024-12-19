/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param, no-underscore-dangle */

import { ParserRuleContext } from "../ParserRuleContext.js";
import { TokenStream } from "../TokenStream.js";
import { DFAState } from "../dfa/DFAState.js";
import { Parser, DFA, BitSet } from "../index.js";
import { ATNConfigSet } from "./ATNConfigSet.js";
import { ATNSimulator } from "./ATNSimulator.js";
import { DecisionInfo } from "./DecisionInfo.js";
import { ParserATNSimulator } from "./ParserATNSimulator.js";

export class ProfilingATNSimulator extends ParserATNSimulator {
    protected readonly decisions: DecisionInfo[];
    protected numDecisions: number = 0;

    protected currentDecision: number = 0;
    protected currentState?: DFAState;

    /**
     * At the point of LL failover, we record how SLL would resolve the conflict so that
     *  we can determine whether or not a decision / input pair is context-sensitive.
     *  If LL gives a different result than SLL's predicted alternative, we have a
     *  context sensitivity for sure. The converse is not necessarily true, however.
     *  It's possible that after conflict resolution chooses minimum alternatives,
     *  SLL could get the same answer as LL. Regardless of whether or not the result indicates
     *  an ambiguity, it is not treated as a context sensitivity because LL prediction
     *  was not required in order to produce a correct prediction for this decision and input sequence.
     *  It may in fact still be a context sensitivity but we don't know by looking at the
     *  minimum alternatives for the current input.
     */
    protected conflictingAltResolvedBySLL: number | undefined;

    private sllStopIndex: number = 0;
    private llStopIndex: number = 0;

    public constructor(parser: Parser) {
        const sharedContextCache = parser.interpreter.sharedContextCache;
        super(parser, parser.interpreter.atn, parser.interpreter.decisionToDFA, sharedContextCache);
        if (sharedContextCache) {
            this.numDecisions = this.atn.decisionToState.length;
            this.decisions = new Array<DecisionInfo>(this.numDecisions);
            for (let i = 0; i < this.numDecisions; i++) {
                this.decisions[i] = new DecisionInfo(i);
            }
        }
    }

    public override adaptivePredict(input: TokenStream, decision: number, outerContext: ParserRuleContext): number {
        try {
            this.sllStopIndex = -1;
            this.llStopIndex = -1;
            this.currentDecision = decision;

            // JavaScript doesn't have native support for nanosecond precision timers.
            // The highest precision timer available in JavaScript is performance.now(),
            const start = performance.now();
            const alt = super.adaptivePredict(input, decision, outerContext);
            const stop = performance.now();

            this.decisions[decision].timeInPrediction += (stop - start);
            this.decisions[decision].invocations++;

            const sllLook = this.sllStopIndex - this.predictionState!.startIndex + 1;
            this.decisions[decision].sllTotalLook += sllLook;
            this.decisions[decision].sllMinLook = this.decisions[decision].sllMinLook === 0
                ? sllLook
                : Math.min(this.decisions[decision].sllMinLook, sllLook);

            if (sllLook > this.decisions[decision].sllMaxLook) {
                this.decisions[decision].sllMaxLook = sllLook;
                this.decisions[decision].sllMaxLookEvent = {
                    decision,
                    configs: null,
                    predictedAlt: alt,
                    input,
                    startIndex: this.predictionState!.startIndex,
                    stopIndex: this.sllStopIndex,
                    fullCtx: false,

                };
            }

            if (this.llStopIndex >= 0) {
                const llLook = this.llStopIndex - this.predictionState!.startIndex + 1;
                this.decisions[decision].llTotalLook += llLook;
                this.decisions[decision].llMinLook = this.decisions[decision].llMinLook === 0
                    ? llLook
                    : Math.min(this.decisions[decision].llMinLook, llLook);

                if (llLook > this.decisions[decision].llMaxLook) {
                    this.decisions[decision].llMaxLook = llLook;
                    this.decisions[decision].llMaxLookEvent = {
                        decision,
                        configs: null,
                        predictedAlt: alt,
                        input,
                        startIndex: this.predictionState!.startIndex,
                        stopIndex: this.llStopIndex,
                        fullCtx: true,
                    };
                }
            }

            return alt;
        } finally {
            this.currentDecision = -1;
        }
    }

    public override getExistingTargetState(previousD: DFAState, t: number): DFAState | undefined {
        // This method is called after each time the input position advances during SLL prediction.
        this.sllStopIndex = this.predictionState!.input!.index;

        const existingTargetState = super.getExistingTargetState(previousD, t);

        if (existingTargetState !== undefined) {
            this.decisions[this.currentDecision].sllDFATransitions++; // Count only if we transition over a DFA state.
            if (existingTargetState === ATNSimulator.ERROR) {
                this.decisions[this.currentDecision].errors.push({
                    decision: this.currentDecision,
                    configs: previousD.configs,
                    input: this.predictionState!.input!,
                    startIndex: this.predictionState!.startIndex,
                    stopIndex: this.sllStopIndex,
                    fullCtx: false,
                });
            }
        }

        this.currentState = existingTargetState;

        return existingTargetState;
    }

    public override computeTargetState(dfa: DFA, previousD: DFAState, t: number): DFAState {
        const state = super.computeTargetState(dfa, previousD, t);
        this.currentState = state;

        return state;
    }

    public override computeReachSet(closure: ATNConfigSet, t: number, fullCtx: boolean): ATNConfigSet | null {
        if (fullCtx && this.predictionState?.input) {
            this.llStopIndex = this.predictionState.input.index;
        }

        const reachConfigs = super.computeReachSet(closure, t, fullCtx);
        if (this.predictionState?.input) {
            if (fullCtx) {
                this.decisions[this.currentDecision].llATNTransitions++;

                if (reachConfigs === null) {
                    this.decisions[this.currentDecision].errors.push({
                        decision: this.currentDecision,
                        configs: closure,
                        input: this.predictionState.input,
                        startIndex: this.predictionState.startIndex,
                        stopIndex: this.sllStopIndex,
                        fullCtx: true,
                    });
                }
            } else {
                this.decisions[this.currentDecision].sllATNTransitions++;
                if (reachConfigs === null) {
                    this.decisions[this.currentDecision].errors.push({
                        decision: this.currentDecision,
                        configs: closure,
                        input: this.predictionState.input,
                        startIndex: this.predictionState.startIndex,
                        stopIndex: this.sllStopIndex,
                        fullCtx: false,
                    });
                }
            }
        }

        return reachConfigs;
    }

    public override reportAttemptingFullContext(dfa: DFA, conflictingAlts: BitSet | null, configs: ATNConfigSet,
        startIndex: number, stopIndex: number): void {
        if (conflictingAlts !== null) {
            this.conflictingAltResolvedBySLL = conflictingAlts.nextSetBit(0);
        } else {
            this.conflictingAltResolvedBySLL = configs.getAlts().nextSetBit(0);
        }

        this.decisions[this.currentDecision].llFallback++;
        if (conflictingAlts) {
            super.reportAttemptingFullContext(dfa, conflictingAlts, configs, startIndex, stopIndex);
        }
    }

    public override reportContextSensitivity(dfa: DFA, prediction: number, configs: ATNConfigSet, startIndex: number,
        stopIndex: number): void {
        if (prediction !== this.conflictingAltResolvedBySLL && this.predictionState!.input) {
            this.decisions[this.currentDecision].contextSensitivities.push({
                decision: this.currentDecision,
                configs,
                input: this.predictionState!.input,
                startIndex,
                stopIndex,
                fullCtx: true,
            });
        }

        super.reportContextSensitivity(dfa, prediction, configs, startIndex, stopIndex);
    }

    public override reportAmbiguity(dfa: DFA, state: DFAState, startIndex: number, stopIndex: number, exact: boolean,
        ambigAlts: BitSet | undefined, configs: ATNConfigSet): void {
        let prediction: number | undefined;

        if (ambigAlts) {
            prediction = ambigAlts.nextSetBit(0);
        } else {
            prediction = configs.getAlts().nextSetBit(0);
        }

        if (this.predictionState?.input) {
            if (configs.fullCtx && prediction !== this.conflictingAltResolvedBySLL) {
                this.decisions[this.currentDecision].contextSensitivities.push({
                    decision: this.currentDecision,
                    configs,
                    input: this.predictionState.input,
                    startIndex,
                    stopIndex,
                    fullCtx: true,
                });
            }

            this.decisions[this.currentDecision].ambiguities.push({
                ambigAlts,
                decision: this.currentDecision,
                configs,
                input: this.predictionState.input,
                startIndex,
                stopIndex,
                fullCtx: configs.fullCtx,
            });
        }
        super.reportAmbiguity(dfa, state, startIndex, stopIndex, exact, ambigAlts, configs);
    }

    public getDecisionInfo(): DecisionInfo[] {
        return this.decisions;
    }

    public getCurrentState(): DFAState | undefined {
        return this.currentState;
    }
}
