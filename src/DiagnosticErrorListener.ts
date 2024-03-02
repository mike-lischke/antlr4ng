/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { BaseErrorListener } from "./BaseErrorListener.js";
import { Parser } from "./Parser.js";
import { ATNConfigSet } from "./atn/ATNConfigSet.js";
import { DFA } from "./dfa/DFA.js";
import { BitSet } from "./misc/BitSet.js";
import { Interval } from "./misc/Interval.js";

/**
 * This implementation of {@link ANTLRErrorListener} can be used to identify
 * certain potential correctness and performance problems in grammars. "Reports"
 * are made by calling {@link Parser#notifyErrorListeners} with the appropriate
 * message.
 *
 * - <b>Ambiguities</b>: These are cases where more than one path through the
 * grammar can match the input.
 * - <b>Weak context sensitivity</b>: These are cases where full-context
 * prediction resolved an SLL conflict to a unique alternative which equaled the
 * minimum alternative of the SLL conflict.
 * - <b>Strong (forced) context sensitivity</b>: These are cases where the
 * full-context prediction resolved an SLL conflict to a unique alternative,
 * and* the minimum alternative of the SLL conflict was found to not be
 * a truly viable alternative. Two-stage parsing cannot be used for inputs where
 * this situation occurs.
 *
 * @author Sam Harwell
 */
export class DiagnosticErrorListener extends BaseErrorListener {
    /**
     * When `true`, only exactly known ambiguities are reported.
     */
    protected readonly exactOnly: boolean;

    /**
     * Initializes a new instance of {@link DiagnosticErrorListener} which only
     * reports exact ambiguities.
     */
    public constructor();
    /**
     * Initializes a new instance of {@link DiagnosticErrorListener}, specifying
     * whether all ambiguities or only exact ambiguities are reported.
     *
     * @param exactOnly `true` to report only exact ambiguities, otherwise
     * `false` to report all ambiguities.
     */
    public constructor(exactOnly: boolean);
    public constructor(exactOnly?: boolean) {
        super();
        this.exactOnly = exactOnly ?? true;
    }

    public override reportAmbiguity = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        exact: boolean,
        ambigAlts: BitSet | undefined,
        configs: ATNConfigSet): void => {
        if (this.exactOnly && !exact) {
            return;
        }

        const decision = this.getDecisionDescription(recognizer, dfa);
        const conflictingAlts = this.getConflictingAlts(ambigAlts, configs);
        const text = recognizer.tokenStream?.getTextFromInterval(Interval.of(startIndex, stopIndex));
        const message = `reportAmbiguity d=${decision}: ambigAlts=${conflictingAlts}, input='${text}'`;
        recognizer.notifyErrorListeners(message, null, null);
    };

    public override reportAttemptingFullContext = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        _conflictingAlts: BitSet | undefined,
        _configs: ATNConfigSet | null): void => {
        const decision = this.getDecisionDescription(recognizer, dfa);
        const text = recognizer.tokenStream?.getTextFromInterval(Interval.of(startIndex, stopIndex));
        const message = `reportAttemptingFullContext d=${decision}, input='${text}'`;
        recognizer.notifyErrorListeners(message, null, null);
    };

    public override reportContextSensitivity = (recognizer: Parser,
        dfa: DFA,
        startIndex: number,
        stopIndex: number,
        _prediction: number,
        _configs: ATNConfigSet | null): void => {
        const decision = this.getDecisionDescription(recognizer, dfa);
        const text = recognizer.tokenStream?.getTextFromInterval(Interval.of(startIndex, stopIndex));
        const message = `reportContextSensitivity d=${decision}, input='${text}'`;
        recognizer.notifyErrorListeners(message, null, null);
    };

    protected getDecisionDescription = (recognizer: Parser, dfa: DFA): string => {
        const decision = dfa.decision;
        const ruleIndex = dfa.atnStartState!.ruleIndex;

        const ruleNames = recognizer.ruleNames;
        if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
            return decision.toString();
        }

        const ruleName = ruleNames[ruleIndex];
        if (ruleName.length === 0) {
            return decision.toString();
        }

        return `${decision} (${ruleName})`;
    };

    /**
     * Computes the set of conflicting or ambiguous alternatives from a
     * configuration set, if that information was not already provided by the
     * parser.
     *
     * @param reportedAlts The set of conflicting or ambiguous alternatives, as
     * reported by the parser.
     * @param configs The conflicting or ambiguous configuration set.
     * @returns Returns `reportedAlts` if it is not `null`, otherwise
     * returns the set of alternatives represented in `configs`.
     */
    protected getConflictingAlts = (reportedAlts: BitSet | undefined,
        configs: ATNConfigSet): BitSet | null => {
        if (reportedAlts) {
            return reportedAlts;
        }

        const result = new BitSet();
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < configs.configs.length; i++) {
            result.set(configs.configs[i].alt);
        }

        return result;
    };
};
