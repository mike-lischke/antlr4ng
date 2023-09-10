/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/** Some code was taken from the MySQL Shell for VS Code extension. */

export const delimiterKeyword = /delimiter /i;

export type ErrorReportCallback = (message: string, tokenType: number, startIndex: number, line: number,
    column: number, length: number) => void;

export interface TextSpan {
    start: number;
    length: number;
}

/** Indicates how a statement ends. */
export enum StatementFinishState {
    /** Ends with a delimiter. */
    Complete,

    /** Ends with an open comment (multiline or single line w/o following new line). */
    OpenComment,

    /** A string (single, double or backtick quoted) wasn't closed. */
    OpenString,

    /** The delimiter is missing. */
    NoDelimiter,

    /** The statement changes the delimiter. */
    DelimiterChange,
}

export enum MySQLParseUnit {
    Generic,
    CreateSchema,
    CreateTable,
    CreateTrigger,
    CreateView,
    CreateFunction,
    CreateProcedure,
    CreateRoutine,
    CreateUdf,
    CreateEvent,
    CreateIndex,
    Grant,
    DataType,
    CreateLogfileGroup,
    CreateServer,
    CreateTablespace,
}

export interface IStatementSpan {
    /**
     * The delimiter with which this statement ended or undefined if no delimiter was found.
     */
    delimiter?: string;

    /** Start and length of the entire statement, including leading whitespaces. */
    span: TextSpan;

    contentStart: number;

    /** The offset where non-whitespace content starts. */
    state: StatementFinishState;
}

export interface IParserErrorInfo {
    message: string;
    tokenType: number;

    /** Offset from the beginning of the input to the error position. */
    charOffset: number;

    /** Error line. */
    line: number;

    /** Char offset in the error line to the error start position. */
    offset: number;
    length: number;
}

/**
 * Takes a block of SQL text and splits it into individual statements, by determining start position,
 * length and current delimiter for each. It is assumed the line break is a simple \n.
 * Note: the length includes anything up to (and including) the delimiter position.
 *
 * @param sql The SQL to split.
 * @param delimiter The initial delimiter to use.
 *
 * @returns A list of statement ranges.
 */
export const determineStatementRanges = (sql: string, delimiter: string): IStatementSpan[] => {
    const result: IStatementSpan[] = [];

    let start = 0;
    let head = start;
    let tail = head;
    const end = head + sql.length;

    let haveContent = false; // Set when anything else but comments were found for the current statement.

    /**
     * Checks the current tail position if that touches a delimiter. If that's the case then the current statement
     * is finished and a new one starts.
     *
     * @returns True if a delimiter was found, otherwise false.
     */
    const checkDelimiter = (): boolean => {
        if (sql[tail] === delimiter[0]) {
            // Found possible start of the delimiter. Check if it really is.
            if (delimiter.length === 1) {
                // Most common case.
                ++tail;
                result.push({
                    delimiter,
                    span: { start, length: tail - start },
                    contentStart: haveContent ? head : start,
                    state: StatementFinishState.Complete,
                });

                head = tail;
                start = head;
                haveContent = false;

                return true;
            } else {
                // Multi character delimiter?
                const candidate = sql.substring(tail, tail + delimiter.length);
                if (candidate === delimiter) {
                    // Multi char delimiter is complete. Tail still points to the start of the delimiter.
                    tail += delimiter.length;
                    result.push({
                        delimiter,
                        span: { start, length: tail - start },
                        contentStart: haveContent ? head : start,
                        state: StatementFinishState.Complete,
                    });

                    head = tail;
                    start = head;
                    haveContent = false;

                    return true;
                }
            }
        }

        return false;
    };

    while (tail < end) {
        if (!checkDelimiter()) {
            switch (sql[tail]) {
                case "/": { // Possible multi line comment or hidden (conditional) command.
                    if (sql[tail + 1] === "*") {
                        if (sql[tail + 2] === "!") { // Hidden command.
                            if (!haveContent) {
                                haveContent = true;
                                head = tail;
                            }
                            ++tail;
                        }
                        tail += 2;

                        while (true) {
                            while (tail < end && sql[tail] !== "*") {
                                ++tail;
                            }

                            if (tail === end) { // Unfinished multiline comment.
                                result.push({
                                    delimiter,
                                    span: { start, length: tail - start },
                                    contentStart: haveContent ? head : start,
                                    state: StatementFinishState.OpenComment,
                                });
                                start = tail;
                                head = tail;

                                break;
                            } else {
                                if (sql[++tail] === "/") {
                                    ++tail; // Skip the slash too.
                                    break;
                                }
                            }
                        }

                        if (!haveContent) {
                            head = tail; // Skip over the comment.
                        }

                    } else {
                        ++tail;
                        haveContent = true;
                    }

                    break;
                }

                case "-": { // Possible single line comment.
                    const temp = tail + 2;
                    if (sql[tail + 1] === "-" && (sql[temp] === " " || sql[temp] === "\t" || sql[temp] === "\n")) {
                        // Skip everything until the end of the line.
                        tail += 2;
                        while (tail < end && sql[tail] !== "\n") {
                            ++tail;
                        }

                        if (tail === end) { // Unfinished single line comment.
                            result.push({
                                delimiter,
                                span: { start, length: tail - start },
                                contentStart: haveContent ? head : start,
                                state: StatementFinishState.OpenComment,
                            });
                            start = tail;
                            head = tail;

                            break;
                        }

                        if (!haveContent) {
                            head = tail;
                        }
                    } else {
                        ++tail;
                        haveContent = true;
                    }

                    break;
                }

                case "#": { // MySQL single line comment.
                    while (tail < end && sql[tail] !== "\n") {
                        ++tail;
                    }

                    if (tail === end) { // Unfinished single line comment.
                        result.push({
                            delimiter,
                            span: { start, length: tail - start },
                            contentStart: haveContent ? head : start,
                            state: StatementFinishState.OpenComment,
                        });
                        start = tail;
                        head = tail;

                        break;
                    }

                    if (!haveContent) {
                        head = tail;
                    }

                    break;
                }

                case '"':
                case "'":
                case "`": { // Quoted string/id. Skip this in a local loop.
                    haveContent = true;
                    const quote = sql[tail++];
                    while (tail < end && sql[tail] !== quote) {
                        // Skip any escaped character too.
                        if (sql[tail] === "\\") {
                            ++tail;
                        }
                        ++tail;
                    }

                    if (sql[tail] === quote) {
                        ++tail; // Skip trailing quote char if one was there.
                    } else { // Unfinished single string.
                        result.push({
                            delimiter,
                            span: { start, length: tail - start },
                            contentStart: haveContent ? head : start,
                            state: StatementFinishState.OpenString,
                        });
                        start = tail;
                        head = tail;
                    }

                    break;
                }

                case "d":
                case "D": {
                    // Possible start of the DELIMITER word. Also consider the mandatory space char.
                    if (tail + 10 >= end) {
                        if (!haveContent) {
                            haveContent = true;
                            head = tail;
                        }
                        ++tail;
                        break; // Not enough input for that.
                    }

                    const candidate = sql.substring(tail, tail + 10);
                    if (candidate.match(delimiterKeyword)) {
                        // Delimiter keyword found - get the new delimiter (all consecutive letters).
                        // But first push anything we found so far and haven't pushed yet.
                        if (haveContent && tail > start) {
                            result.push({
                                delimiter,
                                span: { start, length: tail - start },
                                contentStart: head,
                                state: StatementFinishState.NoDelimiter,
                            });
                            start = tail;
                        }

                        head = tail;
                        tail += 10;
                        let run = tail;

                        // Skip leading spaces + tabs.
                        while (run < end && (sql[run] === " " || sql[run] === "\t")) {
                            ++run;
                        }
                        tail = run;

                        // Forward to the first whitespace after the current position (on this line).
                        while (run < end && sql[run] !== "\n" && sql[run] !== " " && sql[run] !== "\t") {
                            ++run;
                        }

                        delimiter = sql.substring(tail, run);
                        const length = delimiter.length;
                        if (length > 0) {
                            tail += length - delimiter.length;

                            result.push({
                                delimiter,
                                span: { start, length: run - start },
                                contentStart: head,
                                state: StatementFinishState.DelimiterChange,
                            });

                            tail = run;
                            head = tail;
                            start = head;
                            haveContent = false;
                        } else {
                            haveContent = true;
                            head = tail;
                        }
                    } else {
                        ++tail;

                        if (!haveContent) {
                            haveContent = true;
                            head = tail;
                        }
                    }

                    break;
                }

                default:
                    if (!haveContent && sql[tail] > " ") {
                        haveContent = true;
                        head = tail;
                    }
                    ++tail;

                    break;
            }
        }
    }

    // Add remaining text to the range list.
    if (head < end) {
        result.push({
            span: { start, length: end - start },
            contentStart: haveContent ? head : start - 1, // -1 to indicate no content
            state: StatementFinishState.NoDelimiter,
        });
    }

    return result;
};
