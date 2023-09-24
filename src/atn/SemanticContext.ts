/* eslint-disable jsdoc/no-undefined-types, jsdoc/require-param, jsdoc/require-returns, jsdoc/check-tag-names, jsdoc/require-jsdoc, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line max-classes-per-file
import { equalArrays } from "../utils/equalArrays.js";
import { HashCode } from "../misc/HashCode.js";
import { HashSet } from "../misc/HashSet.js";

/**
 * A tree structure used to record the semantic context in which
 * an ATN configuration is valid.  It's either a single predicate,
 * a conjunction {@code p1&&p2}, or a sum of products {@code p1||p2}.
 *
 * <p>I have scoped the {@link AND}, {@link OR}, and {@link Predicate} subclasses of
 * {@link SemanticContext} within the scope of this outer class.</p>
 */
export class SemanticContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    updateHashCode: any;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    hashCode() {
        const hash = new HashCode();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.updateHashCode(hash);
        // eslint-disable-next-line padding-line-between-statements
        return hash.finish();
    }

    /**
     * For context independent predicates, we evaluate them without a local
     * context (i.e., null context). That way, we can evaluate them without
     * having to create proper rule-specific context during prediction (as
     * opposed to the parser, which creates them naturally). In a practical
     * sense, this avoids a cast exception from RuleContext to myruleContext.
     *
     * <p>For context dependent predicates, we must pass in a local context so that
     * references such as $arg evaluate properly as _localctx.arg. We only
     * capture context dependent predicates in the context in which we begin
     * prediction, so we passed in the outer context here in case of context
     * dependent predicate evaluation.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    evaluate(parser: any, outerContext: any) { }

    /**
     * Evaluate the precedence predicates for the context and reduce the result.
     *
     * @param parser The parser instance.
     * @param outerContext The current parser context object.
     * @return The simplified semantic context after precedence predicates are
     * evaluated, which will be one of the following values.
     * <ul>
     * <li>{@link //NONE}: if the predicate simplifies to {@code true} after
     * precedence predicates are evaluated.</li>
     * <li>{@code null}: if the predicate simplifies to {@code false} after
     * precedence predicates are evaluated.</li>
     * <li>{@code this}: if the semantic context is not changed as a result of
     * precedence predicate evaluation.</li>
     * <li>A non-{@code null} {@link SemanticContext}: the new simplified
     * semantic context after precedence predicates are evaluated.</li>
     * </ul>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    evalPrecedence(parser: any, outerContext: any) {
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    static andContext(a: any, b: any) {
        // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
        if (a === null || a === SemanticContext.NONE) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return b;
        }
        // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
        if (b === null || b === SemanticContext.NONE) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return a;
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const result = new AND(a, b);
        if (result.opnds.length === 1) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result.opnds[0];
        } else {
            return result;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    static orContext(a: any, b: any) {
        if (a === null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return b;
        }
        if (b === null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return a;
        }
        // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
        if (a === SemanticContext.NONE || b === SemanticContext.NONE) {
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return SemanticContext.NONE;
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const result = new OR(a, b);
        if (result.opnds.length === 1) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result.opnds[0];
        } else {
            return result;
        }
    }
}

class AND extends SemanticContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    opnds: any;
    /**
     * A semantic context which is true whenever none of the contained contexts
     * is false
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    constructor(a: any, b: any) {
        super();
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        const operands = new HashSet();
        if (a instanceof AND) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, array-callback-return, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
            a.opnds.map(function (o: any) {
                operands.add(o);
            });
        } else {
            operands.add(a);
        }
        if (b instanceof AND) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, array-callback-return, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
            b.opnds.map(function (o: any) {
                operands.add(o);
            });
        } else {
            operands.add(b);
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const precedencePredicates = filterPrecedencePredicates(operands);
        if (precedencePredicates.length > 0) {
            // interested in the transition with the lowest precedence
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let reduced: any = null;
            // @ts-expect-error TS(7006): Parameter 'p' implicitly has an 'any' type.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, array-callback-return, prefer-arrow/prefer-arrow-functions
            precedencePredicates.map(function (p) {
                if (reduced === null || p.precedence < reduced.precedence) {
                    reduced = p;
                }
            });
            operands.add(reduced);
        }
        this.opnds = Array.from(operands.values());
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof AND)) {
            return false;
        } else {
            return equalArrays(this.opnds, other.opnds);
        }
    }

    // @ts-expect-error TS(2425): Class 'SemanticContext' defines instance member pr... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    updateHashCode(hash: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        hash.update(this.opnds, "AND");
    }

    /**
     * {@inheritDoc}
     *
     * <p>
     * The evaluation of predicates by this context is short-circuiting, but
     * unordered.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(parser: any, outerContext: any) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.opnds.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (!this.opnds[i].evaluate(parser, outerContext)) {
                return false;
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evalPrecedence(parser: any, outerContext: any) {
        let differs = false;
        const operands = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.opnds.length; i++) {
            const context = this.opnds[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const evaluated = context.evalPrecedence(parser, outerContext);
            // @ts-expect-error TS(2447): The '|=' operator is not allowed for boolean types... Remove this comment to see the full error message
            differs |= (evaluated !== context);
            if (evaluated === null) {
                // The AND context is false if any element is false
                return null;
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            } else if (evaluated !== SemanticContext.NONE) {
                // Reduce the result by skipping true elements
                operands.push(evaluated);
            }
        }
        if (!differs) {
            return this;
        }
        if (operands.length === 0) {
            // all elements were true, so the AND context is true
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return SemanticContext.NONE;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = null;
        // eslint-disable-next-line array-callback-return, prefer-arrow/prefer-arrow-functions
        operands.map(function (o) {
            result = result === null ? o : SemanticContext.andContext(result, o);
        });
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    toString() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, arrow-body-style
        const s = this.opnds.map((o: any) => o.toString());
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return (s.length > 3 ? s.slice(3) : s).join("&&");
    }
}

class OR extends SemanticContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    opnds: any;
    /**
     * A semantic context which is true whenever at least one of the contained
     * contexts is true
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    constructor(a: any, b: any) {
        super();
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        const operands = new HashSet();
        if (a instanceof OR) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, array-callback-return, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
            a.opnds.map(function (o: any) {
                operands.add(o);
            });
        } else {
            operands.add(a);
        }
        if (b instanceof OR) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, array-callback-return, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
            b.opnds.map(function (o: any) {
                operands.add(o);
            });
        } else {
            operands.add(b);
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const precedencePredicates = filterPrecedencePredicates(operands);
        if (precedencePredicates.length > 0) {
            // interested in the transition with the highest precedence
            // @ts-expect-error TS(7006): Parameter 'a' implicitly has an 'any' type.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, prefer-arrow/prefer-arrow-functions
            const s = precedencePredicates.sort(function (a, b) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
                return a.compareTo(b);
            });
            const reduced = s[s.length - 1];
            operands.add(reduced);
        }
        this.opnds = Array.from(operands.values());
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof OR)) {
            return false;
        } else {
            return equalArrays(this.opnds, other.opnds);
        }
    }

    // @ts-expect-error TS(2425): Class 'SemanticContext' defines instance member pr... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    updateHashCode(hash: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        hash.update(this.opnds, "OR");
    }

    /**
     * <p>
     * The evaluation of predicates by this context is short-circuiting, but
     * unordered.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(parser: any, outerContext: any) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.opnds.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (this.opnds[i].evaluate(parser, outerContext)) {
                return true;
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evalPrecedence(parser: any, outerContext: any) {
        let differs = false;
        const operands = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.opnds.length; i++) {
            const context = this.opnds[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const evaluated = context.evalPrecedence(parser, outerContext);
            // @ts-expect-error TS(2447): The '|=' operator is not allowed for boolean types... Remove this comment to see the full error message
            differs |= (evaluated !== context);
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            if (evaluated === SemanticContext.NONE) {
                // The OR context is true if any element is true
                // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return SemanticContext.NONE;
            } else if (evaluated !== null) {
                // Reduce the result by skipping false elements
                operands.push(evaluated);
            }
        }
        if (!differs) {
            return this;
        }
        if (operands.length === 0) {
            // all elements were false, so the OR context is false
            return null;
        }
        const result = null;
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        operands.map(function (o) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result === null ? o : SemanticContext.orContext(result, o);
        });
        // eslint-disable-next-line padding-line-between-statements
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    toString() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, arrow-body-style
        const s = this.opnds.map((o: any) => o.toString());
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return (s.length > 3 ? s.slice(3) : s).join("||");
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function filterPrecedencePredicates(set: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, array-callback-return, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    set.values().map(function (context: any) {
        // @ts-expect-error TS(2339): Property 'PrecedencePredicate' does not exist on t... Remove this comment to see the full error message
        if (context instanceof SemanticContext.PrecedencePredicate) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            result.push(context);
        }
    });
    // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
    return result;
}
