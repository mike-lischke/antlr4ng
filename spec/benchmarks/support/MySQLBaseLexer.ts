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

/* eslint-disable no-underscore-dangle */
/* cspell: ignore ULONGLONG, MULT, MAXDB */

import { Lexer, Token } from "antlr4ng";

import { MySQLLexer } from "../generated/MySQLLexer.js";

import { IMySQLRecognizerCommon, SqlMode } from "./MySQLRecognizerCommon.js";

// The base lexer class provides a number of functions needed in actions in the lexer (grammar).
export abstract class MySQLBaseLexer extends Lexer implements IMySQLRecognizerCommon {
    public serverVersion = 0;
    public sqlModes = new Set<SqlMode>();

    public charSets: Set<string> = new Set(); // Used to check repertoires.
    protected inVersionComment = false;

    private pendingTokens: Token[] = [];
    private symbols: Map<string, number> = new Map(); // A list of all defined symbols for lookup.

    /**
     * Determines if the given type is a relational operator.
     *
     * @param type The type to check.
     *
     * @returns True if the type is a relational operator.
     */
    public static isRelation(type: number): boolean {
        switch (type) {
            case MySQLLexer.EQUAL_OPERATOR:
            case MySQLLexer.ASSIGN_OPERATOR:
            case MySQLLexer.NULL_SAFE_EQUAL_OPERATOR:
            case MySQLLexer.GREATER_OR_EQUAL_OPERATOR:
            case MySQLLexer.GREATER_THAN_OPERATOR:
            case MySQLLexer.LESS_OR_EQUAL_OPERATOR:
            case MySQLLexer.LESS_THAN_OPERATOR:
            case MySQLLexer.NOT_EQUAL_OPERATOR:
            case MySQLLexer.NOT_EQUAL2_OPERATOR:
            case MySQLLexer.PLUS_OPERATOR:
            case MySQLLexer.MINUS_OPERATOR:
            case MySQLLexer.MULT_OPERATOR:
            case MySQLLexer.DIV_OPERATOR:
            case MySQLLexer.MOD_OPERATOR:
            case MySQLLexer.LOGICAL_NOT_OPERATOR:
            case MySQLLexer.BITWISE_NOT_OPERATOR:
            case MySQLLexer.SHIFT_LEFT_OPERATOR:
            case MySQLLexer.SHIFT_RIGHT_OPERATOR:
            case MySQLLexer.LOGICAL_AND_OPERATOR:
            case MySQLLexer.BITWISE_AND_OPERATOR:
            case MySQLLexer.BITWISE_XOR_OPERATOR:
            case MySQLLexer.LOGICAL_OR_OPERATOR:
            case MySQLLexer.BITWISE_OR_OPERATOR:
            case MySQLLexer.OR_SYMBOL:
            case MySQLLexer.XOR_SYMBOL:
            case MySQLLexer.AND_SYMBOL:
            case MySQLLexer.IS_SYMBOL:
            case MySQLLexer.BETWEEN_SYMBOL:
            case MySQLLexer.LIKE_SYMBOL:
            case MySQLLexer.REGEXP_SYMBOL:
            case MySQLLexer.IN_SYMBOL:
            case MySQLLexer.SOUNDS_SYMBOL:
            case MySQLLexer.NOT_SYMBOL: {
                return true;
            }

            default: {
                return false;
            }
        }
    }

    /**
     * Determines if the given type is a number type.
     *
     * @param type The type to check.
     *
     * @returns True if the type is a number type.
     */
    public isNumber(type: number): boolean {
        switch (type) {
            case MySQLLexer.INT_NUMBER:
            case MySQLLexer.LONG_NUMBER:
            case MySQLLexer.ULONGLONG_NUMBER:
            case MySQLLexer.FLOAT_NUMBER:
            case MySQLLexer.HEX_NUMBER:
            case MySQLLexer.BIN_NUMBER:
            case MySQLLexer.DECIMAL_NUMBER: {
                return true;
            }

            default: {
                return false;
            }
        }
    }

    /**
     * Determines if the given type is a delimiter.
     *
     * @param type The type to check.
     *
     * @returns True if the type is an operator.
     */
    public isDelimiter(type: number): boolean {
        switch (type) {
            case MySQLLexer.DOT_SYMBOL:
            case MySQLLexer.COMMA_SYMBOL:
            case MySQLLexer.SEMICOLON_SYMBOL:
            case MySQLLexer.COLON_SYMBOL:
                return true;

            default:
                return false;
        }
    }

    /**
     * Determines if the given type is an operator.
     *
     * @param type The type to check.
     *
     * @returns True if the type is an operator.
     */
    public isOperator(type: number): boolean {
        switch (type) {
            case MySQLLexer.EQUAL_OPERATOR:
            case MySQLLexer.ASSIGN_OPERATOR:
            case MySQLLexer.NULL_SAFE_EQUAL_OPERATOR:
            case MySQLLexer.GREATER_OR_EQUAL_OPERATOR:
            case MySQLLexer.GREATER_THAN_OPERATOR:
            case MySQLLexer.LESS_OR_EQUAL_OPERATOR:
            case MySQLLexer.LESS_THAN_OPERATOR:
            case MySQLLexer.NOT_EQUAL_OPERATOR:
            case MySQLLexer.NOT_EQUAL2_OPERATOR:
            case MySQLLexer.PLUS_OPERATOR:
            case MySQLLexer.MINUS_OPERATOR:
            case MySQLLexer.MULT_OPERATOR:
            case MySQLLexer.DIV_OPERATOR:
            case MySQLLexer.MOD_OPERATOR:
            case MySQLLexer.LOGICAL_NOT_OPERATOR:
            case MySQLLexer.BITWISE_NOT_OPERATOR:
            case MySQLLexer.SHIFT_LEFT_OPERATOR:
            case MySQLLexer.SHIFT_RIGHT_OPERATOR:
            case MySQLLexer.LOGICAL_AND_OPERATOR:
            case MySQLLexer.BITWISE_AND_OPERATOR:
            case MySQLLexer.BITWISE_XOR_OPERATOR:
            case MySQLLexer.LOGICAL_OR_OPERATOR:
            case MySQLLexer.BITWISE_OR_OPERATOR:
            case MySQLLexer.OPEN_PAR_SYMBOL:
            case MySQLLexer.CLOSE_PAR_SYMBOL:
            case MySQLLexer.AT_SIGN_SYMBOL:
            case MySQLLexer.AT_AT_SIGN_SYMBOL:
            case MySQLLexer.PARAM_MARKER:
            case MySQLLexer.ALL_SYMBOL:
            case MySQLLexer.AND_SYMBOL:
            case MySQLLexer.ANY_SYMBOL:
            case MySQLLexer.BETWEEN_SYMBOL:
            case MySQLLexer.EXISTS_SYMBOL:
            case MySQLLexer.IN_SYMBOL:
            case MySQLLexer.LIKE_SYMBOL:
            case MySQLLexer.NOT_SYMBOL:
            case MySQLLexer.OR_SYMBOL:
            case MySQLLexer.SOME_SYMBOL:
            case MySQLLexer.EXCEPT_SYMBOL:
            case MySQLLexer.INTERSECT_SYMBOL:
            case MySQLLexer.UNION_SYMBOL:
            case MySQLLexer.CROSS_SYMBOL:
            case MySQLLexer.FULL_SYMBOL:
            case MySQLLexer.INNER_SYMBOL:
            case MySQLLexer.JOIN_SYMBOL:
            case MySQLLexer.LEFT_SYMBOL:
            case MySQLLexer.NATURAL_SYMBOL:
            case MySQLLexer.OUTER_SYMBOL:
            case MySQLLexer.RIGHT_SYMBOL:
            case MySQLLexer.STRAIGHT_JOIN_SYMBOL:
            case MySQLLexer.CONTAINS_SYMBOL:
            case MySQLLexer.IS_SYMBOL:
            case MySQLLexer.NULL_SYMBOL:
                return true;

            default:
                return false;
        }
    }

    /**
     * Determines if the given SQL mode is currently active in the lexer.
     *
     * @param mode The mode to check.
     *
     * @returns True if the mode is one of the currently active modes.
     */
    public isSqlModeActive(mode: SqlMode): boolean {
        return this.sqlModes.has(mode);
    }

    /**
     * Converts a mode string into individual mode flags.
     *
     * @param modes The input string to parse.
     */
    public sqlModeFromString(modes: string): void {
        this.sqlModes = new Set<SqlMode>();

        const parts = modes.toUpperCase().split(",");
        parts.forEach((mode: string) => {
            if (mode === "ANSI" || mode === "DB2" || mode === "MAXDB" || mode === "MSSQL" || mode === "ORACLE" ||
                mode === "POSTGRESQL") {
                this.sqlModes.add(SqlMode.AnsiQuotes).add(SqlMode.PipesAsConcat).add(SqlMode.IgnoreSpace);
            } else if (mode === "ANSI_QUOTES") {
                this.sqlModes.add(SqlMode.AnsiQuotes);
            } else if (mode === "PIPES_AS_CONCAT") {
                this.sqlModes.add(SqlMode.PipesAsConcat);
            } else if (mode === "NO_BACKSLASH_ESCAPES") {
                this.sqlModes.add(SqlMode.NoBackslashEscapes);
            } else if (mode === "IGNORE_SPACE") {
                this.sqlModes.add(SqlMode.IgnoreSpace);
            } else if (mode === "HIGH_NOT_PRECEDENCE" || mode === "MYSQL323" || mode === "MYSQL40") {
                this.sqlModes.add(SqlMode.HighNotPrecedence);
            }
        });
    }

    /**
     * Resets the lexer by setting initial values to transient member, resetting the input stream position etc.
     */
    public override reset(): void {
        this.inVersionComment = false;
        super.reset();
    }

    /**
     * Implements the multi token feature required in our lexer.
     * A lexer rule can emit more than a single token, if needed.
     *
     * @returns The next token in the token stream.
     */
    public override nextToken(): Token {
        // First respond with pending tokens to the next token request, if there are any.
        let pending = this.pendingTokens.shift();
        if (pending) {
            return pending;
        }

        // Let the main lexer class run the next token recognition.
        // This might create additional tokens again.
        const next = super.nextToken();
        pending = this.pendingTokens.shift();
        if (pending) {
            this.pendingTokens.push(next);

            return pending;
        }

        return next;
    }

    /**
     * Checks if the version number in the token text is less than or equal to the current server version.
     *
     * @param text The text from a matched token.
     * @returns True if so the number matches, otherwise false.
     */
    protected checkMySQLVersion(text: string): boolean {
        if (text.length < 8) {// Minimum is: /*!12345
            return false;
        }

        // Skip version comment introducer.
        const version = parseInt(text.substr(3), 10);
        if (version <= this.serverVersion) {
            this.inVersionComment = true;

            return true;
        }

        return false;
    }

    /**
     * Called when a keyword was consumed that represents an internal MySQL function and checks if that keyword is
     * followed by an open parenthesis. If not then it is not considered a keyword but treated like a normal identifier.
     *
     * @param proposed The token type to use if the check succeeds.
     *
     * @returns If a function call is found then return the proposed token type, otherwise just IDENTIFIER.
     */
    protected determineFunction(proposed: number): number {
        // Skip any whitespace character if the sql mode says they should be ignored,
        // before actually trying to match the open parenthesis.
        let input = String.fromCharCode(this._input.LA(1));
        if (this.isSqlModeActive(SqlMode.IgnoreSpace)) {
            while (input === " " || input === "\t" || input === "\r" || input === "\n") {
                this._interp.consume(this._input);
                this._channel = Lexer.HIDDEN;
                this._type = MySQLLexer.WHITESPACE;
                input = String.fromCharCode(this._input.LA(1));
            }
        }

        return input === "(" ? proposed : MySQLLexer.IDENTIFIER;

    }

    /**
     * Checks the given text and determines the smallest number type from it. Code has been taken from sql_lex.cc.
     *
     * @param text The text to parse (which must be a number).
     *
     * @returns The token type for that text.
     */
    protected determineNumericType(text: string): number {
        const longString = "2147483647";
        const longLength = 10;
        const signedLongString = "-2147483648";
        const longLongString = "9223372036854775807";
        const longLongLength = 19;
        const signedLongLongString = "-9223372036854775808";
        const signedLongLongLength = 19;
        const unsignedLongLongString = "18446744073709551615";
        const unsignedLongLongLength = 20;

        // The original code checks for leading +/- but actually that can never happen, neither in the
        // server parser (as a digit is used to trigger processing in the lexer) nor in our parser
        // as our rules are defined without signs. But we do it anyway for maximum compatibility.
        let length = text.length - 1;
        if (length < longLength) { // quick normal case
            return MySQLLexer.INT_NUMBER;
        }

        let negative = false;
        let index = 0;
        if (text.charAt(index) === "+") { // Remove sign and pre-zeros
            ++index;
            --length;
        } else if (text.charAt(index) === "-") {
            ++index;
            --length;
            negative = true;
        }

        while (text.charAt(index) === "0" && length > 0) {
            ++index;
            --length;
        }

        if (length < longLength) {
            return MySQLLexer.INT_NUMBER;
        }

        let smaller: number;
        let bigger: number;
        let cmp: string;
        if (negative) {
            if (length === longLength) {
                cmp = signedLongString.substr(1);
                smaller = MySQLLexer.INT_NUMBER; // If <= signed_long_str
                bigger = MySQLLexer.LONG_NUMBER; // If >= signed_long_str
            } else if (length < signedLongLongLength) {
                return MySQLLexer.LONG_NUMBER;
            } else if (length > signedLongLongLength) {
                return MySQLLexer.DECIMAL_NUMBER;
            } else {
                cmp = signedLongLongString.substr(1);
                smaller = MySQLLexer.LONG_NUMBER; // If <= signed_longlong_str
                bigger = MySQLLexer.DECIMAL_NUMBER;
            }
        } else {
            if (length === longLength) {
                cmp = longString;
                smaller = MySQLLexer.INT_NUMBER;
                bigger = MySQLLexer.LONG_NUMBER;
            } else if (length < longLongLength) {
                return MySQLLexer.LONG_NUMBER;
            } else if (length > longLongLength) {
                if (length > unsignedLongLongLength) {
                    return MySQLLexer.DECIMAL_NUMBER;
                }
                cmp = unsignedLongLongString;
                smaller = MySQLLexer.ULONGLONG_NUMBER;
                bigger = MySQLLexer.DECIMAL_NUMBER;
            } else {
                cmp = longLongString;
                smaller = MySQLLexer.LONG_NUMBER;
                bigger = MySQLLexer.ULONGLONG_NUMBER;
            }
        }

        let otherIndex = 0;
        while (index < text.length && cmp.charAt(otherIndex++) === text.charAt(index++)) {
            //
        }

        return text.charAt(index - 1) <= cmp.charAt(otherIndex - 1) ? smaller : bigger;
    }

    /**
     * Checks if the given text corresponds to a charset defined in the server (text is preceded by an underscore).
     *
     * @param text The text to check.
     *
     * @returns UNDERSCORE_CHARSET if so, otherwise IDENTIFIER.
     */
    protected checkCharset(text: string): number {
        return this.charSets.has(text) ? MySQLLexer.UNDERSCORE_CHARSET : MySQLLexer.IDENTIFIER;
    }

    /**
     * Creates a DOT token in the token stream.
     */
    protected emitDot(): void {
        this.pendingTokens.push(this._factory.create([this, this._input], MySQLLexer.DOT_SYMBOL,
            this.text, this._channel, this._tokenStartCharIndex, this._tokenStartCharIndex, this._tokenStartLine,
            this._tokenStartColumn,
        ));

        ++this._tokenStartCharIndex;
    }
}
