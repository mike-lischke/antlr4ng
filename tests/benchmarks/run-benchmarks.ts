/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable no-underscore-dangle */

import * as fs from "fs";
import path from "path";
import assert from "assert";
import { fileURLToPath } from "url";

import { ParseServiceJS } from "./ParseServiceJS.js";

import { IParserErrorInfo, MySQLParseUnit, StatementFinishState, determineStatementRanges } from "./support/helpers.js";

const __filename = fileURLToPath(import.meta.url);

const charSets = new Set<string>();
const content = fs.readFileSync(path.join(path.dirname(__filename), "./data/rdbms-info.json"), { encoding: "utf-8" });
const rdbmsInfo = JSON.parse(content) as { characterSets: { [name: string]: string; }; };
Object.keys(rdbmsInfo.characterSets).forEach((set: string) => {
    charSets.add("_" + set.toLowerCase());
});

const jsService = new ParseServiceJS(charSets);

interface ITestFile {
    name: string;
    initialDelimiter: string;
}

/** Information about a statement with version information. */
interface IVersionCheckResult {
    /** True if the version in the statement matched a given version. */
    matched: boolean;

    /** The statement with stripped version information. */
    statement: string;

    /** The found version. Can be 0 if the statement contains no version. */
    version: number;
}

const versionPattern = /^\[(<|<=|>|>=|=)(\d{5})\]/;
const relationMap = new Map<string, number>([
    ["<", 0], ["<=", 1], ["=", 2], [">=", 3], [">", 4],
]);

/**
 * Similar like checkStatementVersion, but only extracts the statement version and checks that against the given
 * minimum version. Relational operators are only used to adjust the extracted version.
 *
 * @param statement The statement with an optional version part at the beginning.
 * @param minimumVersion The server version to match the version part against.
 *
 * @returns The check result.
 */
export const checkMinStatementVersion = (statement: string, minimumVersion: number): IVersionCheckResult => {
    const result: IVersionCheckResult = {
        matched: true,
        statement,
        version: minimumVersion,
    };

    const matches = statement.match(versionPattern);
    if (matches) {
        result.statement = statement.replace(versionPattern, "");

        const relation = matches[1];
        result.version = parseInt(matches[2], 10);

        switch (relationMap.get(relation)) {
            case 0: { // Less than the given version.
                --result.version;

                break;
            }

            case 4: { // Greater than the given version.
                ++result.version;

                break;
            }

            default:
        }
    }

    result.matched = result.version >= minimumVersion;

    return result;
};

const splitterTest = () => {
    const data = fs.readFileSync(path.join(path.dirname(__filename), "/data/sakila-db/sakila-data.sql"),
        { encoding: "utf-8" });
    assert(data.length === 3231413);

    let ranges = determineStatementRanges(data, ";");
    assert(ranges.length === 57);

    const r1 = ranges[0];

    // A range includes all whitespaces/comments before it. The file starts with a copyright notice so all of it
    // is part of the first range.
    assert(r1.contentStart - r1.span.start === 1533);
    const s1 = data.substring(r1.contentStart, r1.span.start + r1.span.length);
    assert(s1 === "SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;");

    const r2 = ranges[56];
    const s2 = data.substring(r2.contentStart, r2.span.start + r2.span.length);
    assert(s2 === "SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;");

    const statement = fs.readFileSync(path.join(path.dirname(__filename), "./data/sakila-db/single_statement.sql"),
        { encoding: "utf-8" });
    assert(statement.length === 30349);

    const r3 = ranges[30];
    const s3 = data.substring(r3.contentStart, r3.span.start + r3.span.length);
    assert(s3 === statement);

    const schema = fs.readFileSync(path.join(path.dirname(__filename), "./data/sakila-db/sakila-schema.sql"),
        { encoding: "utf-8" });
    assert(schema.length === 23219);

    ranges = determineStatementRanges(schema, ";");
    assert(ranges.length === 56);

    const r4 = ranges[43];
    const s4 = schema.substring(r4.contentStart, r4.span.start + r4.span.length);
    assert(r4.state === StatementFinishState.DelimiterChange);
    assert(s4 === "DELIMITER $$");
    assert(r4.delimiter === "$$");
};

/**
 * Parses a number of files and returns the time it took to parse them.
 *
 * @param logResults If true, the number of statements found in each file and the duration is logged.
 *
 * @returns The time it took to parse each file.
 */
const parseFiles = (logResults: boolean): number[] => {
    const testFiles: ITestFile[] = [
        // Large set of all possible query types in different combinations and versions.
        { name: "./data/statements.txt", initialDelimiter: "$$" },

        // The largest of the example files from the grammar repository:
        // (https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples)
        { name: "./data/bitrix_queries_cut.sql", initialDelimiter: ";" },

        // Not so many, but some very long insert statements.
        { name: "./data/sakila-db/sakila-data.sql", initialDelimiter: ";" },
    ];

    const result: number[] = [];
    testFiles.forEach((entry, index) => {
        const sql = fs.readFileSync(path.join(path.dirname(__filename), entry.name), { encoding: "utf-8" });

        const ranges = determineStatementRanges(sql, entry.initialDelimiter);

        if (logResults) {
            console.log(`    Found ${ranges.length} statements in file ${index + 1} (${entry.name}).`);
        }

        const timestamp = performance.now();
        ranges.forEach((range, index) => {
            // The delimiter is considered part of the statement (e.g. for editing purposes)
            // but must be ignored for parsing.
            const end = range.span.start + range.span.length - (range.delimiter?.length ?? 0);
            const statement = sql.substring(range.span.start, end).trim();

            // The parser only supports syntax from 8.0 onwards. So we expect errors for older statements.
            const checkResult = checkMinStatementVersion(statement, 80031);
            if (checkResult.matched) {
                let error: IParserErrorInfo | undefined;
                const result = jsService.errorCheck(checkResult.statement, MySQLParseUnit.Generic,
                    checkResult.version, "ANSI_QUOTES");
                if (!result) {
                    const errors = jsService.errorsWithOffset(0);
                    error = errors[0];
                }

                if (error) {
                    assert(false, `This query failed to parse (${index}: ${checkResult.version}):\n${statement}\n` +
                        `with error: ${error.message}, line: ${error.line - 1}, column: ${error.offset}`);
                }
            } else {
                // Ignore all other statements. Since we don't check for versions below 8.0 in the grammar they
                // may unexpectedly succeed.
            }
        });

        const duration = performance.now() - timestamp;
        if (logResults) {
            console.log("    Parsing all statements took: " + duration + " ms");
        }

        result.push(duration);
    });

    return result;
};

const parserRun = (showOutput: boolean): number[] => {
    let result: number[] = [];
    const timestamp = performance.now();
    try {
        result = parseFiles(showOutput);
    } catch (e) {
        console.error(e);
    } finally {
        if (showOutput) {
            console.log(`Overall parse run took ${(performance.now() - timestamp)} ms`);
        }
    }

    result.push(performance.now() - timestamp);

    return result;
};

console.log("\n\nStarting MySQL JS/TS benchmarks");
const timestamp = performance.now();

// Must ensure splitting query files works as expected.
splitterTest();

console.log("Splitter tests took " + (performance.now() - timestamp) + " ms");

console.log("Running antlr4ng parser once (cold) ");
parserRun(true);

process.stdout.write("Running antlr4ng parser 5 times (warm) ");

const times: number[][] = [];

// Run the parser a few times to get a better average.
for (let i = 0; i < 5; ++i) {
    times.push(parserRun(false));
    process.stdout.write(".");
}
console.log();

// Transpose the result matrix.
const transposed: number[][] = [];
for (let i = 0; i < times[0].length; ++i) {
    transposed.push([]);
    for (const row of times) {
        transposed[i].push(row[i]);
    }
}

// Remove the 2 slowest runs in each row and compute the average of the remaining 3.
const averageTimes: number[] = [];
for (const row of transposed) {
    const values = row.sort().slice(0, 3);
    averageTimes.push(values.reduce((sum, time) => { return sum + time; }, 0) / values.length);
}

for (let i = 0; i < averageTimes.length - 1; ++i) {
    console.log(`    File ${i + 1} took ${averageTimes[i]} ms`);
}

console.log(`Overall parse run took ${averageTimes[averageTimes.length - 1]} ms`);

console.log("Done");
