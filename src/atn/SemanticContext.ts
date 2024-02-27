/*
* Copyright (c) The ANTLR Project. All rights reserved.
* Use of this file is governed by the BSD 3-clause license that
* can be found in the LICENSE.txt file in the project root.
*/

/* eslint-disable max-classes-per-file, jsdoc/require-jsdoc, jsdoc/require-param, jsdoc/require-returns */

import { Recognizer } from "../Recognizer.js";
import { ParserRuleContext } from "../ParserRuleContext.js";
import { HashSet } from "../misc/HashSet.js";
import { MurmurHash } from "../utils/MurmurHash.js";

import { IComparable, equalArrays } from "../utils/helpers.js";
import { ATNSimulator } from "./ATNSimulator.js";

/**
 * A tree structure used to record the semantic context in which
 * an ATN configuration is valid.  It's either a single predicate,
 * a conjunction `p1&&p2`, or a sum of products `p1||p2`.
 *
 * I have scoped the {@link AND}, {@link OR}, and {@link SemanticContext.Predicate} subclasses of
 * {@link SemanticContext} within the scope of this outer class.
 */
export abstract class SemanticContext implements IComparable {
    protected cachedHashCode: number | undefined;

    public static andContext(a: SemanticContext | null, b: SemanticContext | null): SemanticContext | null {
        if (a === null || a === SemanticContext.NONE) {
            return b;
        }

        if (b === null || b === SemanticContext.NONE) {
            return a;
        }

        const result = new AND(a, b);
        if (result.operands.length === 1) {
            return result.operands[0];
        }

        return result;
    }

    public static orContext(a: SemanticContext | null, b: SemanticContext | null): SemanticContext | null {
        if (a === null) {
            return b;
        }

        if (b === null) {
            return a;
        }

        if (a === SemanticContext.NONE || b === SemanticContext.NONE) {
            return SemanticContext.NONE;
        }

        const result = new OR(a, b);
        if (result.operands.length === 1) {
            return result.operands[0];
        } else {
            return result;
        }
    }

    protected static filterPrecedencePredicates(
        set: HashSet<SemanticContext>): SemanticContext.PrecedencePredicate[] {
        const result: SemanticContext.PrecedencePredicate[] = [];
        for (const context of set) {
            if (context instanceof SemanticContext.PrecedencePredicate) {
                result.push(context);
            }
        }

        return result;
    };

    /**
     * Evaluate the precedence predicates for the context and reduce the result.
     *
     * @param _parser The parser instance.
     * @param _parserCallStack The current parser context object.
     * @returns The simplified semantic context after precedence predicates are
     * evaluated, which will be one of the following values.
     * - {@link NONE}: if the predicate simplifies to `true` after
     * precedence predicates are evaluated.
     * - `null`: if the predicate simplifies to `false` after
     * precedence predicates are evaluated.
     * - `this`: if the semantic context is not changed as a result of
     * precedence predicate evaluation.
     * - A non-`null` {@link SemanticContext}: the new simplified
     * semantic context after precedence predicates are evaluated.
     */
    public evalPrecedence<T extends ATNSimulator>(_parser: Recognizer<T>,
        _parserCallStack?: ParserRuleContext): SemanticContext | null {
        return this;
    };

    /**
     * For context independent predicates, we evaluate them without a local
     * context (i.e., null context). That way, we can evaluate them without
     * having to create proper rule-specific context during prediction (as
     * opposed to the parser, which creates them naturally). In a practical
     * sense, this avoids a cast exception from RuleContext to myRuleContext.
     *
     * For context dependent predicates, we must pass in a local context so that
     * references such as $arg evaluate properly as _localctx.arg. We only
     * capture context dependent predicates in the context in which we begin
     * prediction, so we passed in the outer context here in case of context
     * dependent predicate evaluation.
     */
    public abstract evaluate<T extends ATNSimulator>(parser: Recognizer<T>,
        parserCallStack: ParserRuleContext): boolean;

    public abstract equals(other: SemanticContext): boolean;
    public abstract hashCode(): number;
}

class AND extends SemanticContext {
    public readonly operands: SemanticContext[];

    /**
     * A semantic context which is true whenever none of the contained contexts
     * is false
     */
    public constructor(a: SemanticContext, b: SemanticContext) {
        super();

        const operands = new HashSet<SemanticContext>();
        if (a instanceof AND) {
            a.operands.forEach((o) => {
                operands.add(o);
            });
        } else {
            operands.add(a);
        }

        if (b instanceof AND) {
            b.operands.forEach((o) => {
                operands.add(o);
            });
        } else {
            operands.add(b);
        }

        const precedencePredicates = SemanticContext.filterPrecedencePredicates(operands);
        if (precedencePredicates.length > 0) {
            // interested in the transition with the lowest precedence
            let reduced: SemanticContext.PrecedencePredicate | null = null;
            precedencePredicates.forEach((p) => {
                if (reduced === null || p.precedence < reduced.precedence) {
                    reduced = p;
                }
            });
            if (reduced) {
                operands.add(reduced);
            }
        }
        this.operands = operands.toArray();
    }

    public override equals(other: AND): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof AND)) {
            return false;
        }

        return equalArrays(this.operands, other.operands);
    }

    public hashCode(): number {
        if (this.cachedHashCode === undefined) {
            let hash = MurmurHash.initialize();
            for (const operand of this.operands) {
                hash = MurmurHash.updateFromComparable(hash, operand);
            }
            hash = MurmurHash.update(hash, 3813686060); // Hash code of "AND".
            this.cachedHashCode = MurmurHash.finish(hash, this.operands.length + 1);
        }

        return this.cachedHashCode;
    }

    /**
     * {@inheritDoc}
     *
     *
     * The evaluation of predicates by this context is short-circuiting, but
     * unordered.
     */
    public evaluate<T extends ATNSimulator>(parser: Recognizer<T>,
        parserCallStack: ParserRuleContext): boolean {
        for (const operand of this.operands) {
            if (!operand.evaluate(parser, parserCallStack)) {
                return false;
            }
        }

        return true;
    }

    public override evalPrecedence<T extends ATNSimulator>(parser: Recognizer<T>,
        parserCallStack: ParserRuleContext): SemanticContext | null {
        let differs = false;
        const operands = [];
        for (const context of this.operands) {
            const evaluated = context.evalPrecedence(parser, parserCallStack);
            differs ||= (evaluated !== context);
            if (evaluated === null) {
                // The AND context is false if any element is false
                return null;
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
            return SemanticContext.NONE;
        }

        let result: SemanticContext | null = null;
        operands.forEach((o) => {
            result = result === null ? o : SemanticContext.andContext(result, o);
        });

        return result;
    }

    public override toString(): string {
        const s = this.operands.map((o) => { return o.toString(); });

        return (s.length > 3 ? s.slice(3) : s).join("&&");
    }
}

class OR extends SemanticContext {
    public readonly operands: SemanticContext[];

    /**
     * A semantic context which is true whenever at least one of the contained
     * contexts is true
     */
    public constructor(a: SemanticContext, b: SemanticContext) {
        super();
        const operands = new HashSet<SemanticContext>();
        if (a instanceof OR) {
            a.operands.forEach((o) => {
                operands.add(o);
            });
        } else {
            operands.add(a);
        }

        if (b instanceof OR) {
            b.operands.forEach((o) => {
                operands.add(o);
            });
        } else {
            operands.add(b);
        }

        const precedencePredicates = SemanticContext.filterPrecedencePredicates(operands);
        if (precedencePredicates.length > 0) {
            // interested in the transition with the highest precedence
            const s = precedencePredicates.sort((a, b) => {
                return a.compareTo(b);
            });
            const reduced = s[s.length - 1];
            operands.add(reduced);
        }
        this.operands = operands.toArray();
    }

    public override equals(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof OR)) {
            return false;
        } else {
            return equalArrays(this.operands, other.operands);
        }
    }

    public hashCode(): number {
        if (this.cachedHashCode === undefined) {
            let hash = MurmurHash.initialize();
            for (const operand of this.operands) {
                hash = MurmurHash.updateFromComparable(hash, operand);
            }
            hash = MurmurHash.update(hash, 3383313031); // Hash code of "OR".
            this.cachedHashCode = MurmurHash.finish(hash, this.operands.length + 1);
        }

        return this.cachedHashCode;
    }

    /**
     * The evaluation of predicates by this context is short-circuiting, but unordered.
     */
    public evaluate<T extends ATNSimulator>(parser: Recognizer<T>,
        parserCallStack: ParserRuleContext): boolean {
        for (const operand of this.operands) {
            if (operand.evaluate(parser, parserCallStack)) {
                return true;
            }
        }

        return false;
    }

    public override evalPrecedence<T extends ATNSimulator>(parser: Recognizer<T>,
        parserCallStack: ParserRuleContext): SemanticContext | null {
        let differs = false;
        const operands = [];
        for (const context of this.operands) {
            const evaluated = context.evalPrecedence(parser, parserCallStack);
            differs ||= (evaluated !== context);
            if (evaluated === SemanticContext.NONE) {
                // The OR context is true if any element is true
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

        let result: SemanticContext | null = null;
        operands.forEach((o) => {
            result = result === null ? o : SemanticContext.orContext(result, o);
        });

        return result;
    }

    public override toString() {
        const s = this.operands.map((o) => { return o.toString(); });

        return (s.length > 3 ? s.slice(3) : s).join("||");
    }
}

export namespace SemanticContext {
    export class Predicate extends SemanticContext {
        public readonly ruleIndex: number;
        public readonly predIndex: number;
        public readonly isCtxDependent: boolean;  // e.g., $i ref in pred

        public constructor(ruleIndex?: number, predIndex?: number, isCtxDependent?: boolean) {
            super();
            this.ruleIndex = ruleIndex ?? -1;
            this.predIndex = predIndex ?? -1;
            this.isCtxDependent = isCtxDependent ?? false;
        }

        public override evaluate<T extends ATNSimulator>(parser: Recognizer<T>,
            outerContext: ParserRuleContext): boolean {
            const localctx = this.isCtxDependent ? outerContext : null;

            return parser.sempred(localctx, this.ruleIndex, this.predIndex);
        }

        public override hashCode(): number {
            if (this.cachedHashCode === undefined) {
                let hashCode = MurmurHash.initialize();
                hashCode = MurmurHash.update(hashCode, this.ruleIndex);
                hashCode = MurmurHash.update(hashCode, this.predIndex);
                hashCode = MurmurHash.update(hashCode, this.isCtxDependent ? 1 : 0);
                hashCode = MurmurHash.finish(hashCode, 3);
                this.cachedHashCode = hashCode;
            }

            return this.cachedHashCode;
        }

        public override equals(other: Predicate): boolean {
            if (this === other) {
                return true;
            }

            return this.ruleIndex === other.ruleIndex &&
                this.predIndex === other.predIndex &&
                this.isCtxDependent === other.isCtxDependent;
        }

        public override toString(): string {
            return "{" + this.ruleIndex + ":" + this.predIndex + "}?";
        }
    }

    export class PrecedencePredicate extends SemanticContext {
        public readonly precedence: number;

        public constructor(precedence?: number) {
            super();
            this.precedence = precedence ?? 0;
        }

        public override evaluate<T extends ATNSimulator>(parser: Recognizer<T>,
            outerContext: ParserRuleContext): boolean {
            return parser.precpred(outerContext, this.precedence);
        }

        public override evalPrecedence(parser: Recognizer<ATNSimulator>,
            outerContext?: ParserRuleContext): SemanticContext | null {
            if (parser.precpred(outerContext ?? null, this.precedence)) {
                return SemanticContext.NONE;
            }

            return null;
        }

        public compareTo(other: PrecedencePredicate): number {
            return this.precedence - other.precedence;
        }

        public override hashCode(): number {
            return 31 + this.precedence;
        }

        public override equals(other: PrecedencePredicate): boolean {
            if (this === other) {
                return true;
            }

            return this.precedence === other.precedence;
        }

        public override toString(): string {
            return "{" + this.precedence + ">=prec}?";
        }

    }

    /**
     * The default {@link SemanticContext}, which is semantically equivalent to
     * a predicate of the form `{true`?}
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export const NONE = new Predicate();
}
