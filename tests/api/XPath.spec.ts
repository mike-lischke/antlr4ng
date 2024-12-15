/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { beforeAll, describe, expect, it } from "vitest";

import { CharStream, CommonTokenStream, ParserRuleContext, XPath, type ParseTree, type TerminalNode } from "antlr4ng";

import { ExprLexer } from "../generated/ExprLexer.js";
import { ExprParser } from "../generated/ExprParser.js";

describe("XPath", () => {
    const input = "def f(x,y) { x = 3+4; y; ; }\ndef g(x) { return 1+2*x; }\n";
    let parser!: ExprParser;
    let parseTree: ParseTree;

    const xpath = [
        "/prog/func", // all funcs under prog at root
        "/prog/*", // all children of prog at root
        "/*/func", // all func kids of any root node
        "prog", // prog must be root node
        "/prog", // prog must be root node
        "/*", // any root
        "*", // any root
        "//ID", // any ID in tree
        "//expr/primary/ID",// any ID child of a primary under any expr
        "//body//ID", // any ID under a body
        "//'return'", // any 'return' literal in tree, matched by literal name
        "//RETURN", // any 'return' literal in tree, matched by symbolic name
        "//primary/*", // all kids of any primary
        "//func/*/stat",	// all stat nodes grand kids of any func node
        "/prog/func/'def'",	// all def literal kids of func kid of prog
        "//stat/';'", // all ';' under any stat node
        "//expr/primary/!ID",	// anything but ID under primary under any expr node
        "//expr/!primary",	// anything but primary under any expr node
        "//!*", // nothing anywhere
        "/!*", // nothing at root
        "//expr//ID", // any ID under any expression (tests antlr/antlr4#370)
    ];
    const expected = [
        "[func, func]",
        "[func, func]",
        "[func, func]",
        "[prog]",
        "[prog]",
        "[prog]",
        "[prog]",
        "[f, x, y, x, y, g, x, x]",
        "[y, x]",
        "[x, y, x]",
        "[return]",
        "[return]",
        "[3, 4, y, 1, 2, x]",
        "[stat, stat, stat, stat]",
        "[def, def]",
        "[;, ;, ;, ;]",
        "[3, 4, 1, 2]",
        "[expr, expr, expr, expr, expr, expr]",
        "[]",
        "[]",
        "[y, x]",
    ];

    beforeAll(() => {
        const lexer = new ExprLexer(CharStream.fromString(input));
        const tokens = new CommonTokenStream(lexer);
        parser = new ExprParser(tokens);
        parseTree = parser.prog();
    });

    it("Successful matches", () => {
        for (let i = 0; i < xpath.length; i++) {
            const found = XPath.findAll(parseTree, xpath[i], parser);

            const ruleNames: string[] = [];
            for (const t of found) {
                if (t instanceof ParserRuleContext) {
                    const r = t;
                    ruleNames.push(parser.ruleNames[r.ruleIndex]);
                } else {
                    const token = t as TerminalNode;
                    ruleNames.push(token.getText());
                }
            }

            const result = `[${ruleNames.join(", ")}]`;

            expect(result, "path " + xpath[i] + " failed").to.equal(expected[i]);
        }

    });
});
