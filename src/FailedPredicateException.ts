/* eslint-disable jsdoc/require-jsdoc, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredicateTransition } from "./atn/PredicateTransition.js";
import { RecognitionException } from "./RecognitionException.js";

/**
 * A semantic predicate failed during validation. Validation of predicates
 * occurs when normally parsing the alternative just like matching a token.
 * Disambiguating predicate evaluation occurs when we test a predicate during
 * prediction.
 */
export class FailedPredicateException extends RecognitionException {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    offendingToken: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    predicate: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    predicateIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    ruleIndex: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(recognizer: any, predicate: any, message: any) {
        super({
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            message: formatMessage(predicate, message || null),
            // eslint-disable-next-line object-shorthand
            recognizer: recognizer,
            // eslint-disable-next-line no-underscore-dangle, comma-dangle
            input: recognizer.inputStream, ctx: recognizer._ctx
        });
        const s = recognizer.interpreter.atn.states[recognizer.state];
        const trans = s.transitions[0];
        if (trans instanceof PredicateTransition) {
            this.ruleIndex = trans.ruleIndex;
            this.predicateIndex = trans.predIndex;
        } else {
            this.ruleIndex = 0;
            this.predicateIndex = 0;
        }
        this.predicate = predicate;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.offendingToken = recognizer.getCurrentToken();
    }
}

// eslint-disable-next-line no-multiple-empty-lines

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function formatMessage(predicate: any, message: any) {
    if (message !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return message;
    } else {
        return "failed predicate: {" + predicate + "}?";
    }
}
