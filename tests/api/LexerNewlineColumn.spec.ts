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