/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SemanticContext } from "./SemanticContext.js";

export class PrecedencePredicate extends SemanticContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    precedence: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(precedence: any) {
        super();
        this.precedence = precedence === undefined ? 0 : precedence;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(parser: any, outerContext: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return parser.precpred(outerContext, this.precedence);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evalPrecedence(parser: any, outerContext: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (parser.precpred(outerContext, this.precedence)) {
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return SemanticContext.NONE;
        } else {
            return null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    compareTo(other: any) {
        return this.precedence - other.precedence;
    }

    // @ts-expect-error TS(2425): Class 'SemanticContext' defines instance member pr... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    updateHashCode(hash: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        hash.update(this.precedence);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof PrecedencePredicate)) {
            return false;
        } else {
            return this.precedence === other.precedence;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return "{" + this.precedence + ">=prec}?";
    }
}

// HORRIBLE workaround circular import, avoiding dynamic import
// @ts-expect-error TS(2339): Property 'PrecedencePredicate' does not exist on t... Remove this comment to see the full error message
SemanticContext.PrecedencePredicate = PrecedencePredicate;
