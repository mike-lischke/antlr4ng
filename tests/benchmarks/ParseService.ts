/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
    BailErrorStrategy, CharStream, CommonTokenStream, ParseTree, PredictionMode,
} from "antlr4ng";

import { MySQLLexer } from "./generated/MySQLLexer.js";
import { MySQLParser } from "./generated/MySQLParser.js";
import { IParserErrorInfo } from "./support/helpers.js";

import { MySQLErrorListener } from "./support/MySQLErrorListener.js";

export class ParseService {
    private lexer = new MySQLLexer(CharStream.fromString(""));
    private tokenStream = new CommonTokenStream(this.lexer);
    private parser = new MySQLParser(this.tokenStream);

    private errors: IParserErrorInfo[] = [];

    private tree: ParseTree | undefined;

    private bailErrorStrategy = new BailErrorStrategy();
    private errorListener: MySQLErrorListener;

    public constructor(private charSets: Set<string>) {
        this.errorListener = new MySQLErrorListener(
            (message: string, tokenType: number, startIndex: number, line: number, column: number,
                length: number): void => {

                if (length === 0) {
                    length = 1;
                }

                this.errors.push({ message, tokenType, charOffset: startIndex, line, offset: column, length });
            },
        );

        this.lexer.charSets = this.charSets;
        this.lexer.removeErrorListeners();
        this.lexer.addErrorListener(this.errorListener);

        this.parser.removeParseListeners();
        this.parser.removeErrorListeners();
        this.parser.addErrorListener(this.errorListener);
        this.parser.interpreter.predictionMode = PredictionMode.SLL;
    }

    /**
     * Quick check for syntax errors.
     *
     * @returns True if no error was found, otherwise false.
     */
    public errorCheck(): boolean {
        this.startParsing();

        return this.errors.length === 0;
    }

    /**
     * Returns a collection of errors from the last parser run. The start position is offset by the given
     * value (used to adjust error position in a larger context).
     *
     * @param offset The character offset to add for each error.
     *
     * @returns The updated error list from the last parse run.
     */
    public errorsWithOffset(offset: number): IParserErrorInfo[] {
        const result: IParserErrorInfo[] = [...this.errors];
        result.forEach((error: IParserErrorInfo) => {
            error.charOffset += offset;
        });

        return result;
    }

    /**
     * Initializes the lexer with a new string and lets the tokenizer load all tokens.
     *
     * @param text The text to tokenize.
     * @param serverVersion The version of the MySQL server to use for parsing.
     * @param sqlMode The current SQL mode in the server.
     */
    public tokenize(text: string, serverVersion: number, sqlMode: string): void {
        this.lexer.inputStream = CharStream.fromString(text);
        this.tokenStream.setTokenSource(this.lexer);
        this.lexer.serverVersion = serverVersion;
        this.lexer.sqlModeFromString(sqlMode);

        this.tokenStream.fill();
    }

    /**
     * This is the method to parse text. It uses the token stream from the last call to tokenize.
     */
    private startParsing(): void {
        this.errors = [];

        this.parser.reset();
        this.parser.buildParseTrees = false;

        this.parser.serverVersion = this.lexer.serverVersion;
        this.parser.sqlModes = this.lexer.sqlModes;

        this.tree = this.parser.query();
    }
}
