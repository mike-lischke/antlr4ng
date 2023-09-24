/* eslint-disable jsdoc/no-undefined-types, jsdoc/require-param, jsdoc/require-returns, jsdoc/check-tag-names, jsdoc/require-jsdoc */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

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
    updateHashCode: any;

    hashCode() {
        const hash = new HashCode();
        this.updateHashCode(hash);
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
    evalPrecedence(parser: any, outerContext: any) {
        return this;
    }

    static andContext(a: any, b: any) {
        // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
        if (a === null || a === SemanticContext.NONE) {
            return b;
        }
        // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
        if (b === null || b === SemanticContext.NONE) {
            return a;
        }
        const result = new AND(a, b);
        if (result.opnds.length === 1) {
            return result.opnds[0];
        } else {
            return result;
        }
    }

    static orContext(a: any, b: any) {
        if (a === null) {
            return b;
        }
        if (b === null) {
            return a;
        }
        // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
        if (a === SemanticContext.NONE || b === SemanticContext.NONE) {
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            return SemanticContext.NONE;
        }
        const result = new OR(a, b);
        if (result.opnds.length === 1) {
            return result.opnds[0];
        } else {
            return result;
        }
    }
}

class AND extends SemanticContext {
    opnds: any;
    /**
     * A semantic context which is true whenever none of the contained contexts
     * is false
     */
    constructor(a: any, b: any) {
        super();
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        const operands = new HashSet();
        if (a instanceof AND) {
            a.opnds.map(function (o: any) {
                operands.add(o);
            });
        } else {
            operands.add(a);
        }
        if (b instanceof AND) {
            b.opnds.map(function (o: any) {
                operands.add(o);
            });
        } else {
            operands.add(b);
        }
        const precedencePredicates = filterPrecedencePredicates(operands);
        if (precedencePredicates.length > 0) {
            // interested in the transition with the lowest precedence
            let reduced: any = null;
            // @ts-expect-error TS(7006): Parameter 'p' implicitly has an 'any' type.
            precedencePredicates.map(function (p) {
                if (reduced === null || p.precedence < reduced.precedence) {
                    reduced = p;
                }
            });
            operands.add(reduced);
        }
        this.opnds = Array.from(operands.values());
    }

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
    updateHashCode(hash: any) {
        hash.update(this.opnds, "AND");
    }

    /**
     * {@inheritDoc}
     *
     * <p>
     * The evaluation of predicates by this context is short-circuiting, but
     * unordered.</p>
     */
    evaluate(parser: any, outerContext: any) {
        for (let i = 0; i < this.opnds.length; i++) {
            if (!this.opnds[i].evaluate(parser, outerContext)) {
                return false;
            }
        }
        return true;
    }

    evalPrecedence(parser: any, outerContext: any) {
        let differs = false;
        const operands = [];
        for (let i = 0; i < this.opnds.length; i++) {
            const context = this.opnds[i];
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
            return SemanticContext.NONE;
        }
        let result: any = null;
        operands.map(function (o) {
            result = result === null ? o : SemanticContext.andContext(result, o);
        });
        return result;
    }

    toString() {
        const s = this.opnds.map((o: any) => o.toString());
        return (s.length > 3 ? s.slice(3) : s).join("&&");
    }
}

class OR extends SemanticContext {
    opnds: any;
    /**
     * A semantic context which is true whenever at least one of the contained
     * contexts is true
     */
    constructor(a: any, b: any) {
        super();
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        const operands = new HashSet();
        if (a instanceof OR) {
            a.opnds.map(function (o: any) {
                operands.add(o);
            });
        } else {
            operands.add(a);
        }
        if (b instanceof OR) {
            b.opnds.map(function (o: any) {
                operands.add(o);
            });
        } else {
            operands.add(b);
        }

        const precedencePredicates = filterPrecedencePredicates(operands);
        if (precedencePredicates.length > 0) {
            // interested in the transition with the highest precedence
            // @ts-expect-error TS(7006): Parameter 'a' implicitly has an 'any' type.
            const s = precedencePredicates.sort(function (a, b) {
                return a.compareTo(b);
            });
            const reduced = s[s.length - 1];
            operands.add(reduced);
        }
        this.opnds = Array.from(operands.values());
    }

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
    updateHashCode(hash: any) {
        hash.update(this.opnds, "OR");
    }

    /**
     * <p>
     * The evaluation of predicates by this context is short-circuiting, but
     * unordered.</p>
     */
    evaluate(parser: any, outerContext: any) {
        for (let i = 0; i < this.opnds.length; i++) {
            if (this.opnds[i].evaluate(parser, outerContext)) {
                return true;
            }
        }
        return false;
    }

    evalPrecedence(parser: any, outerContext: any) {
        let differs = false;
        const operands = [];
        for (let i = 0; i < this.opnds.length; i++) {
            const context = this.opnds[i];
            const evaluated = context.evalPrecedence(parser, outerContext);
            // @ts-expect-error TS(2447): The '|=' operator is not allowed for boolean types... Remove this comment to see the full error message
            differs |= (evaluated !== context);
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            if (evaluated === SemanticContext.NONE) {
                // The OR context is true if any element is true
                // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
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
        operands.map(function (o) {
            return result === null ? o : SemanticContext.orContext(result, o);
        });
        return result;
    }

    toString() {
        const s = this.opnds.map((o: any) => o.toString());
        return (s.length > 3 ? s.slice(3) : s).join("||");
    }
}

function filterPrecedencePredicates(set: any) {
    const result: any = [];
    set.values().map(function (context: any) {
        // @ts-expect-error TS(2339): Property 'PrecedencePredicate' does not exist on t... Remove this comment to see the full error message
        if (context instanceof SemanticContext.PrecedencePredicate) {
            result.push(context);
        }
    });
    return result;
}
