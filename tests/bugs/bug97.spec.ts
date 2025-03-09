/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, expect, it } from "vitest";

import { CharStream, CommonTokenStream } from "antlr4ng";

import { ExpressionVisitor } from "./generated/ExpressionVisitor.js";
import {
    ExpressionParser, type AddContext, type MultiplyContext, type NumberContext
} from "./generated/ExpressionParser.js";
import { ExpressionLexer } from "./ExpressionLexer.js";

class MyVisitor extends ExpressionVisitor<number> {
    public visitAdd = (ctx: AddContext): number => {
        return this.visit(ctx.expression(0)!)! + this.visit(ctx.expression(1)!)!;
    };

    public visitMultiply = (ctx: MultiplyContext): number => {
        return this.visit(ctx.expression(0)!)! * this.visit(ctx.expression(1)!)!;
    };

    public visitNumber = (ctx: NumberContext): number => {
        return Number.parseInt(ctx.NUMBER().getText(), 10);
    };
}

describe("Bug 97", () => {
    it("readme.md example visitor does not compile", () => {
        const input = "1 + 2 * 3";
        const inputStream = CharStream.fromString(input);
        const lexer = new ExpressionLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ExpressionParser(tokenStream);
        const tree = parser.start();

        const visitor = new MyVisitor();
        const result = visitor.visit(tree);

        expect(result).toBe(7);
    });
});
