/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
    BailErrorStrategy, CharStreams, CommonTokenStream, ParseTree, PredictionMode,
} from "antlr4ng";

import { MySQLLexer } from "./generated/MySQLLexer.js";
import { MySQLParser } from "./generated/MySQLParser.js";
import { IParserErrorInfo, MySQLParseUnit } from "./support/helpers.js";

import { MySQLErrorListener } from "./support/MySQLErrorListener.js";

export class ParseService {
    private lexer = new MySQLLexer(CharStreams.fromString(""));
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
     * @param text The text to parse.
     * @param unit The type of input. Can be used to limit the available syntax to certain constructs.
     * @param serverVersion The version of MySQL to use for checking.
     * @param sqlMode The current SQL mode in the server.
     *
     * @returns True if no error was found, otherwise false.
     */
    public errorCheck(text: string, unit: MySQLParseUnit, serverVersion: number, sqlMode: string): boolean {
        this.startParsing(text, true, serverVersion, sqlMode);

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
     * This is the method to parse text. Depending on fast mode it creates a syntax tree and otherwise
     * bails out if an error was found, asap.
     *
     * @param text The text to parse.
     * @param fast If true use fast mode (no parse tree creation, fast bail out in case of errors).
     * @param serverVersion The version of MySQL to use for checking.
     * @param sqlMode The current SQL mode in the server.
     *
     * @returns A parse tree if enabled.
     */
    private startParsing(text: string, fast: boolean, serverVersion: number, sqlMode: string): ParseTree | undefined {
        this.errors = [];
        this.lexer.inputStream = CharStreams.fromString(text);
        this.tokenStream.setTokenSource(this.lexer);

        this.parser.reset();
        this.parser.buildParseTrees = !fast;

        this.lexer.serverVersion = serverVersion;
        this.lexer.sqlModeFromString(sqlMode);
        this.parser.serverVersion = serverVersion;
        this.parser.sqlModes = this.lexer.sqlModes;

        this.tree = this.parser.query();

        return this.tree;
    }
}
