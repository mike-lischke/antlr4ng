/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { PredicateTransition } from "./atn/PredicateTransition.js";
import { Parser } from "./Parser.js";
import { RecognitionException } from "./RecognitionException.js";

/**
 * A semantic predicate failed during validation. Validation of predicates
 * occurs when normally parsing the alternative just like matching a token.
 * Disambiguating predicate evaluation occurs when we test a predicate during
 * prediction.
 */
export class FailedPredicateException extends RecognitionException {
    public readonly ruleIndex: number = 0;
    public readonly predicateIndex: number = 0;
    public readonly predicate?: string;

    public constructor(recognizer: Parser, predicate?: string, message: string | null = null) {
        super({
            message: formatMessage(predicate ?? "no predicate", message ?? null),
            recognizer,
            input: recognizer.inputStream, ctx: recognizer.context,
        });

        const s = recognizer.atn.states[recognizer.state]!;
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

const formatMessage = (predicate: string | null, message: string | null) => {
    if (message !== null) {
        return message;
    }

    return "failed predicate: {" + predicate + "}?";
};
