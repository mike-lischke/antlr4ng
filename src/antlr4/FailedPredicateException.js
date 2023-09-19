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

    constructor(recognizer, predicate, message) {
        super({
            message: formatMessage(predicate, message || null),
            recognizer: recognizer,
            input: recognizer.getInputStream(), ctx: recognizer._ctx
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
        this.offendingToken = recognizer.getCurrentToken();
    }
}


function formatMessage(predicate, message) {
    if (message !== null) {
        return message;
    } else {
        return "failed predicate: {" + predicate + "}?";
    }
}
