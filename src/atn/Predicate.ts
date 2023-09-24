/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SemanticContext } from "./SemanticContext.js";

export class Predicate extends SemanticContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    isCtxDependent: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    predIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    ruleIndex: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(ruleIndex: any, predIndex: any, isCtxDependent: any) {
        super();
        this.ruleIndex = ruleIndex === undefined ? -1 : ruleIndex;
        this.predIndex = predIndex === undefined ? -1 : predIndex;
        this.isCtxDependent = isCtxDependent === undefined ? false : isCtxDependent; // e.g., $i ref in pred
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(parser: any, outerContext: any) {
        const localctx = this.isCtxDependent ? outerContext : null;
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return parser.sempred(localctx, this.ruleIndex, this.predIndex);
    }

    // @ts-expect-error TS(2425): Class 'SemanticContext' defines instance member pr... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    updateHashCode(hash: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        hash.update(this.ruleIndex, this.predIndex, this.isCtxDependent);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof Predicate)) {
            return false;
        } else {
            return this.ruleIndex === other.ruleIndex &&
                this.predIndex === other.predIndex &&
                this.isCtxDependent === other.isCtxDependent;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return "{" + this.ruleIndex + ":" + this.predIndex + "}?";
    }
}

/**
 * The default {@link SemanticContext}, which is semantically equivalent to
 * a predicate of the form {@code {true}?}
 */
// @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
SemanticContext.NONE = new Predicate();
