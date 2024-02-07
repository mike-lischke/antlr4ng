/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { readFileSync, statSync } from "fs";
import { basename } from "path";

import { CharStream, CharStreams, CommonTokenStream, Lexer } from "antlr4ng";
import { printf } from "fast-printf";

import { JavaLexer } from "../../generated/JavaLexer.js";
import { graphemesLexer } from "../../generated/graphemesLexer.js";

// cspell: ignore udhr

/**
 * Test how fast we can lex Java and some unicode graphemes using old and
 *  new unicode stream mechanism. It also tests load time for unicode code points beyond 0xFFFF.
 *
 *  Sample output on Linux with Intel Xeon E5-2600 @ 2.20 GHz (us == microseconds, 1/1000 of a millisecond):
 *
 * Java VM args:
 * Warming up Java compiler....
 *             load_new_utf8 average time   535us size 284788b over 3500 loads of 29038 symbols from Parser.java
 *             load_new_utf8 average time   439us size 153150b over 3500 loads of 13379 symbols from udhr_hin.txt
 *
 *         lex_new_java_utf8 average time   672us over 2000 runs of 29038 symbols
 *         lex_new_java_utf8 average time  1671us over 2000 runs of 29038 symbols DFA cleared
 *
 *  Sample output on OS X with 4 GHz Intel Core i7 (us == microseconds, 1/1000 of a millisecond):
 *
 *  Java VM args: -Xms2G -Xmx8g
 *  Warming up Java compiler....
 *                load_new_utf8 average time   232us size 131232b over 3500 loads of 29038 symbols from Parser.java
 *                load_new_utf8 average time    69us size  32928b over 3500 loads of  7625 symbols from RuleContext.java
 *                load_new_utf8 average time   210us size  65696b over 3500 loads of 13379 symbols from udhr_hin.txt
 *
 *            lex_new_java_utf8 average time   439us over 2000 runs of 29038 symbols
 *            lex_new_java_utf8 average time   969us over 2000 runs of 29038 symbols DFA cleared
 *
 *        lex_new_grapheme_utf8 average time  4034us over  400 runs of  6614 symbols from udhr_kor.txt
 *        lex_new_grapheme_utf8 average time  4173us over  400 runs of  6614 symbols from udhr_kor.txt DFA cleared
 *        lex_new_grapheme_utf8 average time  7680us over  400 runs of 13379 symbols from udhr_hin.txt
 *        lex_new_grapheme_utf8 average time  7946us over  400 runs of 13379 symbols from udhr_hin.txt DFA cleared
 *        lex_new_grapheme_utf8 average time    70us over  400 runs of    85 symbols from emoji.txt
 *        lex_new_grapheme_utf8 average time    82us over  400 runs of    85 symbols from emoji.txt DFA cleared
 *
 *
 *  The "DFA cleared" indicates that the lexer was returned to initial conditions
 *  before the tokenizing of each file.	 As the ALL(*) lexer encounters new input,
 *  it records how it tokenized the chars. The next time it sees that input,
 *  it will more quickly recognize the token.
 *
 *  Lexing times have the top 20% stripped off before doing the average
 *  to account for issues with the garbage collection and compilation pauses;
 *  other OS tasks could also pop in randomly.
 *
 *  Load times are too fast to measure with a microsecond clock using an SSD
 *  so the average load time is computed as the overall time to load
 *  n times divided by n (rather then summing up the individual times).
 *
 */
export class TimeLexerSpeed {
    public static readonly parserJavaFile = "tests/api/perf/Parser.java";
    public static readonly ruleContextJavaFile = "tests/api/perf/RuleContext.java";
    public static readonly perfDir = "tests/api/perf";

    public output = true;

    public static main(): void {
        console.log();

        const tests = new TimeLexerSpeed();
        tests.compilerWarmUp(100);

        let n = 3500;
        tests.loadNewUTF8(TimeLexerSpeed.parserJavaFile, n);
        tests.loadNewUTF8(TimeLexerSpeed.ruleContextJavaFile, n);
        tests.loadNewUTF8(TimeLexerSpeed.perfDir + "/udhr_hin.txt", n);
        console.log();

        n = 2000;
        tests.lexNewJavaUTF8(n, false);
        tests.lexNewJavaUTF8(n, true);
        console.log();

        n = 400;
        tests.lexNewGraphemeUTF8("udhr_kor.txt", n, false);
        tests.lexNewGraphemeUTF8("udhr_kor.txt", n, true);
        tests.lexNewGraphemeUTF8("udhr_hin.txt", n, false);
        tests.lexNewGraphemeUTF8("udhr_hin.txt", n, true);
        tests.lexNewGraphemeUTF8("emoji.txt", n, false);
        tests.lexNewGraphemeUTF8("emoji.txt", n, true);
    }

    public compilerWarmUp(n: number): void {
        this.output = false;
        this.lexNewJavaUTF8(n, false);
        process.stdout.write(".");
        this.lexNewGraphemeUTF8("udhr_hin.txt", n, false);
        console.log();
        this.output = true;
    }

    public loadNewUTF8(resourceName: string, n: number): void {
        const input = new Array<CharStream>(n); // keep refs around so we can average memory
        const streamLength = statSync(resourceName).size;
        const content = readFileSync(resourceName, { encoding: "utf-8" });
        const start = performance.now(); // track only time to suck data out of stream

        for (let i = 0; i < n; i++) {
            input[i] = CharStreams.fromString(content);
        }

        const stop = performance.now();
        const tµs = (stop - start) * 1000;
        const size = input[0].size;
        if (this.output) {
            process.stdout.write(printf("%27s average time %5dµs size %6db over %4d loads of %5d symbols from %s\n",
                "loadNewUTF8",
                tµs / n,
                streamLength,
                n,
                size,
                basename(resourceName)));
        }
    }

    public lexNewJavaUTF8(n: number, clearLexerDFACache: boolean): void {
        const content = readFileSync(TimeLexerSpeed.parserJavaFile, { encoding: "utf-8" });
        const input = CharStreams.fromString(content);
        const lexer = new JavaLexer(input);
        const avg = this.tokenize(lexer, n, clearLexerDFACache);
        if (this.output) {
            process.stdout.write(printf("%27s average time %5dµs over %4d runs of %5d symbols%s\n",
                "lexNewJavaUTF8",
                avg,
                n,
                input.size,
                clearLexerDFACache ? " DFA cleared" : ""));
        }

    }

    public lexNewGraphemeUTF8(fileName: String, n: number, clearLexerDFACache: boolean): void {
        const resourceName = TimeLexerSpeed.perfDir + "/" + fileName;
        const content = readFileSync(resourceName, { encoding: "utf-8" });
        const input = CharStreams.fromString(content);
        const lexer = new graphemesLexer(input);
        const avg = this.tokenize(lexer, n, clearLexerDFACache);
        if (this.output) {
            process.stdout.write(printf("%27s average time %5dµs over %4d runs of %5d symbols from %s%s\n",
                "lexNewGraphemeUTF8",
                avg,
                n,
                input.size,
                fileName,
                clearLexerDFACache ? " DFA cleared" : ""));
        }
    }

    public tokenize(lexer: Lexer, n: number, clearLexerDFACache: boolean): number {
        // always wipe the DFA before we begin tests so previous tests
        // don't affect this run!
        lexer.interpreter.clearDFA();
        let times: number[] = [];
        for (let i = 0; i < n; i++) {
            lexer.reset();
            if (clearLexerDFACache) {
                lexer.interpreter.clearDFA();
            }

            const start = performance.now();
            const tokens = new CommonTokenStream(lexer);
            tokens.fill(); // lex whole file.
            const stop = performance.now();
            times.push((stop - start) * 1000);
        }

        times.sort();
        times = times.slice(0, times.length - (n * .2)); // drop highest 20% of times

        return this.avg(times);
    }

    public avg(values: number[]): number {
        let sum = 0.0;
        for (const v of values) {
            sum += v;
        }

        return sum / values.length;
    }

    public std(mean: number, values: number[]): number { // unbiased std dev
        let sum = 0.0;
        for (const v of values) {
            sum += (v - mean) * (v - mean);
        }

        return Math.sqrt(sum / (values.length - 1));
    }
}

TimeLexerSpeed.main();
