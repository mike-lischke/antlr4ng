/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, expect, it } from "vitest";

import { CharStreamImpl, Lexer, LexerATNSimulator } from "../../src/index.js";

// Mock lexer class to test the currentTokenColumn behavior
class TestLexer extends Lexer {
    public constructor(input: CharStreamImpl) {
        super(input);
        // Initialize with a simple ATN simulator to test column tracking
        this.interpreter = new LexerATNSimulator(this, null as any, [] as any, null as any);
    }

    // Expose protected properties for testing
    public get testCurrentTokenColumn(): number {
        return this.currentTokenColumn;
    }

    public get testTokenStartColumn(): number {
        return this.tokenStartColumn;
    }

    public get testCurrentTokenStartLine(): number {
        return this.currentTokenStartLine;
    }

    public set testCurrentTokenStartLine(value: number) {
        this.currentTokenStartLine = value;
    }

    public set testTokenStartColumn(value: number) {
        this.tokenStartColumn = value;
    }

    // Simulate the semantic predicate checks from the grammar
    public checkCurrentColumnGreaterThanZero(): boolean {
        return this.currentTokenColumn > 0;
    }

    public checkCurrentColumnEqualsZero(): boolean {
        return this.currentTokenColumn === 0;
    }

    // Simulate the token recognition process to test column tracking
    public simulateTokenRecognition(input: CharStreamImpl): Array<{char: string, currentTokenColumn: number, interpreterColumn: number, tokenStartColumn: number}> {
        const results: Array<{char: string, currentTokenColumn: number, interpreterColumn: number, tokenStartColumn: number}> = [];
        
        // Set up like nextToken() does
        this.testCurrentTokenStartLine = this.interpreter.line;
        this.testTokenStartColumn = this.interpreter.column;
        
        // Process characters one by one
        while (input.index < input.size) {
            const char = String.fromCharCode(input.LA(1));
            
            results.push({
                char: char === '\n' ? '\\n' : char,
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
        const testInput = '\n\n    ';
        const charStream = new CharStreamImpl(testInput);
        const lexer = new TestLexer(charStream);

        const results = lexer.simulateTokenRecognition(charStream);
        
        // Log the results for debugging
        console.log("Character processing results:");
        results.forEach((result, index) => {
            console.log(`${index}: char='${result.char}' currentTokenColumn=${result.currentTokenColumn} interpreterColumn=${result.interpreterColumn} tokenStartColumn=${result.tokenStartColumn}`);
        });

        // Now currentTokenColumn should track the current interpreter column!
        expect(results[0].char).toBe('\\n'); // First newline
        expect(results[0].currentTokenColumn).toBe(0); // Should be 0 since we start at column 0
        expect(results[0].interpreterColumn).toBe(0); // Interpreter starts at 0
        expect(results[0].tokenStartColumn).toBe(0); // Token starts at 0
        
        expect(results[1].char).toBe('\\n'); // Second newline
        expect(results[1].currentTokenColumn).toBe(0); // Should be 0 (reset after first newline)
        expect(results[1].interpreterColumn).toBe(0); // Interpreter was reset to 0 after first newline
        expect(results[1].tokenStartColumn).toBe(0); // Token still starts at 0
        
        expect(results[2].char).toBe(' '); // First space
        expect(results[2].currentTokenColumn).toBe(0); // Should be 0 (reset after second newline)
        expect(results[2].interpreterColumn).toBe(0); // Interpreter was reset to 0 after second newline
        
        expect(results[3].char).toBe(' '); // Second space
        expect(results[3].currentTokenColumn).toBe(1); // Should be 1 (after consuming first space)
        expect(results[3].interpreterColumn).toBe(1); // Interpreter is at 1 after first space
    });

    it("should correctly evaluate semantic predicates with newlines like in the grammar example", () => {
        // Test the specific use case from the issue: '\n\n    '
        // According to the grammar:
        // EOL: { this.currentTokenColumn > 0 }? Nl -> channel(HIDDEN) ;
        // EMPTY_LINE: { this.currentTokenColumn == 0 }? Nl -> skip ;
        // BLANK: { this.currentTokenColumn > 0 }? Ws+ -> channel(HIDDEN) ;
        // INDENTATION: { this.currentTokenColumn == 0 }? Ws+ -> channel(HIDDEN) ;
        
        const testInput = '\n\n    ';
        const charStream = new CharStreamImpl(testInput);
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
        
        // Simulate processing subsequent spaces (column should be > 0 now)
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(false); // Should not match INDENTATION
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(true); // Should match BLANK
    });

    it("should handle edge cases correctly", () => {
        // Test empty input
        let charStream = new CharStreamImpl("");
        let lexer = new TestLexer(charStream);
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true);
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(false);

        // Test input starting with non-newline
        charStream = new CharStreamImpl("abc");
        lexer = new TestLexer(charStream);
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // At start
        lexer.interpreter.consume(charStream); // consume 'a'
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(true); // Now at column 1
        
        // Test Windows line endings (\r\n)
        charStream = new CharStreamImpl("a\r\nb");
        lexer = new TestLexer(charStream);
        lexer.interpreter.consume(charStream); // consume 'a' -> column 1
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(true);
        lexer.interpreter.consume(charStream); // consume '\r' -> column 2
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(true);
        lexer.interpreter.consume(charStream); // consume '\n' -> column 0, line++
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true);
        
        // Test mixed content
        charStream = new CharStreamImpl(" \n\t\n  ");
        lexer = new TestLexer(charStream);
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true); // Start
        lexer.interpreter.consume(charStream); // consume ' ' -> column 1
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(true);
        lexer.interpreter.consume(charStream); // consume '\n' -> column 0
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true);
        lexer.interpreter.consume(charStream); // consume '\t' -> column 1
        expect(lexer.checkCurrentColumnGreaterThanZero()).toBe(true);
        lexer.interpreter.consume(charStream); // consume '\n' -> column 0
        expect(lexer.checkCurrentColumnEqualsZero()).toBe(true);
    });

    it("should emit tokens with correct starting column", () => {
        const testInput = "a\n  b";
        const charStream = new CharStreamImpl(testInput);
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
        
        // But currentTokenColumn should still reflect current position
        expect(lexer.testCurrentTokenColumn).toBe(1); // Current interpreter column
        expect(lexer.testTokenStartColumn).toBe(0); // Starting column
    });

    it("should track line and column correctly in LexerATNSimulator", () => {
        const testInput = 'a\nb\n  c';
        const charStream = new CharStreamImpl(testInput);
        const lexer = new TestLexer(charStream);

        let line = lexer.interpreter.line;
        let column = lexer.interpreter.column;

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