/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, expect, it } from "vitest";

import { ATN, CharStream, DFA, Lexer, LexerATNSimulator, PredictionContextCache, Vocabulary } from "../../src/index.js";

// Mock lexer class to test the currentTokenColumn behavior
class TestLexer extends Lexer {
    public constructor(input: CharStream) {
        super(input);
        // Initialize with a minimal ATN simulator that doesn't require complex serialization
        // Use the same approach as in existing tests - create minimal empty structures
        const atn = new ATN(ATN.LEXER, 1 /* maxTokenType */);
        const decisionsToDFA: DFA[] = [];
        this.interpreter = new LexerATNSimulator(this, atn, decisionsToDFA, new PredictionContextCache());
    }

    // Implement required abstract methods
    public override get grammarFileName(): string {
        return "TestLexer.g4";
    }

    public override get ruleNames(): string[] {
        return ["TEST"];
    }

    public override get vocabulary(): Vocabulary {
        return Vocabulary.EMPTY_VOCABULARY;
    }

    public override get serializedATN(): number[] {
        return [];
    }

    // Expose protected properties for testing
    public get testCurrentTokenColumn(): number {
        return this.currentTokenColumn;
    }

    public set testCurrentTokenColumn(value: number) {
        this.currentTokenColumn = value;
    }

    public get testTokenStartColumn(): number {
        return this.tokenStartColumn;
    }

    public set testTokenStartColumn(value: number) {
        this.tokenStartColumn = value;
    }

    public get testCurrentTokenStartLine(): number {
        return this.currentTokenStartLine;
    }

    public set testCurrentTokenStartLine(value: number) {
        this.currentTokenStartLine = value;
    }

    // Simulate the semantic predicate checks from the grammar
    public checkCurrentColumnGreaterThanZero(): boolean {
        return this.currentTokenColumn > 0;
    }

    public checkCurrentColumnEqualsZero(): boolean {
        return this.currentTokenColumn === 0;
    }

    // Simulate the token recognition process to test column tracking
    public simulateTokenRecognition(input: CharStream): Array<{
        char: string,
        currentTokenColumn: number,
        interpreterColumn: number,
        tokenStartColumn: number
    }> {
        const results: Array<{
            char: string,
            currentTokenColumn: number,
            interpreterColumn: number,
            tokenStartColumn: number
        }> = [];
        
        // Set up like nextToken() does
        this.testCurrentTokenStartLine = this.interpreter.line;
        this.testTokenStartColumn = this.interpreter.column;
        
        // Process characters one by one
        while (input.index < input.size) {
            const char = String.fromCharCode(input.LA(1));
            
            results.push({
                char: char === "\n" ? "\\n" : char,
                currentTokenColumn: this.testCurrentTokenColumn,
                interpreterColumn: this.interpreter.column,
                tokenStartColumn: this.testTokenStartColumn
            });
            
            // Simulate the consume call that happens during lexing
            this.interpreter.consume(input);
        }
        
        return results;
    }
}

describe("Lexer Newline Column Tracking", () => {
    it("should demonstrate the currentTokenColumn issue with newlines", () => {
        const testInput = "\n\n    ";
        const charStream = CharStream.fromString(testInput);
        const lexer = new TestLexer(charStream);

        const results = lexer.simulateTokenRecognition(charStream);

        // Now currentTokenColumn should track the current interpreter column!
        expect(results[0].char).toBe("\\n"); // First newline
        expect(results[0].currentTokenColumn).toBe(0); // Should be 0 since we start at column 0
        expect(results[0].interpreterColumn).toBe(0); // Interpreter starts at 0
        expect(results[0].tokenStartColumn).toBe(0); // Token starts at 0
        
        expect(results[1].char).toBe("\\n"); // Second newline
        expect(results[1].currentTokenColumn).toBe(0); // Should be 0 (reset after first newline)
        expect(results[1].interpreterColumn).toBe(0); // Interpreter was reset to 0 after first newline
        expect(results[1].tokenStartColumn).toBe(0); // Token still starts at 0
        
        expect(results[2].char).toBe(" "); // First space
        expect(results[2].currentTokenColumn).toBe(0); // Should be 0 (starting column after second newline)
        expect(results[2].interpreterColumn).toBe(0); // Interpreter was reset to 0 after second newline
        
        expect(results[3].char).toBe(" "); // Second space
        expect(results[3].currentTokenColumn).toBe(0); // Should still be 0 (starting column, not current position)
        expect(results[3].interpreterColumn).toBe(1); // Interpreter is at 1 after first space
    });

    it("should correctly evaluate semantic predicates with newlines like in the grammar example", () => {
        // Test the specific use case from the issue: '\n\n    '
        // According to the grammar:
        // EOL: { this.currentTokenColumn > 0 }? Nl -> channel(HIDDEN) ;
        // EMPTY_LINE: { this.currentTokenColumn == 0 }? Nl -> skip ;
        // BLANK: { this.currentTokenColumn > 0 }? Ws+ -> channel(HIDDEN) ;
        // INDENTATION: { this.currentTokenColumn == 0 }? Ws+ -> channel(HIDDEN) ;
        
        const testInput = "\n\n    ";
        const charStream = CharStream.fromString(testInput);
        const lexer = new TestLexer(charStream);

        // Simulate processing the first '\n' at position 0
        charStream.index = 0;
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // Should match EMPTY_LINE
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Should not match EOL
        
        // Consume first newline
        lexer.interpreter.consume(charStream);
        
        // Simulate processing the second '\n' at position 1 (column should be 0 after first newline)
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // Should match EMPTY_LINE
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Should not match EOL
        
        // Consume second newline
        lexer.interpreter.consume(charStream);
        
        // Simulate processing the first space at position 2 (column should be 0 after second newline)
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // Should match INDENTATION
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Should not match BLANK
        
        // Consume first space
        lexer.interpreter.consume(charStream);
        
        // Simulate processing subsequent spaces (column should still be 0 for starting position)
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // Should match INDENTATION (starting column = 0)
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Should not match BLANK (starting column = 0)
    });

    it("should handle edge cases correctly", () => {
        // Test empty input
        let charStream = CharStream.fromString("");
        let lexer = new TestLexer(charStream);
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true);
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false);

        // Test input starting with non-newline
        charStream = CharStream.fromString("abc");
        lexer = new TestLexer(charStream);
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // At start
        lexer.interpreter.consume(charStream); // consume 'a'
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Still at starting column (0)
        
        // Test Windows line endings (\r\n)
        // Test that currentTokenColumn is updated when newlines are encountered during token recognition
        charStream = CharStream.fromString("a\r\nb");
        lexer = new TestLexer(charStream);
        // Initialize for token recognition like nextToken() does
        lexer.testCurrentTokenStartLine = lexer.interpreter.line;
        lexer.testTokenStartColumn = lexer.interpreter.column;
        lexer.testCurrentTokenColumn = lexer.interpreter.column; // Start at 0
        
        lexer.interpreter.consume(charStream); // consume 'a' -> column 1
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Starting column is still 0
        lexer.interpreter.consume(charStream); // consume '\r' -> column 2
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Starting column is still 0
        lexer.interpreter.consume(charStream); // consume '\n' -> column 0, line++
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // Should be updated to 0 after newline
        
        // Test mixed content
        charStream = CharStream.fromString(" \n\t\n  ");
        lexer = new TestLexer(charStream);
        lexer.testCurrentTokenColumn = 0; // Initialize starting column
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // Start
        lexer.interpreter.consume(charStream); // consume ' ' -> column 1
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Starting column is still 0
        lexer.interpreter.consume(charStream); // consume '\n' -> column 0
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true);
        lexer.interpreter.consume(charStream); // consume '\t' -> column 1
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false); // Starting column is still 0
        lexer.interpreter.consume(charStream); // consume '\n' -> column 0
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true);
    });

    it("should emit tokens with correct starting column", () => {
        const testInput = "a\n  b";
        const charStream = CharStream.fromString(testInput);
        const lexer = new TestLexer(charStream);
        
        // Set up token creation like nextToken() would do
        lexer.tokenStartCharIndex = charStream.index;
        lexer.testCurrentTokenStartLine = lexer.interpreter.line;
        lexer.testTokenStartColumn = lexer.interpreter.column; // Should be 0 at start
        lexer.type = 1; // Some token type
        
        // Consume some characters
        lexer.interpreter.consume(charStream); // 'a' -> now at column 1
        lexer.interpreter.consume(charStream); // '\n' -> now at column 0, line 2
        lexer.interpreter.consume(charStream); // ' ' -> now at column 1
        
        // Emit token - should use the starting column (0), not current column (1)
        const token = lexer.emit();
        
        expect(token.line).toBe(1); // Starting line
        expect(token.column).toBe(0); // Starting column, not current column
        expect(token.start).toBe(0); // Starting character index
        expect(token.stop).toBe(charStream.index - 1); // Ending character index
        
        // But currentTokenColumn should still reflect starting position
        expect(lexer.testCurrentTokenColumn).toBe(0); // Starting column
        expect(lexer.testTokenStartColumn).toBe(0); // Starting column
    });

    it("should track line and column correctly in LexerATNSimulator", () => {
        const testInput = "a\nb\n  c";
        const charStream = CharStream.fromString(testInput);
        const lexer = new TestLexer(charStream);

        const line = lexer.interpreter.line;
        const column = lexer.interpreter.column;

        // Start: should be line 1, column 0
        expect(line).toBe(1);
        expect(column).toBe(0);

        // Consume 'a'
        lexer.interpreter.consume(charStream);
        expect(lexer.interpreter.line).toBe(1);
        expect(lexer.interpreter.column).toBe(1);

        // Consume '\n' 
        lexer.interpreter.consume(charStream);
        expect(lexer.interpreter.line).toBe(2);
        expect(lexer.interpreter.column).toBe(0);

        // Consume 'b'
        lexer.interpreter.consume(charStream);
        expect(lexer.interpreter.line).toBe(2);
        expect(lexer.interpreter.column).toBe(1);

        // Consume '\n'
        lexer.interpreter.consume(charStream);
        expect(lexer.interpreter.line).toBe(3);
        expect(lexer.interpreter.column).toBe(0);

        // Consume ' '
        lexer.interpreter.consume(charStream);
        expect(lexer.interpreter.line).toBe(3);
        expect(lexer.interpreter.column).toBe(1);

        // Consume ' '
        lexer.interpreter.consume(charStream);
        expect(lexer.interpreter.line).toBe(3);
        expect(lexer.interpreter.column).toBe(2);
    });
});