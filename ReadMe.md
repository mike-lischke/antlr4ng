[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/mike-lischke/antlr4ng/nodejs.yml?style=for-the-badge&logo=github)](https://github.com/mike-lischke/antlr4ng/actions/workflows/nodejs.yml)
[![Weekly Downloads](https://img.shields.io/npm/dw/antlr4ng?style=for-the-badge&color=blue)](https://www.npmjs.com/package/antlr4ng)
[![npm version](https://img.shields.io/npm/v/antlr4ng?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/antlr4ng)

<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/ANTLRng2.svg" title="ANTLR Next Generation" alt="ANTLRng" width="96" height="96"/><label style="font-size: 70%">Part of the Next Generation ANTLR Project</label>

# TypeScript Runtime for ANTLR 4

This package is a fork of the official ANTLR4 JavaScript runtime and has been fully transformed to TypeScript. Other improvements are:

- XPath implementation.
- Vocabulary implementation.
- Complete Interval implementation.
- Parser and lexer interpreters.
- Numerous bug fixes and other changes.
- Smaller node package (no test specs or other unnecessary files).
- No CommonJS support anymore (ESM only). No differentiation between node and browser environments.
- Includes the `antlr4ng-cli` tool to generate parser files compatible with this runtime. This tool uses a custom build of the ANTLR4 tool.

This package is a blend of the original JS implementation and antlr4ts, which is a TypeScript implementation of the ANTLR4 runtime, but was abandoned. It tries to keep the best of both worlds, while following the Java runtime as close as possible. It's a bit slower than the JS runtime, but faster than antlr4ts.

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
import { CharStreams, CommonTokenStream } from "antlr4ng";
import { ExpressionLexer } from "./generated/ExpressionLexer.js";
import { ExpressionParser } from "./generated/ExpressionParser.js";

const input = "1 + 2 * 3";
const inputStream = CharStreams.fromString(input);
const lexer = new ExpressionLexer(inputStream);
const tokenStream = new CommonTokenStream(lexer);
const parser = new ExpressionParser(tokenStream);
const tree = parser.start();
```

You can then use the generated parser to walk the parse tree, for example with a visitor to evaluate the expression:

```typescript
import { ExpressionVisitor } from "./generated/ExpressionVisitor.js";

class MyVisitor extends ExpressionVisitor<number> {
  visitAdd(ctx: AddContext): number {
    return this.visit(ctx.expression(0)) + this.visit(ctx.expression(1));
  }

  visitMultiply(ctx: MultiplyContext): number {
    return this.visit(ctx.expression(0)) * this.visit(ctx.expression(1));
  }

  visitNumber(ctx: NumberContext): number {
    return Number.parseInt(ctx.NUMBER().text);
  }
}

const visitor = new MyVisitor();
const result = visitor.visit(tree);
```

## Benchmarks

This runtime is monitored for performance regressions. The following table shows the results of the benchmarks run on last release:

Pure JavaScript release (with type definitions):

| Test | Cold Run | Warm Run|
| ---- | -------- | ------- |
| Query Collection| 8464 ms | 230 ms |
| Example File | 1043 ms | 112 ms |
| Large Inserts | 11022 ms | 10616 ms |
| Total | 20599 ms | 10978 ms |

Last release (pure TypeScript):

| Test | Cold Run | Warm Run|
| ---- | -------- | ------- |
| Query Collection| 5930 ms | 338 ms |
| Example File | 1074 ms | 194 ms |
| Large Inserts | 14226 ms | 14248 ms |
| Total | 21290 ms | 14800 ms |

The numbers are interesting. While the cold run for the query collection is almost 3 seconds faster with pure TS, the overall numbers in warm state are worse. So it's not a pure JS vs. TS situation, but something else must have additional influence and this will be investigated. After all the TypeScript code is ultimately transpiled to JS, so it's probably a matter of how effective the TS code is translated to JS.

Overall the numbers in the pure TS runtime are pretty good, especially when comparing them with [antlr4ts](https://github.com/mike-lischke/antlr4wasm/tree/master/benchmarks/mysql).

### About the Benchmarks

The benchmarks consist of a set of query files, which are parsed by a MySQL parser. The MySQL grammar is one of the largest and most complex grammars you can find for ANTLR4, which, I think, makes it a perfect test case for parser tests.

The query collection file contains more than 900 MySQL queries of all kinds, from very simple comments-only statements to complex stored procedures, including some deeply nested select queries that can easily exhaust the available stack space (in certain situations, such as parsing in a thread with default stack size). The minimum MySQL server version used was 8.0.0.

The large binary inserts file contains only a few dozen queries, but they are really large with deep recursions, so they stress the prediction engine of the parser. In addition, one query contains binary (image) data containing input characters from the entire UTF-8 range.

The example file is a copy of the largest test file in [this repository](https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples), and is known to be very slow to parse with other MySQL grammars. The one used here, however, is fast.

## Release Notes

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
