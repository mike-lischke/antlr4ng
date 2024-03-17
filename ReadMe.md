[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/mike-lischke/antlr4ng/nodejs.yml?style=for-the-badge&logo=github)](https://github.com/mike-lischke/antlr4ng/actions/workflows/nodejs.yml)
[![Weekly Downloads](https://img.shields.io/npm/dw/antlr4ng?style=for-the-badge&color=blue)](https://www.npmjs.com/package/antlr4ng)
[![npm version](https://img.shields.io/npm/v/antlr4ng?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/antlr4ng)

<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/ANTLRng2.svg" title="ANTLR Next Generation" alt="ANTLRng" width="96" height="96"/><label style="font-size: 70%">Part of the Next Generation ANTLR Project</label>

# TypeScript Runtime for ANTLR 4

This package started as a fork of the official ANTLR4 JavaScript runtime and has been fully implemented in TypeScript. It implements everything what the Java runtime does, except for the `UnbufferedCharStream` class, which requires a streaming source compatible with both Node.js and browsers. Other notable differences from the original JS source.

- Numerous bug fixes and other changes.
- No differentiation between node and browser environments.
- Includes the `antlr4ng-cli` tool to generate parser files compatible with this runtime. This tool uses a custom build of the ANTLR4 tool.

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

The package requires ES2022 or newer, for features like static initialization blocks in classes and private fields (`#field`). It is recommended to use the latest TypeScript version.

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

The following table shows the results of the benchmarks that were executed in the [antlr4wasm project](https://github.com/mike-lischke/antlr4wasm/tree/master/benchmarks/mysql). The column for antlr4ng, however, contains the current results of this runtime.

|    | C++ |antlr4ng|antlr4|antlr4ts|antlr4wasm|
|---:|---:|---:|---:|---:|---:|
|Query Collection (cold)|1340 ms| <ins>187/2232 (2420) ms</ins>| 7984 ms| 3402 ms| 3331 ms|
|  Bitrix Queries (cold)| 195 ms|  <ins>68/283 (351) ms</ins>| 1134 ms|  444 ms|  998 ms|
|   Large Inserts (cold)|4981 ms|<ins>6295/2277 (8572) ms</ins>|10695 ms|11483 ms|34243 ms|
|Total (cold)           |6546 ms|<ins>6551/4792 (11343) ms</ins>|19878 ms|15403 ms|38641 ms|
|||||||
|Query Collection (warm)| 133 ms|  130/102 (232) ms|  <ins>223 ms</ins>|  259 ms| 1177 ms|
|  Bitrix Queries (warm)|  70 ms|  63/73 (136) ms|  <ins>110 ms</ins>|  131 ms|  815 ms|
|   Large Inserts (warm)|4971 ms|<ins>6281/2281 (8562) ms</ins>|10593 ms|11287 ms|36317 ms|
|Total (warm)           |5198 ms|<ins>6474/2456 (8931) ms</ins>|10944 ms|11697 ms|38329 ms|

Underlined entries are the smallest (not counting C++, which beats them all). For antlr4ng, the times are split into lexing and parsing. Note the high lexer execution times, caused by the large number of predicates (126) + lexer actions (40) in the MySQL lexer.

The benchmarks consist of a set of query files parsed by a MySQL parser. The MySQL grammar is one of the largest and most complex grammars you can find for ANTLR4, which I think makes it a perfect test case for parser testing.

The query collection file contains more than 900 MySQL queries of all kinds, from very simple comments-only statements to complex stored procedures, including some deeply nested select queries that can easily exhaust the available stack space (in certain situations, such as parsing in a thread with default stack size). The MySQL server version used was 8.2 (the grammar allows dynamic switching of server versions).

The large binary inserts file contains only a few dozen queries, but they are really large with deep recursions, so they stress the parser's prediction engine and often touch uncached DFA states because of the lexer predicates. In addition, one query contains binary (image) data with input characters from the entire UTF-8 range.

The example file is a copy of the largest test file in [this repository](https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples), and is known to be very slow to parse with other MySQL grammars. The one used here, however, is fast.

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
                loadNewUTF8 average time   353µs size  29191b over 3500 loads of 29191 symbols from Parser.java
                loadNewUTF8 average time    75µs size   7552b over 3500 loads of  7552 symbols from RuleContext.java
                loadNewUTF8 average time   121µs size  31784b over 3500 loads of 13379 symbols from udhr_hin.txt

             lexNewJavaUTF8 average time   706µs over 2000 runs of 29191 symbols
             lexNewJavaUTF8 average time  1961µs over 2000 runs of 29191 symbols DFA cleared

         lexNewGraphemeUTF8 average time  7836µs over  400 runs of  6614 symbols from udhr_kor.txt
         lexNewGraphemeUTF8 average time  7946µs over  400 runs of  6614 symbols from udhr_kor.txt DFA cleared
         lexNewGraphemeUTF8 average time 12945µs over  400 runs of 13379 symbols from udhr_hin.txt
         lexNewGraphemeUTF8 average time 13079µs over  400 runs of 13379 symbols from udhr_hin.txt DFA cleared
         lexNewGraphemeUTF8 average time   203µs over  400 runs of    85 symbols from emoji.txt
         lexNewGraphemeUTF8 average time   233µs over  400 runs of    85 symbols from emoji.txt DFA cleared
```

Note: Some of the corpus sizes differ due to the restructuring of the test. However, the numbers are not directly comparable anyway, as they were taken on different machines.

## Release Notes

### 3.0.4

- Fixed visitor example in this readme file and added build instructions.
- Added back all debug output in the simulators and the prediction context. Useful for finding low level problems.
- Fixed bug #47 Antlr4ng fails to parse codeql/examples/alias.qll
- Fixed bug #46 ParserRulecontext.parent() incorrectly typed

### 3.0.2 - 3.0.3

Fixed a number of smaller issues that have been found after the previous release.

### 3.0.1

Had to make `Lexer.modeStack` public again and allow reading and writing the current lexer mode.

### 3.0.0

This release completes the conversion of the Java (and JavaScript) ANTLR4 runtime to TypeScript. It's a significant improvement over the existing TS (and JS) runtimes, as it includes now all relevant parts from the Java runtime and has been optimized for performance. It's now twice as fast for cold runs and 20% faster with a warm parser/lexer. See also the benchmark section below.

This makes it the fastest TypeScript (and JS) runtime currently available. The ANTLR4 JavaScript runtime still is slightly faster in short time tests (e.g. 228ms vs 223ms for the query collection test), where system load and other factors have however much more impact compared to tests that run around 10 seconds.

So, what has changed in this new major release? In detail:

- Everything that makes sense in the TypeScript environment has been converted (for example `ListTokenSource`, `RuntimeMetaData` and parse tree pattern matching, to name a few). That excludes things like the code point char streams, which directly deal with file and (Java) stream input - aspects that don't matter in TypeScript. Consequently the class `CharStreams` has been removed. Use `CharStream.fromString` to feed your lexer.
- Neither `BailErrorStrategy` nor `ParserRuleContext` track the original exception in error cases anymore. Instead it is wrapped in the exception thrown (for bailing out) or passed to the error listeners.
- The runtime has been profiled both with VS Code and Node.js directly, to identify bottlenecks. This showed excessive object creation and release, because of the way DFA generation is implemented. That led to big object initialization and garbage collection penalties. This has been improved and now most time is spent in generated code (which could be improved later). Several measures have been taken to improve speed:
    - Method and constructor overloading in hot paths can be a performance killer, because of the frequent parameter checks. To counter that, class factories and individual method names have been introduced (e.g. `getTextFromContext` and `getTextFromRange` instead of a single `getText` method).
    - Pure data holder classes have been converted to interfaces, which appear at runtime as plain objects and safe some of the initialization times.
    - Some intermediate objects (like temporary `Interval` and `ATNState` instances) have been removed.
    - Bitsets now use typed arrays instead of array of numbers.
    - The hash implementation (MurmurHash) has been stripped down to the minimum required code to keep this hot path fast as well.
    - Hash codes are now cached wherever possible.
    - The `instanceof` operator is relatively expensive, so it was replaced with checks using a member discriminator in hot paths, where possible (e.g. transition and ATN state types).
    - `Switch` statements in hot paths have been replaced by factory arrays that reduce determination what to create to a simple array value lookup.
- A number of public members have been renamed, to match common TypeScript code style (e.g. `INSTANCE` to `instance` or `_parseListener` to `parseListener`).
- Methods that can return null/undefined now explicitly say so (Java has no explicit type to mark possible null results and the ANTLR4 Java runtime is a bit lax in this regard). This requires now that users of the new runtime have to do more checks for undefined results.
- The lexer can now be configured at runtime to control what is cached in the DFA (in the Java runtime it's always only ASCII chars) and which code points are acceptable (in the Java runtime always the entire Unicode range).
- Separated enumeration values (e.g. ATN state types, transition types) have been moved back as public static constants to their respective classes.
- Accessibility of class members has been adjusted (strict public, protected and private visibility).
- Duplicated public members (as property and as getter/setter method) have been resolved in favor of the property variant.
- Most use of `null` has been converted to `undefined` (except in places where null marks special conditions) for a more natural handling in TypeScript.
- The JS doc in code has been reworked and all unsupported markup been removed.
- A lot of other code cleanup happened.
- Test improvements:
    - Runtime tests have been ported to TypeScript, so they can be debugged and provide a much quicker turnaround.
    - Benchmarks now take separated measurements for lexer and parser runs, which much better shows how high the impact of predicates and actions in the lexer is (e.g. 2/3 of the time in the large inserts benchmark is used for lexing input).
- The release build is no longer minified (and hence larger than before) to avoid trouble with other build tools like terser or webpack.

### 2.0.11

- Fixed bug #30 ReferenceError: Super constructor may only be called once
- The entire runtime test library from the Java runtime has now been ported to TypeScript and is used from now on to check the correctness of this runtime.
- The bit set class used bigint to store the values, which is a problem with bundlers like webpack that have no support for bigint. For this reason that type has been replaced (PR #40 feat: replace bigint and BigUint64Array).
- The bundle is no longer minified and hence larger than before. Bundling a minified bundle with other bundlers (like terser) in dependent projects might cause trouble. Additionally, minifying a bundle has no benefit in execution time, it's just a size difference (related bugs: #31, #34, #38).

### 2.0.10

Fixed bug #26 getRuleContext is incompatible with generated code (2.0.5)

### 2.0.9

- Added exports for the profiling classes.
- Reverted some changes that failed the Java runtime tests.

### 2.0.8

- Fixed string construction with class names (which doesn't work when bundling the sources).

### 2.0.7

- Added an InterpreterDataReader implementation (copied from the vscode-antlr4 extension).
- Benchmark values listed here are now computed from 5 runs, instead just one.
- Added `RuleContext.toStringTree()` overload.

### 2.0.6

- Optimizations in HashMap and HashSet (from Peter van Gulik). This can have dramatic speed improvements, depending on the grammar. In the unit tests this shows mostly by a faster cold start.
- Added CommonJS builds back. Especially when running unit tests using Node.js a CommonJS variant is simpler to handle.
- Added clearDFA() methods in the simulators.

### 2.0.5

- Profiler port (from backspace <backspace@backblog.me>)
- Changed context getters in `ParserRuleContext` for retrieving sub contexts to accept any constructor parameter, for more flexibility.

### 2.0.4

- Code generation improvements, especially for local rule attributes. Attributes in a rule (which are implemented as local variables in the generated code) can be unassigned and need extra null-safety checks (the ? operator) or non-null assertions. The code generator now adds these checks automatically.
- `ParserRuleContext.getChild` now accepts any constructor type.

### 2.0.3

- Removed last reference to a Node.js specific type (Buffer), which avoids the automatic reference to the Node.js typings and an "resolution-mode" assertion for "require" (CommonJS).
- Upgraded the ANTLR4 jar, which now produces optional attributes in rule contexts.

### 2.0.1 - 2.0.2

- There are changes in the package content (typings are now in the dist folder too, instead of source).
- There are now index.ts files in every folder and used for the final export index.ts. This makes it easier to see if something is missing and to include new or renamed files.
- And there are some build changes/fixes as preparation for profiling the runtime.

### 2.0.0

The entire runtime now exclusively uses TypeScript. It was tested with the standard ANTLR4 runtime tests and completed the test suite successfully.

### 1.1.3 - 1.1.7

These releases contain mostly internal changes and bug fixes. The antlr4ng-cli tool dependency has been updated to the latest version and build + test processes has been improved (esbuild instead of webpack, Jest instead of Jasmine).

There are also some smaller fixes in `Interval` and `ParseTreeVisitor`. The latter now has the same implementation as the Java runtime.

- Fixed Bug #8 Wrong property name, using `numberOfSyntaxErrors` now.

### 1.1.1 - 1.1.2

Bug fix releases. They contain many bugs found while integrating the runtime into a large project.

### 1.1.0

This release includes a lot of cleanup.

- Generated parser rules that can appear as either returning a single parse context or a list of that no longer use the `__list()` appendix in their name. Instead method overloading is used now to distinguish between the two cases.
- The members `getTypedRuleContext` and `getTypedRuleContexts` have been renamed to `getRuleContext` and `getRuleContexts` respectively, just as in the Java runtime.
- There are more renames (`_errHandler` -> 'errorHandler`, `_input` -> `inputStream` and more).
- The package has been stripped down to just a single bundle file. This is an ESM module now, so it can be used in both, node and browser environments. No differentiation is made anymore between the two.
- The internal folder structure has been changed to match the Java runtime.
- Extended some classes, added new type definitions and exported some more classes.
- Improved `BitSet` to use less memory.

### 1.0.6 - 1.0.7

- Fixed recognizer token type and rule index maps.
- Fixed `getTokens()` in `BufferedTokenStream`.
- Added new peer dependency `antlr4ng-cli`, which is the tool to generate parser files compatible with this runtime.

### 1.0.5

- Added benchmarks.
- Introduced the `IntStream` interface as the base for `CharStream` and `TokenStream`. This avoids duplicate code in the stream type definitions.
- Removed `FileStream` as a preparation to get rid of the separate package files for node and browser. If something needs to be loaded from a file, the particular environment should provide the code for that.

### 1.0.2 - 1.0.4

- Github build action
- Updated package.json
- Exported `ErrorNode`, `InputMismatchException`
- Some smaller fixes

### 1.0.1

- Added and/or replaced all copyrights to a common ANTLR version.
- Removed all individual default exports. Only the final lib exports contain both, default and non-default exports. This avoids namespace access like `antlr4.atn`. Everything is available under a top level import.
- Renamed ErrorListener to BaseErrorListener, as that is what it is actually when comparing it to the Java runtime.

### 1.0.0

- Initial release.
