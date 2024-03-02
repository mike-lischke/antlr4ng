/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStreamImpl as CharStream, IntStream, Interval } from "../src/index.js";

const unicodeInput = "Hello 👋, World! 😁";

describe("CharStream", () => {
    describe("constructor", () => {
        it("should initialize the CharStream with the provided string data", () => {
            const charStream = new CharStream(unicodeInput);
            expect(charStream.toString()).toBe(unicodeInput);
        });
    });

    describe("reset", () => {
        it("should reset the CharStream index to 0", () => {
            const charStream = new CharStream(unicodeInput);
            charStream.index = 5;
            charStream.reset();
            expect(charStream.index).toBe(0);
        });
    });

    describe("consume", () => {
        it("should increment the CharStream index by 1", () => {
            const charStream = new CharStream(unicodeInput);
            charStream.consume();
            expect(charStream.index).toBe(1);
        });

        it("should throw an error if the CharStream index is at the end of the data", () => {
            const charStream = new CharStream(unicodeInput);
            charStream.index = charStream.size;
            expect(() => { return charStream.consume(); }).toThrow("cannot consume EOF");
        });
    });

    describe("LA", () => {
        it("should return the character at the specified offset from the current index", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.LA(7);
            expect(result).toBe("👋".codePointAt(0));
        });

        it("should return 0 if the offset is 0", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.LA(0);
            expect(result).toBe(0);
        });

        it("should return Token.EOF if the offset is out of range", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.LA(20);
            expect(result).toBe(-1);
        });
    });

    describe("mark/release", () => {
        it("should return -1 for mark", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.mark();
            expect(result).toBe(-1);
        });

        it("should do nothing for release", () => {
            const charStream = new CharStream(unicodeInput);
            expect(() => { return charStream.release(0); }).not.toThrow();
        });
    });

    describe("seek", () => {
        it("should set the CharStream index to the specified index if it is less than or equal to the current index",
            () => {
                const charStream = new CharStream(unicodeInput);
                charStream.index = 5;
                charStream.seek(3);
                expect(charStream.index).toBe(3);
            });

        it("should set the CharStream index to the specified index if it is greater than the current index", () => {
            const charStream = new CharStream(unicodeInput);
            charStream.index = 5;
            charStream.seek(8);
            expect(charStream.index).toBe(8);
        });

        it("should not set CharStream index beyond the data length", () => {
            const charStream = new CharStream(unicodeInput);
            charStream.index = 5;
            charStream.seek(20);
            expect(charStream.index).toBe(17);
        });
    });

    describe("getText", () => {
        it("should return an empty string if the begin index is greater than or equal to the data length", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.getTextFromRange(20, 10);
            expect(result).toBe("");
        });

        it("should return the correct substring when given an interval", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.getTextFromInterval(new Interval(6, 11));
            expect(result).toBe("👋, Wor");
        });

        it("should return the correct substring when given a start and stop index", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.getTextFromRange(8, 11);
            expect(result).toBe(" Wor");
        });

        it("should handle stop index greater than data length", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.getTextFromRange(7, 20);
            expect(result).toBe(", World! 😁");
        });

    });

    describe("toString", () => {
        it("should return the string data of the CharStream", () => {
            const data = unicodeInput;
            const charStream = new CharStream(data);
            const result = charStream.toString();
            expect(result).toBe(data);
        });
    });

    describe("size", () => {
        it("should return the size of the CharStream data", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.size;
            expect(result).toBe(17);
        });
    });

    describe("getSourceName", () => {
        it("should return the name of the CharStream if it is set", () => {
            const charStream = new CharStream(unicodeInput);
            charStream.name = "Test";
            const result = charStream.getSourceName();
            expect(result).toBe("Test");
        });

        it("should return IntStream.UNKNOWN_SOURCE_NAME if the name is not set", () => {
            const charStream = new CharStream(unicodeInput);
            const result = charStream.getSourceName();
            expect(result).toBe(IntStream.UNKNOWN_SOURCE_NAME);
        });
    });
});
