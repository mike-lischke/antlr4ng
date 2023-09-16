/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable no-underscore-dangle */

import {
    CommonTokenStream, CharStreams, ParseTree, BailErrorStrategy, PredictionMode, ParseCancellationException,
} from "antlr4ng";

import { MySQLLexer } from "./generated/MySQLLexer.js";
import { MySQLParser } from "./generated/MySQLParser.js";
import { IParserErrorInfo, MySQLParseUnit } from "./support/helpers.js";

import { MySQLErrorListener } from "./support/MySQLErrorListener.js";

export class ParseServiceJS {
    private errors: IParserErrorInfo[] = [];

    private tree: ParseTree | undefined;

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

        // This runtime is a big mess. We have to create everything from scratch for each run,
        // because we cannot reset the token stream (which would be the easiest way to do it).
        const stream = CharStreams.fromString(text);
        const lexer = new MySQLLexer(stream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new MySQLParser(tokenStream);
        lexer.removeErrorListeners();
        lexer.addErrorListener(this.errorListener);

        //this.parser.removeParseListeners();
        parser.removeErrorListeners();
        parser.addErrorListener(this.errorListener);

        lexer.charSets = this.charSets;

        parser.buildParseTrees = !fast;

        lexer.serverVersion = serverVersion;
        lexer.sqlModeFromString(sqlMode);
        parser.serverVersion = serverVersion;
        parser.sqlModes = lexer.sqlModes;

        // First parse with the bail error strategy to get quick feedback for correct queries.
        // Note: there's no need to delete the strategy instance. The error handler will take care.
        parser.errorHandler = new BailErrorStrategy();
        parser._interp.predictionMode = PredictionMode.SLL;

        try {
            this.tree = parser.query();
            //console.log((this.tree as ParserRuleContext).toStringTree(parser.ruleNames, parser));
        } catch (e) {
            if (e instanceof ParseCancellationException) {
                // Even in fast mode we have to do a second run if we got no error yet (BailErrorStrategy
                // does not do full processing).
                if (fast && this.errors.length > 0) {
                    this.tree = undefined;
                } else {
                    // If parsing was canceled we either really have a syntax error or we need to do a second step,
                    // now with the default strategy and LL parsing.

                    // TODO: also here we would have to recreate everything.
                    /*this.tokenStream.seek(0);
                    this.parser.reset();
                    this.errors = [];
                    this.parser.errorHandler = defaultStrategy;
                    this.parser._interp.predictionMode = PredictionMode.LL;
                    this.tree = this.parseUnit(unit);*/
                }
            } else {
                throw e;
            }
        }

        return this.tree;
    }
}
