/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SemanticContext } from "./SemanticContext.js";

export class PrecedencePredicate extends SemanticContext {
    precedence: any;

    constructor(precedence: any) {
        super();
        this.precedence = precedence === undefined ? 0 : precedence;
    }

    evaluate(parser: any, outerContext: any) {
        return parser.precpred(outerContext, this.precedence);
    }

    evalPrecedence(parser: any, outerContext: any) {
        if (parser.precpred(outerContext, this.precedence)) {
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            return SemanticContext.NONE;
        } else {
            return null;
        }
    }

    compareTo(other: any) {
        return this.precedence - other.precedence;
    }

    // @ts-expect-error TS(2425): Class 'SemanticContext' defines instance member pr... Remove this comment to see the full error message
    updateHashCode(hash: any) {
        hash.update(this.precedence);
    }

    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof PrecedencePredicate)) {
            return false;
        } else {
            return this.precedence === other.precedence;
        }
    }

    toString() {
        return "{" + this.precedence + ">=prec}?";
    }
}

// HORRIBLE workaround circular import, avoiding dynamic import
// @ts-expect-error TS(2339): Property 'PrecedencePredicate' does not exist on t... Remove this comment to see the full error message
SemanticContext.PrecedencePredicate = PrecedencePredicate;
