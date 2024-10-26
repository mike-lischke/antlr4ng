/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, it, expect } from "vitest";

import { BufferedTokenStream, CharStream, Token } from "antlr4ng";

import { VisitorBasicLexer } from "../generated/VisitorBasicLexer.js";

/**
 * This class contains tests for specific API functionality in {@link TokenStream} and derived types.
 */
describe("TestTokenStream", () => {
    /**
     * This is a targeted regression test for antlr/antlr4#1584 ({@link BufferedTokenStream}
     * cannot be reused after EOF).
     */
    it("testBufferedTokenStreamReuseAfterFill", () => {
        const firstInput = CharStream.fromString("A");
        const tokenStream = new BufferedTokenStream(new VisitorBasicLexer(firstInput));
        tokenStream.fill();
        expect(tokenStream.size).toBe(2);
        expect(tokenStream.get(0).type).toBe(VisitorBasicLexer.A);
        expect(tokenStream.get(1).type).toBe(Token.EOF);

        const secondInput = CharStream.fromString("AA");
        tokenStream.setTokenSource(new VisitorBasicLexer(secondInput));
        tokenStream.fill();
        expect(tokenStream.size).toBe(3);
        expect(tokenStream.get(0).type).toBe(VisitorBasicLexer.A);
        expect(tokenStream.get(1).type).toBe(VisitorBasicLexer.A);
        expect(tokenStream.get(2).type).toBe(Token.EOF);
    });
});
