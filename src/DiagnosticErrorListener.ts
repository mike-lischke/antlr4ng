/* eslint-disable jsdoc/no-undefined-types, jsdoc/require-returns, jsdoc/check-tag-names, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { BaseErrorListener } from './BaseErrorListener.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { Interval } from './misc/Interval.js';
import { BitSet } from "./misc/BitSet.js";

/**
 * This implementation of {@link ANTLRErrorListener} can be used to identify
 *  certain potential correctness and performance problems in grammars. "Reports"
 *  are made by calling {@link Parser//notifyErrorListeners} with the appropriate
 *  message.
 *
 *  <ul>
 *  <li><b>Ambiguities</b>: These are cases where more than one path through the
 *  grammar can match the input.</li>
 *  <li><b>Weak context sensitivity</b>: These are cases where full-context
 *  prediction resolved an SLL conflict to a unique alternative which equaled the
 *  minimum alternative of the SLL conflict.</li>
 *  <li><b>Strong (forced) context sensitivity</b>: These are cases where the
 *  full-context prediction resolved an SLL conflict to a unique alternative,
 *  <em>and</em> the minimum alternative of the SLL conflict was found to not be
 *  a truly viable alternative. Two-stage parsing cannot be used for inputs where
 *  this situation occurs.</li>
 *  </ul>
 */
export class DiagnosticErrorListener extends BaseErrorListener {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    exactOnly: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(exactOnly: any) {
        super();
        exactOnly = exactOnly || true;
        // whether all ambiguities or only exact ambiguities are reported.
        this.exactOnly = exactOnly;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    reportAmbiguity(recognizer: any, dfa: any, startIndex: any, stopIndex: any, exact: any, ambigAlts: any, configs: any) {
        if (this.exactOnly && !exact) {
            return;
        }
        const msg = "reportAmbiguity d=" +
            this.getDecisionDescription(recognizer, dfa) +
            ": ambigAlts=" +
            this.getConflictingAlts(ambigAlts, configs) +
            ", input='" +
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            recognizer.tokenStream.getText(new Interval(startIndex, stopIndex)) + "'";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        recognizer.notifyErrorListeners(msg);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    reportAttemptingFullContext(recognizer: any, dfa: any, startIndex: any, stopIndex: any, conflictingAlts: any, configs: any) {
        const msg = "reportAttemptingFullContext d=" +
            this.getDecisionDescription(recognizer, dfa) +
            ", input='" +
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            recognizer.tokenStream.getText(new Interval(startIndex, stopIndex)) + "'";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        recognizer.notifyErrorListeners(msg);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    reportContextSensitivity(recognizer: any, dfa: any, startIndex: any, stopIndex: any, prediction: any, configs: any) {
        const msg = "reportContextSensitivity d=" +
            this.getDecisionDescription(recognizer, dfa) +
            ", input='" +
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            recognizer.tokenStream.getText(new Interval(startIndex, stopIndex)) + "'";
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        recognizer.notifyErrorListeners(msg);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getDecisionDescription(recognizer: any, dfa: any) {
        const decision = dfa.decision;
        const ruleIndex = dfa.atnStartState.ruleIndex;

        const ruleNames = recognizer.ruleNames;
        if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
            return "" + decision;
        }
        const ruleName = ruleNames[ruleIndex] || null;
        if (ruleName === null || ruleName.length === 0) {
            return "" + decision;
        }
        // eslint-disable-next-line padding-line-between-statements
        return `${decision} (${ruleName})`;
    }

    /**
     * Computes the set of conflicting or ambiguous alternatives from a
     * configuration set, if that information was not already provided by the
     * parser.
     *
     * @param reportedAlts The set of conflicting or ambiguous alternatives, as
     * reported by the parser.
     * @param configs The conflicting or ambiguous configuration set.
     * @return Returns {@code reportedAlts} if it is not {@code null}, otherwise
     * returns the set of alternatives represented in {@code configs}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getConflictingAlts(reportedAlts: any, configs: any) {
        if (reportedAlts !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return reportedAlts;
        }
        const result = new BitSet();
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < configs.items.length; i++) {
            // @ts-expect-error TS(2339): Property 'add' does not exist on type 'BitSet'.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            result.add(configs.items[i].alt);
        }
        // eslint-disable-next-line padding-line-between-statements
        return `{${result.values().join(", ")}}`;
    }
}
