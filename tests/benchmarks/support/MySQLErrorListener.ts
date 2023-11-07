/*
 * Copyright (c) 2020, 2023, Oracle and/or its affiliates.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2.0,
 * as published by the Free Software Foundation.
 *
 * This program is also distributed with certain software (including
 * but not limited to OpenSSL) that is licensed under separate terms, as
 * designated in a particular file or component or in included license
 * documentation. The authors of MySQL hereby grant you an additional
 * permission to link the program and your derivative works with the
 * separately licensed software that they have included with
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
 * the GNU General Public License, version 2.0, for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */

/* eslint-disable max-classes-per-file */
/* eslint-disable no-underscore-dangle */

// cspell: disable

import { MySQLParser } from "../generated/MySQLParser.js";
//import { MySQLBaseLexer } from "./MySQLBaseLexer.js";
import { MySQLLexer } from "../generated/MySQLLexer.js";

import { ErrorReportCallback } from "../support/helpers.js";
import {
    ATNSimulator, BaseErrorListener, FailedPredicateException, IntervalSet, NoViableAltException,
    RecognitionException, Recognizer, Token,
} from "../../../src/index.js";

class Vocabulary {
    public getDisplayName(_symbol: number): string {
        return "";
    }
}

class LexerNoViableAltException extends RecognitionException {
}

class InputMismatchException extends RecognitionException {
}

export class MySQLErrorListener extends BaseErrorListener {

    private static simpleRules: Set<number> = new Set([
        MySQLParser.RULE_identifier,
        MySQLParser.RULE_qualifiedIdentifier,
    ]);

    private static objectNames: Map<number, string> = new Map([
        [MySQLParser.RULE_columnName, "column"],
        [MySQLParser.RULE_columnRef, "column"],
        [MySQLParser.RULE_columnInternalRef, "column"],
        [MySQLParser.RULE_indexName, "index"],
        [MySQLParser.RULE_indexRef, "index"],
        [MySQLParser.RULE_schemaName, "schema"],
        [MySQLParser.RULE_schemaRef, "schema"],
        [MySQLParser.RULE_procedureName, "procedure"],
        [MySQLParser.RULE_procedureRef, "procedure"],
        [MySQLParser.RULE_functionName, "function"],
        [MySQLParser.RULE_functionRef, "function"],
        [MySQLParser.RULE_triggerName, "trigger"],
        [MySQLParser.RULE_triggerRef, "trigger"],
        [MySQLParser.RULE_viewName, "view"],
        [MySQLParser.RULE_viewRef, "view"],
        [MySQLParser.RULE_tablespaceName, "tablespace"],
        [MySQLParser.RULE_tablespaceRef, "tablespace"],
        [MySQLParser.RULE_logfileGroupName, "logfile group"],
        [MySQLParser.RULE_logfileGroupRef, "logfile group"],
        [MySQLParser.RULE_eventName, "event"],
        [MySQLParser.RULE_eventRef, "event"],
        [MySQLParser.RULE_udfName, "udf"],
        [MySQLParser.RULE_serverName, "server"],
        [MySQLParser.RULE_serverRef, "server"],
        [MySQLParser.RULE_engineRef, "engine"],
        [MySQLParser.RULE_tableName, "table"],
        [MySQLParser.RULE_tableRef, "table"],
        [MySQLParser.RULE_filterTableRef, "table"],
        [MySQLParser.RULE_tableRefWithWildcard, "table"],
        [MySQLParser.RULE_parameterName, "parameter"],
        [MySQLParser.RULE_labelIdentifier, "label"],
        [MySQLParser.RULE_labelRef, "label"],
        [MySQLParser.RULE_roleIdentifier, "role"],
        [MySQLParser.RULE_pluginRef, "plugin"],
        [MySQLParser.RULE_componentRef, "component"],
        [MySQLParser.RULE_resourceGroupRef, "resource group"],
        [MySQLParser.RULE_windowName, "window"],
    ]);

    public constructor(private callback: ErrorReportCallback) {
        super();
    }

    public override syntaxError = <T>(recognizer: Recognizer<ATNSimulator>, offendingSymbol: T | null,
        line: number, charPositionInLine: number, msg: string, e: RecognitionException | null): void => {

        let message = "";

        // If not undefined then offendingSymbol is of type Token.
        if (offendingSymbol) {
            // Need to clone the symbol to avoid releasing the original token prematurely.
            let token = offendingSymbol as unknown as Token;

            const parser = recognizer as MySQLParser;
            // const lexer = parser._input.getTokenSource() as MySQLBaseLexer;
            const isEof = token.type === Token.EOF;
            if (isEof) {
                token = parser.tokenStream.get(token.tokenIndex - 1);
            }

            const errorLength = token.stop - token.start + 1;
            let wrongText = token.text ?? "";

            // getExpectedTokens() ignores predicates, so it might include the token for which we got this syntax error,
            // if that was excluded by a predicate (which in our case is always a version check).
            // That's a good indicator to tell the user that this keyword is not valid *for the current server version*.
            let expected = parser.getExpectedTokens();
            let invalidForVersion = false;
            const tokenType = token.type;
            if (tokenType !== MySQLLexer.IDENTIFIER && expected.contains(tokenType)) {
                invalidForVersion = true;
            } else {
                /*
                tokenType = lexer.keywordFromText(wrongText);
                if (expected.contains(tokenType)) {
                    invalidForVersion = true;
                }
                */
            }

            if (invalidForVersion) {
                // The expected tokens set is read-only, so make a copy.
                expected = new IntervalSet(expected);
                expected.removeOne(tokenType);
            }

            // Try to find the expected input by examining the current parser context and
            // the expected interval set. The latter often lists useless keywords, especially if they are allowed
            // as identifiers.
            let expectedText = "";

            // Walk up from generic rules to reach something that gives us more context, if needed.
            let context = parser.context;
            while (context?.parent && MySQLErrorListener.simpleRules.has(context.ruleIndex)) {
                context = context.parent;
            }

            switch (context?.ruleIndex) {
                case MySQLParser.RULE_functionCall:
                    expectedText = "a complete function call or other expression";
                    break;

                case MySQLParser.RULE_expr:
                    expectedText = "an expression";
                    break;

                case MySQLParser.RULE_columnName:
                case MySQLParser.RULE_indexName:
                case MySQLParser.RULE_schemaName:
                case MySQLParser.RULE_procedureName:
                case MySQLParser.RULE_functionName:
                case MySQLParser.RULE_triggerName:
                case MySQLParser.RULE_viewName:
                case MySQLParser.RULE_tablespaceName:
                case MySQLParser.RULE_logfileGroupName:
                case MySQLParser.RULE_eventName:
                case MySQLParser.RULE_udfName:
                case MySQLParser.RULE_serverName:
                case MySQLParser.RULE_tableName:
                case MySQLParser.RULE_parameterName:
                case MySQLParser.RULE_labelIdentifier:
                case MySQLParser.RULE_roleIdentifier:
                case MySQLParser.RULE_windowName: {
                    const name = MySQLErrorListener.objectNames.get(context.ruleIndex);
                    if (!name) {
                        expectedText = "a new object name";
                    } else {
                        expectedText = `a new ${name} name`;
                    }
                    break;
                }

                case MySQLParser.RULE_columnRef:
                case MySQLParser.RULE_indexRef:
                case MySQLParser.RULE_schemaRef:
                case MySQLParser.RULE_procedureRef:
                case MySQLParser.RULE_functionRef:
                case MySQLParser.RULE_triggerRef:
                case MySQLParser.RULE_viewRef:
                case MySQLParser.RULE_tablespaceRef:
                case MySQLParser.RULE_logfileGroupRef:
                case MySQLParser.RULE_eventRef:
                case MySQLParser.RULE_serverRef:
                case MySQLParser.RULE_engineRef:
                case MySQLParser.RULE_tableRef:
                case MySQLParser.RULE_filterTableRef:
                case MySQLParser.RULE_tableRefWithWildcard:
                case MySQLParser.RULE_labelRef:
                case MySQLParser.RULE_pluginRef:
                case MySQLParser.RULE_componentRef:
                case MySQLParser.RULE_resourceGroupRef: {
                    const name = MySQLErrorListener.objectNames.get(context.ruleIndex);
                    if (!name) {
                        expectedText = "the name of an existing object";
                    } else {
                        expectedText = "the name of an existing " + name;
                    }
                    break;
                }

                case MySQLParser.RULE_columnInternalRef: {
                    expectedText = "a column name from this table";
                    break;
                }

                default: {
                    // If the expected set contains the IDENTIFIER token we likely want an identifier at this position.
                    // Due to the fact that MySQL defines a number of keywords as possible identifiers, we get all those
                    // whenever an identifier is actually required, bloating so the expected set with irrelevant
                    // elements. Hence we check for the identifier entry and assume we *only* want an identifier.
                    // This gives an imprecise result if both certain keywords *and* an identifier are expected.
                    if (expected.contains(MySQLLexer.IDENTIFIER)) {
                        expectedText = "an identifier";
                    } else {
                        expectedText = this.intervalToString(expected, 6, new Vocabulary());
                    }
                    break;
                }
            }

            if (!wrongText.startsWith("\"") && !wrongText.startsWith("'") && !wrongText.startsWith("`")) {
                wrongText = "\"" + wrongText + "\"";
            }

            if (!e) {
                // Missing or unwanted tokens.
                if (msg.includes("missing")) {
                    if (expected.length === 1) {
                        message = "Missing " + expectedText;
                    }
                } else {
                    message = `Extraneous input ${wrongText} found, expecting ${expectedText}`;
                }
            } else {
                if (e instanceof InputMismatchException) {
                    if (isEof) {
                        message = "Statement is incomplete";
                    } else {
                        message = wrongText + " is not valid at this position";

                        if (expectedText.length > 0) {
                            message += ", expecting " + expectedText;
                        }
                    }
                } else if (e instanceof FailedPredicateException) {
                    // For cases like "... | a ({condition}? b)", but not "... | a ({condition}? b)?".
                    // Remove parts of the message we don't want.
                    const condition = e.message.substring("failed predicate: ".length);

                    condition.replace(/serverVersion/g, "server version");
                    condition.replace(/ && /g, "and");
                    message = wrongText + " is valid only for " + condition;
                } else if (e instanceof NoViableAltException) {
                    if (isEof) {
                        message = "Statement is incomplete";
                    } else {
                        message = wrongText + " is not valid at this position";
                        if (invalidForVersion) {
                            message += " for this server version";
                        }
                    }

                    if (expectedText.length > 0) {
                        message += ", expecting " + expectedText;
                    }
                } else {
                    message = msg;
                }
            }

            this.callback(message, token.type, token.start, line, charPositionInLine, errorLength);
        } else {
            // No offending symbol, which indicates this is a lexer error.
            if (e instanceof LexerNoViableAltException) {
                const lexer = recognizer as MySQLLexer;
                const input = lexer.inputStream;
                let text = lexer.getErrorDisplay(input.getText(lexer._tokenStartCharIndex, input.index));
                if (text === "") {
                    text = " ";  // Should never happen, but we must ensure we have text.
                }

                switch (text[0]) {
                    case "/":
                        message = "Unfinished multiline comment";
                        break;
                    case '"':
                        message = "Unfinished double quoted string literal";
                        break;
                    case "'":
                        message = "Unfinished single quoted string literal";
                        break;
                    case "`":
                        message = "Unfinished back tick quoted string literal";
                        break;

                    default:
                        // Hex or bin string?
                        if (text.length > 1 && text[1] === "'" && (text.startsWith("x") || text.startsWith("b"))) {
                            message = "Unfinished " + (text.startsWith("x") ? "hex" : "binary") + " string literal";
                            break;
                        }

                        // Something else the lexer couldn't make sense of.
                        // Likely there is no rule that accepts this input.
                        message = "\"" + text + "\" is no valid input at all";
                        break;
                }

                this.callback(message, 0, lexer._tokenStartCharIndex, line, charPositionInLine,
                    input.index - lexer._tokenStartCharIndex);

            }
        }
    };

    private intervalToString(set: IntervalSet, maxCount: number, vocabulary: Vocabulary): string {
        //const symbols = set.toList();
        const symbols: number[] = [];

        if (symbols.length === 0) {
            return "";
        }

        let result = "";
        let firstEntry = true;
        maxCount = Math.min(maxCount, symbols.length);
        for (let i = 0; i < maxCount; ++i) {
            const symbol = symbols[i];
            if (!firstEntry) {
                result += ", ";
            }
            firstEntry = false;

            if (symbol < 0) {
                result += "EOF";
            } else {
                let name = vocabulary.getDisplayName(symbol);
                if (name === "BACK_TICK_QUOTED_ID") {
                    name = "`text`";
                } else if (name === "DOUBLE_QUOTED_TEXT") {
                    name = "\"text\"";
                } else if (name === "SINGLE_QUOTED_TEXT") {
                    name = "'text'";
                } else {
                    name = name.replace("_SYMBOL", "");
                    name = name.replace("_OPERATOR", "");
                    name = name.replace("_NUMBER", "");
                }
                result += name;
            }
        }

        if (maxCount < symbols.length) {
            result += ", ...";
        }

        return result;
    }
}
