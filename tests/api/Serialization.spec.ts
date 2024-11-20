/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, expect, it } from "vitest";

import { ATNDeserializer, ATNSerializer } from "../../src/index.js";
import { MySQLLexer } from "../benchmarks/generated/MySQLLexer.js";
import { MySQLParser } from "../benchmarks/generated/MySQLParser.js";

describe("Test Serialization and Deserialization", () => {
    it("Lexer", () => {
        // eslint-disable-next-line no-underscore-dangle
        const serialized = MySQLLexer._serializedATN;

        const deserializer = new ATNDeserializer();
        const atn = deserializer.deserialize(serialized);

        const serializer = new ATNSerializer(atn);
        const serialized2 = serializer.serialize();

        expect(serialized2.length).toBe(serialized.length);

        expect(serialized2).toEqual(serialized);
    });

    it("Parser", () => {
        // eslint-disable-next-line no-underscore-dangle
        const serialized = MySQLParser._serializedATN;

        const deserializer = new ATNDeserializer();
        const atn = deserializer.deserialize(serialized);

        const serializer = new ATNSerializer(atn);
        const serialized2 = serializer.serialize();

        expect(serialized2.length).toBe(serialized.length);

        expect(serialized2).toEqual(serialized);
    });
});
