/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, it, expect } from "vitest";

import {
    BaseErrorListener, CommonTokenStream, Recognizer, ErrorNode, TerminalNode, CharStream, Token, ATNSimulator,
    ParserRuleContext,
} from "antlr4ng";

import { VisitorBasicLexer } from "../generated/VisitorBasicLexer.js";
import { VisitorBasicParser } from "../generated/VisitorBasicParser.js";
import { VisitorBasicVisitor } from "../generated/VisitorBasicVisitor.js";
import { VisitorCalcLexer } from "../generated/VisitorCalcLexer.js";
import {
    AddContext, MultiplyContext, NumberContext, SContext, VisitorCalcParser,
} from "../generated/VisitorCalcParser.js";
import { VisitorCalcVisitor } from "../generated/VisitorCalcVisitor.js";

describe("TestVisitors", () => {

    /**
     * This test verifies the basic behavior of visitors, with an emphasis on
     * {@link AbstractParseTreeVisitor#visitTerminal}.
     */
    it("testVisitTerminalNode", () => {
        const input = "A";
        const lexer = new VisitorBasicLexer(CharStream.fromString(input));
        const parser = new VisitorBasicParser(new CommonTokenStream(lexer));

        const context = parser.s();
        expect(context.toStringTree(parser)).toBe("(s A <EOF>)");

        const listener = new class extends VisitorBasicVisitor<string> {
            public override visitTerminal(node: TerminalNode): string {
                return node.getSymbol().toString() + "\n";
            }

            protected override defaultResult(): string {
                return "";
            }

            protected override aggregateResult(aggregate: string, nextResult: string): string {
                return aggregate + nextResult;
            }
        }();

        const result = listener.visit(context);
        const expected =
            "[@0,0:0='A',<1>,1:0]\n" +
            "[@1,1:0='<EOF>',<-1>,1:1]\n";
        expect(result).toBe(expected);
    });

    /**
     * This test verifies the basic behavior of visitors, with an emphasis on
     * {@link AbstractParseTreeVisitor#visitErrorNode}.
     */
    it("testVisitErrorNode", () => {
        const input = "";
        const lexer = new VisitorBasicLexer(CharStream.fromString(input));
        const parser = new VisitorBasicParser(new CommonTokenStream(lexer));

        const errors: string[] = [];
        parser.removeErrorListeners();
        parser.addErrorListener(new class extends BaseErrorListener {
            public override syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>,
                offendingSymbol: S | null, line: number, charPositionInLine: number, msg: string): void {
                errors.push("line " + line + ":" + charPositionInLine + " " + msg);
            }
        }());

        const context = parser.s();
        expect(context.toStringTree(parser)).toBe("(s <missing 'A'> <EOF>)");
        expect(errors.length).toBe(1);
        expect(errors[0]).toBe("line 1:0 missing 'A' at '<EOF>'");

        const listener = new class extends VisitorBasicVisitor<String> {
            public override visitErrorNode(node: ErrorNode): string {
                return "Error encountered: " + node.getSymbol();
            }

            protected override defaultResult(): string {
                return "";
            }

            protected override aggregateResult(aggregate: string, nextResult: string): string {
                return aggregate + nextResult;
            }
        }();

        const result = listener.visit(context);
        const expected = "Error encountered: [@-1,-1:-1='<missing 'A'>',<1>,1:0]";
        expect(result).toBe(expected);
    });

    /**
     * This test verifies that {@link AbstractParseTreeVisitor#visitChildren} does not call
     * {@link org.antlr.v4.runtime.tree.ParseTreeVisitor#visit} after
     * {@link org.antlr.v4.runtime.tree.AbstractParseTreeVisitor#shouldVisitNextChild} returns
     * `false`.
     */
    it("testShouldNotVisitEOF", () => {
        const input = "A";
        const lexer = new VisitorBasicLexer(CharStream.fromString(input));
        const parser = new VisitorBasicParser(new CommonTokenStream(lexer));

        const context = parser.s();
        expect(context.toStringTree(parser)).toBe("(s A <EOF>)");

        const listener = new class extends VisitorBasicVisitor<String> {
            public override visitTerminal(node: TerminalNode): string {
                return node.getSymbol().toString() + "\n";
            }

            protected override shouldVisitNextChild(node: ParserRuleContext, currentResult: string | null): boolean {
                return currentResult === null || currentResult.length === 0;
            }
        }();

        const result = listener.visit(context);
        const expected = "[@0,0:0='A',<1>,1:0]\n";
        expect(result).toBe(expected);
    });

    /**
     * This test verifies that {@link AbstractParseTreeVisitor#shouldVisitNextChild} is called before visiting the first
     * child. It also verifies that {@link AbstractParseTreeVisitor#defaultResult} provides the default return value for
     * visiting a tree.
     */
    it("testShouldNotVisitTerminal", () => {
        const input = "A";
        const lexer = new VisitorBasicLexer(CharStream.fromString(input));
        const parser = new VisitorBasicParser(new CommonTokenStream(lexer));

        const context = parser.s();
        expect(context.toStringTree(parser)).toBe("(s A <EOF>)");

        const listener = new class extends VisitorBasicVisitor<String> {
            public override visitTerminal(): string {
                throw new Error("Should not be reachable");
            }

            protected override defaultResult(): string {
                return "default result";
            }

            protected override shouldVisitNextChild(): boolean {
                return false;
            }
        }();

        const result = listener.visit(context);
        const expected = "default result";
        expect(result).toBe(expected);
    });

    /**
     * This test verifies that the visitor correctly dispatches calls for labeled outer alternatives.
     */
    it("testCalculatorVisitor", () => {
        const input = "2 + 8 / 2";
        const lexer = new VisitorCalcLexer(CharStream.fromString(input));
        const parser = new VisitorCalcParser(new CommonTokenStream(lexer));

        const context = parser.s();
        expect(context.toStringTree(parser)).toBe("(s (expr (expr 2) + (expr (expr 8) / (expr 2))) <EOF>)");

        const listener = new class extends VisitorCalcVisitor<number | null> {
            public override visitS = (ctx: SContext): number | null => {
                return this.visit(ctx.expr());
            };

            public override visitNumber = (ctx: NumberContext): number | null => {
                return parseInt(ctx.INT().getText(), 10);
            };

            public override visitMultiply = (ctx: MultiplyContext): number | null => {
                const left = this.visit(ctx.expr(0)!)!;
                const right = this.visit(ctx.expr(1)!)!;
                if (ctx.MUL() !== null) {
                    return left * right;
                }
                else {
                    return left / right;
                }
            };

            public override visitAdd = (ctx: AddContext): number | null => {
                const left = this.visit(ctx.expr(0)!)!;
                const right = this.visit(ctx.expr(1)!)!;
                if (ctx.ADD() !== null) {
                    return left + right;
                }
                else {
                    return left - right;
                }
            };

            protected override defaultResult(): number | null {
                throw new Error("Should not be reachable");
            }

            protected override aggregateResult(): number | null {
                throw new Error("Should not be reachable");
            }
        }();

        const result = listener.visit(context);
        const expected = 6;
        expect(result).toBe(expected);
    });
});
