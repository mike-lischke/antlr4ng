[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/mike-lischke/antlr4ng/nodejs.yml?style=for-the-badge&logo=github)](https://github.com/mike-lischke/antlr4ng/actions/workflows/nodejs.yml)
[![Weekly Downloads](https://img.shields.io/npm/dw/antlr4ng?style=for-the-badge&color=blue)](https://www.npmjs.com/package/antlr4ng)
[![npm version](https://img.shields.io/npm/v/antlr4ng?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/antlr4ng)

<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/antlr-ng.svg" title="ANTLR Next Generation" alt="antlr-ng the parser generator" width="96" height="96"/><label style="font-size: 70%">Part of the Next Generation ANTLR Project</label>

# TypeScript Runtime for antlr-ng and ANTLR4

This package started as a fork of the official ANTLR4 JavaScript runtime and has been fully implemented in TypeScript. It implements everything what the Java runtime does, except for the `UnbufferedCharStream` class, which requires a streaming source compatible with both Node.js and browsers. Other notable differences from the original JS source.

- Numerous bug fixes and other changes.
- No differentiation between node and browser environments.
- Includes the `antlr4ng-cli` tool to generate parser files compatible with this runtime. This tool uses a custom build of the ANTLR4 tool.

> The package requires ES2022 (ES6) or newer, for features like static initialization blocks in classes and private properties (`#field`). It is recommended to use the latest TypeScript version.

## Installation

To install the package, run the following command:

```bash
npm install antlr4ng
```

This package has a peer dependency to `antlr4ng-cli`, which is the tool to generate parser files compatible with this runtime, so it is strongly recommended to install this one too:

```bash
npm install --save-dev antlr4ng-cli
```
See [its readme](./cli/ReadMe.md) for more information.

If you come from one of the other JS/TS runtimes, you may have to adjust your code a bit. The antlr4ng package more strictly exposes the Java nullability for certain members. This will require that you either use the non-null assertion operator to force the compiler to accept your code, or you have to check for null values before accessing a member. The latter is the recommended way, as it is safer.

Additionally, some members have been renamed to more TypeScript like names. The following table shows the most important changes:

| Old Name | New Name |
| -------- | -------- |
| `Parser._ctx` | `Parser.context` |
| `Parser._errHandler` | `Parser.errorHandler` |
| `Parser._input` | `Parser.inputStream` |
| `Recognizer._interp` | `Recognizer.interpreter` |

## Usage

The following example shows how to use the runtime to parse a simple expression, assuming you have generated the lexer and parser files for the grammar and placed them in a subfolder folder called `generated`. The readme file of the [antlr4ng-cli](./cli/ReadMe.md) tool shows how to do that. Assume we have this expression grammar:

```antlr
grammar Expression;

start: multiply | divide | add | subtract;

expression: '(' expression ')' | number;

multiply: expression '*' expression;
divide: expression '/' expression;
add: expression '+' expression;
subtract: expression '-' expression;

number: NUMBER;

NUMBER: [0-9]+;
WS: [ \t\r\n]+ -> skip;
```

```typescript
import { CharStream, CommonTokenStream } from "antlr4ng";
import { ExpressionLexer } from "./generated/ExpressionLexer.js";
import { ExpressionParser } from "./generated/ExpressionParser.js";

const input = "1 + 2 * 3";
const inputStream = CharStream.fromString(input);
const lexer = new ExpressionLexer(inputStream);
const tokenStream = new CommonTokenStream(lexer);
const parser = new ExpressionParser(tokenStream);
const tree = parser.start();
```

You can then use the generated parser to walk the parse tree, for example with a visitor to evaluate the expression:

```typescript
import { ExpressionVisitor } from "./generated/ExpressionVisitor.js";

class MyVisitor extends ExpressionVisitor<number> {
  public visitAdd = (ctx: AddContext): number {
    return this.visit(ctx.expression(0)) + this.visit(ctx.expression(1));
  }

  public visitMultiply = (ctx: MultiplyContext): number {
    return this.visit(ctx.expression(0)) * this.visit(ctx.expression(1));
  }

  public visitNumber = (ctx: NumberContext): number {
    return Number.parseInt(ctx.NUMBER().text);
  }
}

const visitor = new MyVisitor();
const result = visitor.visit(tree);
```

## Installing Development Dependencies

While antlr4ng has no runtime dependencies (no 3rd party libs are used at runtime), there are a number dev dependencies that are used to run the benchmarks or create custom builds. So, before you do anything else in the repo after cloning it, install the depedencies by running

```bash
npm i
```

in the root folder of the repo. Once this has completed successfully you should be able to use any of the NPM scripts in the project. For example, to generate a release build without source maps run:

```bash
npm run build
```

which will create the `dist/` folder and store the bundled sources for CommonJS and ESM there.

## Tests and Benchmarks

This runtime is monitored for performance regressions. The times below were taken on a Mac Studio M1 Max with 32GB RAM (Sonoma 14.2).

### Running the Tests

There are a number NPM scripts in the project that are related to testing. The first step is the generation of the test parsers:

```bash
npm run generate-test-parsers
```

followed by the generation of the runtime tests:

```bash
npm run generate-runtime-tests
```

and the build of the package:

```bash
npm run build
```

After that you can either execute different suites separately or as a whole.

|Test|Script|
|---|---|
|Unit tests|`npm run test`|
|Lexer speed test|`npm run time-lexer-speed`|
|Real world example|`npm run run-benchmarks`|
| All together|`npm run full-test`|

The unit tests consist of tests for individual classes in the runtime (API tests) and the runtime test suite ported from Java.

This suite consists of 530 tests and runs in about 9s.

### Real World Example

The following table shows the results of the benchmarks from the [antlr4wasm project](https://github.com/mike-lischke/antlr4wasm/tree/master/benchmarks/mysql). Only the antlr4ng results have been taken from this repository to reflect the current state. They show that the antlr4ng runtime dominates every other JS/TS runtime by a margin of 9% (for simple input) up to 35% (for complex input), measured against the closest value for that benchmark.

|    | C++ |antlr4ng|antlr4|antlr4ts|antlr4wasm|
|---:|---:|---:|---:|---:|---:|
|Query Collection (cold)| 941 ms| <ins>169/1997 (2166) ms</ins>| 7789 ms| 3353 ms| 3217 ms|
|  Bitrix Queries (cold)| 143 ms|  <ins>67/221 (287) ms</ins>| 1105 ms|  450 ms|  899 ms|
|   Large Inserts (cold)|3590 ms|<ins>60656/871 (6927) ms</ins>|10607 ms|11539 ms|30466 ms|
|Total (cold)           |4696 ms|<ins>6292/3089 (9381) ms</ins>|19532 ms|15371 ms|34612 ms|
|||||||
|Query Collection (warm)|  95 ms|  <ins>126/49 (175) ms</ins>|  215 ms|  266 ms| 1041 ms|
|  Bitrix Queries (warm)|  52 ms|  <ins>61/33 (94) ms</ins>|  107 ms|  137 ms|  715 ms|
|   Large Inserts (warm)|3564 ms|<ins>6024/855 (6879) ms</ins>|10539 ms|11461 ms|32425 ms|
|Total (warm)           |3733 ms|<ins>6231/939 (7170) ms</ins>|10889 ms|11889 ms|34216 ms|

Underlined entries are the shortest (not counting C++, which beats them all). For antlr4ng, the times are split between lexing and parsing. Note the high lexer execution times, caused by the large number of predicates (126) + lexer actions (40) in the MySQL lexer.

The benchmarks consist of a set of query files parsed by a MySQL parser. The MySQL grammar is one of the largest and most complex grammars you can find for ANTLR4, which I think makes it a perfect test case for parser testing.

The query collection file contains more than 900 MySQL queries of all kinds, from very simple comments-only statements to complex stored procedures, including some deeply nested select queries that can easily exhaust the available stack space (in certain situations, such as parsing in a thread with default stack size). The MySQL server version used was 8.2 (the grammar allows dynamic switching of server versions).

The large binary inserts file contains only a few dozen queries, but they are really large with deep recursions, so they stress the parser's prediction engine and often touch uncached DFA states because of the lexer predicates. In addition, one query contains binary (image) data with input characters from the entire UTF-8 range.

The Bitrix file is a copy of the largest test file in [this repository](https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples), and is known to be very slow to parse with other MySQL grammars. The one used here, however, is fast.

### Lexer Speed Test

Since the Java runtime tests have been ported to TypeScript there's another set of benchmarks, the lexer speed test. This set of tests was created when Unicode support landed in ANTLR4 and measures the speed of lexing different Unicode lexemes in a lexer generated from the Java grammar.

The original Java execution times have been taken on OS X with a 4 GHz Intel Core i7 (Java VM args: `-Xms2G -Xmx8g`):

```bash
                load_new_utf8 average time   232µs size 131232b over 3500 loads of 29038 symbols from Parser.java
                load_new_utf8 average time    69µs size  32928b over 3500 loads of  7625 symbols from RuleContext.java
                load_new_utf8 average time   210µs size  65696b over 3500 loads of 13379 symbols from udhr_hin.txt

            lex_new_java_utf8 average time   439µs over 2000 runs of 29038 symbols
            lex_new_java_utf8 average time   969µs over 2000 runs of 29038 symbols DFA cleared

        lex_new_grapheme_utf8 average time  4034µs over  400 runs of  6614 symbols from udhr_kor.txt
        lex_new_grapheme_utf8 average time  4173µs over  400 runs of  6614 symbols from udhr_kor.txt DFA cleared
        lex_new_grapheme_utf8 average time  7680µs over  400 runs of 13379 symbols from udhr_hin.txt
        lex_new_grapheme_utf8 average time  7946µs over  400 runs of 13379 symbols from udhr_hin.txt DFA cleared
        lex_new_grapheme_utf8 average time    70µs over  400 runs of    85 symbols from emoji.txt
        lex_new_grapheme_utf8 average time    82µs over  400 runs of    85 symbols from emoji.txt DFA cleared
```

The execute times on last release of this runtime have been measured as:

```bash
                loadNewUTF8 average time   306µs size  29191b over 3500 loads of 29191 symbols from Parser.java
                loadNewUTF8 average time    71µs size   7552b over 3500 loads of  7552 symbols from RuleContext.java
                loadNewUTF8 average time   117µs size  31784b over 3500 loads of 13379 symbols from udhr_hin.txt

             lexNewJavaUTF8 average time   678µs over 2000 runs of 29191 symbols
             lexNewJavaUTF8 average time  1869µs over 2000 runs of 29191 symbols DFA cleared

         lexNewGraphemeUTF8 average time  8003µs over  400 runs of  6614 symbols from udhr_kor.txt
         lexNewGraphemeUTF8 average time  8107µs over  400 runs of  6614 symbols from udhr_kor.txt DFA cleared
         lexNewGraphemeUTF8 average time 13197µs over  400 runs of 13379 symbols from udhr_hin.txt
         lexNewGraphemeUTF8 average time 13262µs over  400 runs of 13379 symbols from udhr_hin.txt DFA cleared
         lexNewGraphemeUTF8 average time   208µs over  400 runs of    85 symbols from emoji.txt
         lexNewGraphemeUTF8 average time   239µs over  400 runs of    85 symbols from emoji.txt DFA cleared
```

Note: Some of the corpus sizes differ due to the restructuring of the test. However, the numbers are not directly comparable anyway, as they were taken on different machines.

## Release Notes

See [release-notes](release-notes.md).
