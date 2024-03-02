/*
 * Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { readFileSync } from "fs";

import { InterpreterDataReader } from "antlr4ng";

/**
 * This file represents a simple sanity checks on the parsing of the .interp file
 *  available to the Java runtime for interpreting rather than compiling and executing parsers.
 */
describe("TestInterpreterDataReader", () => {
    it("testLexerFile", () => {
        const content = readFileSync("tests/generated/VisitorCalcLexer.interp", "utf-8");
        const interpreterData = InterpreterDataReader.parseInterpreterData(content);

        expect(interpreterData.vocabulary.getMaxTokenType()).toBe(6);
        expect(interpreterData.ruleNames).toStrictEqual(["INT", "MUL", "DIV", "ADD", "SUB", "WS"]);
        expect(interpreterData.vocabulary.getLiteralNames())
            .toStrictEqual([null, null, "'*'", "'/'", "'+'", "'-'", null]);
        expect(interpreterData.vocabulary.getSymbolicNames())
            .toStrictEqual([null, "INT", "MUL", "DIV", "ADD", "SUB", "WS"]);
        expect(interpreterData.channels).toStrictEqual(["DEFAULT_TOKEN_CHANNEL", "HIDDEN"]);
        expect(interpreterData.modes).toStrictEqual(["DEFAULT_MODE"]);
    });

    it("testParserFile", () => {
        const content = readFileSync("tests/generated/VisitorCalc.interp", "utf-8");
        const interpreterData = InterpreterDataReader.parseInterpreterData(content);

        expect(interpreterData.vocabulary.getMaxTokenType()).toBe(6);
        expect(interpreterData.ruleNames).toStrictEqual(["s", "expr"]);
        expect(interpreterData.vocabulary.getLiteralNames())
            .toStrictEqual([null, null, "'*'", "'/'", "'+'", "'-'", null]);
        expect(interpreterData.vocabulary.getSymbolicNames())
            .toStrictEqual([null, "INT", "MUL", "DIV", "ADD", "SUB", "WS"]);
    });

});
