/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, it, expect } from "vitest";

import { CharStream, Interval, IntStream } from "antlr4ng";

describe("TestCodePointCharStream", () => {
    it("emptyBytesHasSize0", () => {
        const s = CharStream.fromString("");
        expect(s.size).toBe(0);
        expect(s.index).toBe(0);
        expect(s.toString()).toBe("");
    });

    it("fromBMPStringHasExpectedSize", () => {
        const s = CharStream.fromString("hello");
        expect(s.size).toBe(5);
        expect(s.index).toBe(0);
        expect(s.toString()).toBe("hello");
    });

    it("fromSMPStringHasExpectedSize", () => {
        const s = CharStream.fromString("hello \uD83C\uDF0E");
        expect(s.size).toBe(7);
        expect(s.index).toBe(0);
        expect(s.toString()).toBe("hello \uD83C\uDF0E");
    });

    it("emptyBytesLookAheadReturnsEOF", () => {
        const s = CharStream.fromString("");
        expect(s.LA(1)).toBe(IntStream.EOF);
        expect(s.index).toBe(0);
    });

    it("consumingEmptyStreamShouldThrow", () => {
        const s = CharStream.fromString("");
        expect(() => { s.consume(); }).toThrow("cannot consume EOF");
    });

    it("singleLatinCodePointHasSize1", () => {
        const s = CharStream.fromString("X");
        expect(s.size).toBe(1);
    });

    it("consumingSingleLatinCodePointShouldMoveIndex", () => {
        const s = CharStream.fromString("X");
        expect(s.index).toBe(0);
        s.consume();
        expect(s.index).toBe(1);
    });

    it("consumingPastSingleLatinCodePointShouldThrow", () => {
        const s = CharStream.fromString("X");
        s.consume();
        expect(() => { s.consume(); }).toThrow("cannot consume EOF");
    });

    it("singleLatinCodePointLookAheadShouldReturnCodePoint", () => {
        const s = CharStream.fromString("X");
        expect(String.fromCodePoint(s.LA(1))).toBe("X");
        expect(s.index).toBe(0);
    });

    it("multipleLatinCodePointsLookAheadShouldReturnCodePoints", () => {
        const s = CharStream.fromString("XYZ");
        expect(String.fromCodePoint(s.LA(1))).toBe("X");
        expect(s.index).toBe(0);
        expect(String.fromCodePoint(s.LA(2))).toBe("Y");
        expect(s.index).toBe(0);
        expect(String.fromCodePoint(s.LA(3))).toBe("Z");
        expect(s.index).toBe(0);
    });

    it("singleLatinCodePointLookAheadPastEndShouldReturnEOF", () => {
        const s = CharStream.fromString("X");
        expect(s.LA(2)).toBe(IntStream.EOF);
    });

    it("singleCJKCodePointHasSize1", () => {
        const s = CharStream.fromString("\u611B");
        expect(s.size).toBe(1);
        expect(s.index).toBe(0);
    });

    it("consumingSingleCJKCodePointShouldMoveIndex", () => {
        const s = CharStream.fromString("\u611B");
        expect(s.index).toBe(0);
        s.consume();
        expect(s.index).toBe(1);
    });

    it("consumingPastSingleCJKCodePointShouldThrow", () => {
        const s = CharStream.fromString("\u611B");
        s.consume();
        expect(() => { s.consume(); }).toThrow("cannot consume EOF");
    });

    it("singleCJKCodePointLookAheadShouldReturnCodePoint", () => {
        const s = CharStream.fromString("\u611B");
        expect(s.LA(1)).toBe(0x611B);
        expect(s.index).toBe(0);
    });

    it("singleCJKCodePointLookAheadPastEndShouldReturnEOF", () => {
        const s = CharStream.fromString("\u611B");
        expect(s.LA(2)).toBe(IntStream.EOF);
        expect(s.index).toBe(0);
    });

    it("singleEmojiCodePointHasSize1", () => {
        const s = CharStream.fromString(String.fromCodePoint(0x1F4A9));
        expect(s.size).toBe(1);
        expect(s.index).toBe(0);
    });

    it("consumingSingleEmojiCodePointShouldMoveIndex", () => {
        const s = CharStream.fromString(String.fromCodePoint(0x1F4A9));
        expect(s.index).toBe(0);
        s.consume();
        expect(s.index).toBe(1);
    });

    it("consumingPastEndOfEmojiCodePointWithShouldThrow", () => {
        const s = CharStream.fromString(String.fromCodePoint(0x1F4A9));
        expect(s.index).toBe(0);
        s.consume();
        expect(s.index).toBe(1);
        expect((() => { s.consume(); })).toThrow("cannot consume EOF");
    });

    it("singleEmojiCodePointLookAheadShouldReturnCodePoint", () => {
        const s = CharStream.fromString(String.fromCodePoint(0x1F4A9));
        expect(s.LA(1)).toBe(0x1F4A9);
        expect(s.index).toBe(0);
    });

    it("singleEmojiCodePointLookAheadPastEndShouldReturnEOF", () => {
        const s = CharStream.fromString(String.fromCodePoint(0x1F4A9));
        expect(s.LA(2)).toBe(IntStream.EOF);
        expect(s.index).toBe(0);
    });

    it("getTextWithLatin", () => {
        const s = CharStream.fromString("0123456789");
        expect(s.getTextFromInterval(Interval.of(3, 7))).toBe("34567");
    });

    it("getTextWithCJK", () => {
        const s = CharStream.fromString("01234\u40946789");
        expect(s.getTextFromInterval(Interval.of(3, 7))).toBe("34\u409467");
    });

    it("getTextWithEmoji", () => {
        const emoji = String.fromCodePoint(0x1F522);
        const s = CharStream.fromString("01234" + emoji + "6789");
        expect(s.getTextFromInterval(Interval.of(3, 7))).toBe("34\uD83D\uDD2267");
    });

    it("toStringWithLatin", () => {
        const s = CharStream.fromString("0123456789");
        expect(s.toString()).toBe("0123456789");
    });

    it("toStringWithCJK", () => {
        const s = CharStream.fromString("01234\u40946789");
        expect(s.toString()).toBe("01234\u40946789");
    });

    it("toStringWithEmoji", () => {
        const emoji = String.fromCodePoint(0x1F522);
        const s = CharStream.fromString("01234" + emoji + "6789");
        expect(s.toString()).toBe("01234\uD83D\uDD226789");
    });

    it("lookAheadWithLatin", () => {
        const s = CharStream.fromString("0123456789");
        expect(String.fromCodePoint(s.LA(6))).toBe("5");
    });

    it("lookAheadWithCJK", () => {
        const s = CharStream.fromString("01234\u40946789");
        expect(s.LA(6)).toBe(0x4094);
    });

    it("lookAheadWithEmoji", () => {
        const emoji = String.fromCodePoint(0x1F522);
        const s = CharStream.fromString("01234" + emoji + "6789");
        expect(s.LA(6)).toBe(0x1F522);
    });

    it("seekWithLatin", () => {
        const s = CharStream.fromString("0123456789");
        s.seek(5);
        expect(String.fromCodePoint(s.LA(1))).toBe("5");
    });

    it("seekWithCJK", () => {
        const s = CharStream.fromString("01234\u40946789");
        s.seek(5);
        expect(s.LA(1)).toBe(0x4094);
    });

    it("seekWithEmoji", () => {
        const emoji = String.fromCodePoint(0x1F522);
        const s = CharStream.fromString("01234" + emoji + "6789");
        s.seek(5);
        expect(s.LA(1)).toBe(0x1F522);
    });

    it("lookBehindWithLatin", () => {
        const s = CharStream.fromString("0123456789");
        s.seek(6);
        expect(String.fromCodePoint(s.LA(-1))).toBe("5");
    });

    it("lookBehindWithCJK", () => {
        const s = CharStream.fromString("01234\u40946789");
        s.seek(6);
        expect(s.LA(-1)).toBe(0x4094);
    });

    it("lookBehindWithEmoji", () => {
        const emoji = String.fromCodePoint(0x1F522);
        const s = CharStream.fromString("01234" + emoji + "6789");
        s.seek(6);
        expect(s.LA(-1)).toBe(0x1F522);
    });
});
