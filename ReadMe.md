[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/mike-lischke/antlr4ng/nodejs.yml?style=for-the-badge&logo=github)](https://github.com/mike-lischke/antlr4ng/actions/workflows/nodejs.yml)
[![Weekly Downloads](https://img.shields.io/npm/dw/antlr4ng?style=for-the-badge&color=blue)](https://www.npmjs.com/package/antlr4ng)
[![npm version](https://img.shields.io/npm/v/antlr4ng?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/antlr4ng)

<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/ANTLRng2.svg" title="ANTLR Next Generation" alt="ANTLRng" width="96" height="96"/><label style="font-size: 70%">Part of the Next Generation ANTLR Project</label>

# TypeScript Runtime for ANTLR 4

This package is a fork of the official ANTLR4 JavaScript runtime (with its TypeScript additions), with the following changes:

- Much improved TypeScript type definitions.
- XPath implementation.
- Vocabulary implementation.
- Complete Interval implementation.
- Parser and lexer interpreters.
- A couple of bug fixes.
- Consistent formatting (indentation, semicolons, spaces, etc.).
- Project folder structure is now similar to the Java runtime.
- Numerous smaller fixes (`null` instead of `undefined` and others).
- Smaller node package (no test specs or other unnecessary files).
- No CommonJS support anymore (ESM only). No differentiation between node and browser environments.
- Build is now based on esbuild.
- Includes the `antlr4ng-cli` tool to generate parser files compatible with this runtime. This tool uses a custom build of the ANTLR4 tool.

It is (mostly) a drop-in replacement of the `antlr4` package, and can be used as such. For more information about ANTLR see www.antlr.org. Read more details about the [JavaScript](https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md) and [TypeScript](https://github.com/antlr/antlr4/blob/master/doc/typescript-target.md) targets at the provided links, but keep in mind that this documentation applies to the original JS/TS target.

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

## Benchmarks

This runtime is constantly monitored for performance regressions. The following table shows the results of the benchmarks run on last release:

| Test | Cold Run | Warm Run|
| ---- | -------- | ------- |
| Query Collection| 8464 ms | 230 ms |
| Example File | 1043 ms | 112 ms |
| Large Inserts | 11022 ms | 10616 ms |
| Total | 20599 ms | 10978 ms |

The benchmarks consist of a set of query files, which are parsed by a MySQL parser. The query collection file contains more than 900 MySQL queries of all kinds, from very simple to complex stored procedures, including some deeply nested select queries that can easily exhaust available stack space. The minimum MySQL server version used was 8.0.0.

The large binary inserts file contains only a few dozen queries, but they are really large with deep recursions, stressing so the prediction engine of the parser. Additionally, one query contains binary (image) data which contains input characters from the whole UTF-8 range.

The example file is a copy of the largest test file in [this repository](https://github.com/antlr/grammars-v4/tree/master/sql/mysql/Positive-Technologies/examples), and is known to be very slow to parse with other parsers, but the one used here.

## Release Notes

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
