/* java2ts: keep */

/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// cspell: disable

import { CommonTokenStream, TokenStreamRewriter, Interval, CharStreams, Lexer, CharStream } from "antlr4ng";

import { T1 } from "../generated/T1.js";
import { T2 } from "../generated/T2.js";
import { T3 } from "../generated/T3.js";

/**
 * @param lexerClass The lexer class to use.
 * @param input The input to lex.
 *
 * @returns A new TokenStreamRewriter instance.
 */
const createRewriter = <T extends Lexer>(lexerClass: new (input: CharStream) => T, input: string) => {
    const chars = CharStreams.fromString(input);

    const lexer: T = new lexerClass(chars);
    const tokens = new CommonTokenStream(lexer);
    tokens.fill();

    return new TokenStreamRewriter(tokens);
};

describe("TestTokenStreamRewriter", () => {
    it("testInsertBeforeIndex0", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(0, "0");
        const result = tokens.getText();
        const expecting = "0abc";
        expect(result).toBe(expecting);
    });

    it("testInsertAfterLastIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertAfter(2, "x");
        const result = tokens.getText();
        const expecting = "abcx";
        expect(result).toBe(expecting);
    });

    it("test2InsertBeforeAfterMiddleIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(1, "x");
        tokens.insertAfter(1, "x");
        const result = tokens.getText();
        const expecting = "axbxc";
        expect(result).toBe(expecting);
    });

    it("testReplaceIndex0", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(0, "x");
        const result = tokens.getText();
        const expecting = "xbc";
        expect(result).toBe(expecting);
    });

    it("testReplaceLastIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(2, "x");
        const result = tokens.getText();
        const expecting = "abx";
        expect(result).toBe(expecting);
    });

    it("testReplaceMiddleIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(1, "x");
        const result = tokens.getText();
        const expecting = "axc";
        expect(result).toBe(expecting);
    });

    it("testToStringStartStop", () => {
        const tokens = createRewriter(T2, "x = 3 * 0;");
        tokens.replace(4, 8, "0");

        const stream = tokens.getTokenStream() as CommonTokenStream;
        stream.fill();

        // replace 3 * 0 with 0
        let result = stream.getText();
        let expecting = "x = 3 * 0;";
        expect(result).toBe(expecting);

        result = tokens.getText();
        expecting = "x = 0;";
        expect(result).toBe(expecting);

        result = tokens.getText(Interval.of(0, 9));
        expecting = "x = 0;";
        expect(result).toBe(expecting);

        result = tokens.getText(Interval.of(4, 8));
        expecting = "0";
        expect(result).toBe(expecting);
    });

    it("testToStringStartStop2", () => {
        const tokens = createRewriter(T3, "x = 3 * 0 + 2 * 0;");

        let result = tokens.getTokenStream().getText();
        let expecting = "x = 3 * 0 + 2 * 0;";
        expect(result).toBe(expecting);

        tokens.replace(4, 8, "0");

        const stream = tokens.getTokenStream() as CommonTokenStream;
        stream.fill();

        // replace 3 * 0 with 0
        result = tokens.getText();
        expecting = "x = 0 + 2 * 0;";
        expect(result).toBe(expecting);

        result = tokens.getText(Interval.of(0, 17));
        expecting = "x = 0 + 2 * 0;";
        expect(result).toBe(expecting);

        result = tokens.getText(Interval.of(4, 8));
        expecting = "0";
        expect(result).toBe(expecting);

        result = tokens.getText(Interval.of(0, 8));
        expecting = "x = 0";
        expect(result).toBe(expecting);

        result = tokens.getText(Interval.of(12, 16));
        expecting = "2 * 0";
        expect(result).toBe(expecting);

        tokens.insertAfter(17, "// comment");
        result = tokens.getText(Interval.of(12, 18));
        expecting = "2 * 0;// comment";
        expect(result).toBe(expecting);

        result = tokens.getText(Interval.of(0, 8));
        stream.fill();

        // try again after insert at end
        expecting = "x = 0";
        expect(result).toBe(expecting);
    });

    it("test2ReplaceMiddleIndex", () => {
        const tokens = createRewriter(T1, "abc");

        tokens.replaceSingle(1, "x");
        tokens.replaceSingle(1, "y");
        const result = tokens.getText();
        const expecting = "ayc";
        expect(result).toBe(expecting);
    });

    it("test2ReplaceMiddleIndex1InsertBefore", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(0, "_");
        tokens.replaceSingle(1, "x");
        tokens.replaceSingle(1, "y");
        const result = tokens.getText();
        const expecting = "_ayc";
        expect(result).toBe(expecting);
    });

    it("testReplaceThenDeleteMiddleIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(1, "x");
        tokens.delete(1);
        const result = tokens.getText();
        const expecting = "ac";
        expect(result).toBe(expecting);
    });

    it("testInsertInPriorReplace", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.replace(0, 2, "x");
        tokens.insertBefore(1, "0");
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "insert op <InsertBeforeOp@[@1,1:1='b',<2>,1:1]:\"0\"> within boundaries of previous " +
            "<ReplaceOp@[@0,0:0='a',<1>,1:0]..[@2,2:2='c',<3>,1:2]:\"x\">";
        expect(exc).not.toBeNull();
        expect(exc?.message).toBe(expecting);
    });

    it("testInsertThenReplaceSameIndex", () => {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;

        tokens.insertBefore(0, "0");
        tokens.replaceSingle(0, "x");
        stream.fill();

        // supercedes insert at 0
        const result = tokens.getText();
        const expecting = "0xbc";
        expect(result).toBe(expecting);
    });

    it("test2InsertMiddleIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(1, "x");
        tokens.insertBefore(1, "y");
        const result = tokens.getText();
        const expecting = "ayxbc";
        expect(result).toBe(expecting);
    });

    it("test2InsertThenReplaceIndex0", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(0, "x");
        tokens.insertBefore(0, "y");
        tokens.replaceSingle(0, "z");
        const result = tokens.getText();
        const expecting = "yxzbc";
        expect(result).toBe(expecting);
    });

    it("testReplaceThenInsertBeforeLastIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(2, "x");
        tokens.insertBefore(2, "y");
        const result = tokens.getText();
        const expecting = "abyx";
        expect(result).toBe(expecting);
    });

    it("testInsertThenReplaceLastIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(2, "y");
        tokens.replaceSingle(2, "x");
        const result = tokens.getText();
        const expecting = "abyx";
        expect(result).toBe(expecting);
    });

    it("testReplaceThenInsertAfterLastIndex", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.replaceSingle(2, "x");
        tokens.insertAfter(2, "y");
        const result = tokens.getText();
        const expecting = "abxy";
        expect(result).toBe(expecting);
    });

    it("testReplaceRangeThenInsertAtLeftEdge", () => {
        const tokens = createRewriter(T1, "abcccba");
        tokens.replace(2, 4, "x");
        tokens.insertBefore(2, "y");
        const result = tokens.getText();
        const expecting = "abyxba";
        expect(result).toBe(expecting);
    });

    it("testReplaceRangeThenInsertAtRightEdge", () => {
        const tokens = createRewriter(T1, "abcccba");
        const stream = tokens.getTokenStream() as CommonTokenStream;

        tokens.replace(2, 4, "x");
        tokens.insertBefore(4, "y");
        stream.fill(); // no effect; within range of a replace
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "insert op <InsertBeforeOp@[@4,4:4='c',<3>,1:4]:\"y\"> within boundaries of previous " +
            "<ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"x\">";
        expect(exc).not.toBeNull();
        expect(exc?.message).toBe(expecting);
    });

    it("testReplaceRangeThenInsertAfterRightEdge", () => {
        const tokens = createRewriter(T1, "abcccba");
        tokens.replace(2, 4, "x");
        tokens.insertAfter(4, "y");
        const result = tokens.getText();
        const expecting = "abxyba";
        expect(result).toBe(expecting);
    });

    it("testReplaceAll", () => {
        const tokens = createRewriter(T1, "abcccba");
        tokens.replace(0, 6, "x");
        const result = tokens.getText();
        const expecting = "x";
        expect(result).toBe(expecting);
    });

    it("testReplaceSubsetThenFetch", () => {
        const tokens = createRewriter(T1, "abcccba");
        tokens.replace(2, 4, "xyz");
        const result = tokens.getText(Interval.of(0, 6));
        const expecting = "abxyzba";
        expect(result).toBe(expecting);
    });

    it("testReplaceThenReplaceSuperset", () => {
        const tokens = createRewriter(T1, "abcccba");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(2, 4, "xyz");
        tokens.replace(3, 5, "foo");
        stream.fill();

        // overlaps, error
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "replace op boundaries of <ReplaceOp@[@3,3:3='c',<3>,1:3]..[@5,5:5='b',<2>,1:5]:\"foo\"> " +
            "overlap with previous <ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"xyz\">";
        expect(exc).not.toBeNull();
        expect(exc?.message).toBe(expecting);
    });

    it("testReplaceThenReplaceLowerIndexedSuperset", () => {
        const tokens = createRewriter(T1, "abcccba");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(2, 4, "xyz");
        tokens.replace(1, 3, "foo");
        stream.fill();

        // overlap, error
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "replace op boundaries of <ReplaceOp@[@1,1:1='b',<2>,1:1]..[@3,3:3='c',<3>,1:3]:\"foo\"> " +
            "overlap with previous <ReplaceOp@[@2,2:2='c',<3>,1:2]..[@4,4:4='c',<3>,1:4]:\"xyz\">";
        expect(exc).not.toBeNull();
        expect(exc?.message).toBe(expecting);
    });

    it("testReplaceSingleMiddleThenOverlappingSuperset", () => {
        const tokens = createRewriter(T1, "abcba");
        tokens.replace(2, 2, "xyz");
        tokens.replace(0, 3, "foo");
        const result = tokens.getText();
        const expecting = "fooa";
        expect(result).toBe(expecting);
    });

    it("testCombineInserts", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(0, "x");
        tokens.insertBefore(0, "y");
        const result = tokens.getText();
        const expecting = "yxabc";
        expect(result).toBe(expecting);
    });

    it("testCombine3Inserts", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(1, "x");
        tokens.insertBefore(0, "y");
        tokens.insertBefore(1, "z");
        const result = tokens.getText();
        const expecting = "yazxbc";
        expect(result).toBe(expecting);
    });

    it("testCombineInsertOnLeftWithReplace", () => {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(0, 2, "foo");
        tokens.insertBefore(0, "z");
        stream.fill();

        // combine with left edge of rewrite
        const result = tokens.getText();
        const expecting = "zfoo";
        expect(result).toBe(expecting);
    });

    it("testCombineInsertOnLeftWithDelete", () => {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.delete(0, 2);
        tokens.insertBefore(0, "z");
        stream.fill();

        // combine with left edge of rewrite
        const result = tokens.getText();
        const expecting = "z";
        stream.fill();

        // make sure combo is not znull
        expect(result).toBe(expecting);
    });

    it("testDisjointInserts", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(1, "x");
        tokens.insertBefore(2, "y");
        tokens.insertBefore(0, "z");
        const result = tokens.getText();
        const expecting = "zaxbyc";
        expect(result).toBe(expecting);
    });

    it("testOverlappingReplace", () => {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(1, 2, "foo");
        tokens.replace(0, 3, "bar");
        stream.fill();

        // wipes prior nested replace
        const result = tokens.getText();
        const expecting = "bar";
        expect(result).toBe(expecting);
    });

    it("testOverlappingReplace2", () => {
        const tokens = createRewriter(T1, "abcc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(0, 3, "bar");
        tokens.replace(1, 2, "foo");
        stream.fill();

        // cannot split earlier replace
        let exc = null;
        try {
            tokens.getText();
        } catch (iae) {
            if (iae instanceof Error) {
                exc = iae;
            } else {
                throw iae;
            }
        }
        const expecting = "replace op boundaries of <ReplaceOp@[@1,1:1='b',<2>,1:1]..[@2,2:2='c',<3>,1:2]:\"foo\"> " +
            "overlap with previous <ReplaceOp@[@0,0:0='a',<1>,1:0]..[@3,3:3='c',<3>,1:3]:\"bar\">";
        expect(exc).not.toBeNull();
        expect(exc?.message).toBe(expecting);
    });

    it("testOverlappingReplace3", () => {
        const tokens = createRewriter(T1, "abcc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(1, 2, "foo");
        tokens.replace(0, 2, "bar");
        stream.fill();

        // wipes prior nested replace
        const result = tokens.getText();
        const expecting = "barc";
        expect(result).toBe(expecting);
    });

    it("testOverlappingReplace4", () => {
        const tokens = createRewriter(T1, "abcc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(1, 2, "foo");
        tokens.replace(1, 3, "bar");
        stream.fill();

        // wipes prior nested replace
        const result = tokens.getText();
        const expecting = "abar";
        expect(result).toBe(expecting);
    });

    it("testDropIdenticalReplace", () => {
        const tokens = createRewriter(T1, "abcc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.replace(1, 2, "foo");
        tokens.replace(1, 2, "foo");
        stream.fill();

        // drop previous, identical
        const result = tokens.getText();
        const expecting = "afooc";
        expect(result).toBe(expecting);
    });

    it("testDropPrevCoveredInsert", () => {
        const tokens = createRewriter(T1, "abc");
        const stream = tokens.getTokenStream() as CommonTokenStream;
        tokens.insertBefore(1, "foo");
        tokens.replace(1, 2, "foo");
        stream.fill();

        // kill prev insert
        const result = tokens.getText();
        const expecting = "afoofoo";
        expect(result).toBe(expecting);
    });

    it("testLeaveAloneDisjointInsert", () => {
        const tokens = createRewriter(T1, "abcc");
        tokens.insertBefore(1, "x");
        tokens.replace(2, 3, "foo");
        const result = tokens.getText();
        const expecting = "axbfoo";
        expect(result).toBe(expecting);
    });

    it("testLeaveAloneDisjointInsert2", () => {
        const tokens = createRewriter(T1, "abcc");
        tokens.replace(2, 3, "foo");
        tokens.insertBefore(1, "x");
        const result = tokens.getText();
        const expecting = "axbfoo";
        expect(result).toBe(expecting);
    });

    it("testInsertBeforeTokenThenDeleteThatToken", () => {
        const tokens = createRewriter(T1, "abc");
        tokens.insertBefore(2, "y");
        tokens.delete(2);
        const result = tokens.getText();
        const expecting = "aby";
        expect(result).toBe(expecting);
    });

    // Test Fix for https://github.com/antlr/antlr4/issues/550
    it("testDistinguishBetweenInsertAfterAndInsertBeforeToPreserverOrder", () => {
        const tokens = createRewriter(T1, "aa");
        tokens.insertBefore(0, "<b>");
        tokens.insertAfter(0, "</b>");
        tokens.insertBefore(1, "<b>");
        tokens.insertAfter(1, "</b>");
        const result = tokens.getText();
        const expecting = "<b>a</b><b>a</b>"; // fails with <b>a<b></b>a</b>"
        expect(result).toBe(expecting);
    });

    it("testDistinguishBetweenInsertAfterAndInsertBeforeToPreserverOrder2", () => {
        const tokens = createRewriter(T1, "aa");
        tokens.insertBefore(0, "<p>");
        tokens.insertBefore(0, "<b>");
        tokens.insertAfter(0, "</p>");
        tokens.insertAfter(0, "</b>");
        tokens.insertBefore(1, "<b>");
        tokens.insertAfter(1, "</b>");
        const result = tokens.getText();
        const expecting = "<b><p>a</p></b><b>a</b>";
        expect(result).toBe(expecting);
    });

    // Test Fix for https://github.com/antlr/antlr4/issues/550
    it("testPreservesOrderOfContiguousInserts", () => {
        const tokens = createRewriter(T1, "ab");
        tokens.insertBefore(0, "<p>");
        tokens.insertBefore(0, "<b>");
        tokens.insertBefore(0, "<div>");
        tokens.insertAfter(0, "</p>");
        tokens.insertAfter(0, "</b>");
        tokens.insertAfter(0, "</div>");
        tokens.insertBefore(1, "!");
        const result = tokens.getText();
        const expecting = "<div><b><p>a</p></b></div>!b";
        expect(result).toBe(expecting);
    });

});
