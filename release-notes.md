<p align="center">
<img src="https://raw.githubusercontent.com/mike-lischke/mike-lischke/master/images/antlr-ng.svg" title="ANTLR Next Generation" alt="antlr-ng the parser generator" height="200"/><br/>
<label style="font-size: 120%">Part of the Next Generation ANTLR Project</label>
</p>

# TypeScript Runtime for antlr-ng and ANTLR4 - Release Notes

##3.0.14

Bug fix: wrong upper case letter check

##3.0.13

- Some member variable init was missing.
- Fixed duplicated serialized ATN getters (one with a real getter, one with the getSerializedATN method).
- Fixed token index access for non-writable tokens in BufferedTokenStream.
- Fixed some toString() methods that produced incompatible output.
- ParseCancellationException now keeps the original error for later examination.
- Fixed target state output of the profiling ATN simulator.

## 3.0.12

- Added debug config for ANLTR4 grammars (for testing).
- Fixed a wrong method name in DecisionInfo.
- Removed automatic reordering of start and stop in Interval. It's by intention to accept whatever comes in. Also changed Interval.toString() to conform with the Java runtime.
- IntervalSet accepts a list of values in its constructor, to ease creation for non-continuous value ranges.
- Fixed source interval retrieval in ParseRuleContext (now working like in Java).
- Moved isolated test specs to the API folder, to stay close to the other specs.
- Added a new test spec for XPath.
- SingletonPredictionContext imported EmptyPredictionContext for just one test, which created a circular dependency situation.
- Fixed two off-by-one bugs in IntervalSet.

## 3.0.11

- Each ATN instance now uses its own instance of the LL1Analyzer. This cannot be shared.
- Removed a forgotten debug output from the ATNSerialiser.
- The HashMap now supports enumeration of its keys.
- The channel value for getHiddenTokensToRight/Left in BufferedTokenStream is now marked as optional (it is already handled that way).

## 3.0.10

- Merged PR #101 prefer ts private keyword instead of # prefix (private fields can make problems with proxies and older target ECMA versions).
- Added some helper code needed by the ANTLRng tool.
- Reorder start and stop when creating an Interval instance with start > stop.
- Changed toString() output of LexerNoViableAltException to be the same like in Java.

## 3.0.9
- Fixed addition bug in OrderedHashSet.
- Bug fixes in code which is rarely used (and therefore had no tests)

## 3.0.8

- Switched from Jest to vitest for unit tests. This increases test speed by around 30% (from ~9s to ~6s).
- Fixed a few issues too.
- HashMap can now be created without a parameter for the comparator (it uses the DefaultEqualityComparator then).
- Exported more types that were forgotten (like RuntimeMetaData).

## 3.0.6 - 3.0.7

- Small HashSet/HashMap improvements.
- Export all utils stuff.

## 3.0.5
- Refactored local error classes in ParseTreePatternMatcher
- Fixed bug where `ParseTreeVisitor` used `ParserRuleContext` instead of `ParseTree`.
- More obvious mentioning of ES6 in this readme.
- Added a number of APIs that are not necessary in the runtime, but needed by the ANTLR tool.
- Fixed bug #71 ParseRuleContext in empty input has undefined stop token
- Fixed bug #72 Unexpected behavior when token text has zero length
- Extracted these release notes into an own file.

## 3.0.4

- Fixed visitor example in this readme file and added build instructions.
- Added back all debug output in the simulators and the prediction context. Useful for finding low level problems.
- Fixed bug #47 Antlr4ng fails to parse codeql/examples/alias.qll
- Fixed bug #46 ParserRuleContext.parent() incorrectly typed

## 3.0.2 - 3.0.3

Fixed a number of smaller issues that have been found after the previous release.

## 3.0.1

Had to make `Lexer.modeStack` public again and allow reading and writing the current lexer mode.

## 3.0.0

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

## 2.0.11

- Fixed bug #30 ReferenceError: Super constructor may only be called once
- The entire runtime test library from the Java runtime has now been ported to TypeScript and is used from now on to check the correctness of this runtime.
- The bit set class used bigint to store the values, which is a problem with bundlers like webpack that have no support for bigint. For this reason that type has been replaced (PR #40 feat: replace bigint and BigUint64Array).
- The bundle is no longer minified and hence larger than before. Bundling a minified bundle with other bundlers (like terser) in dependent projects might cause trouble. Additionally, minifying a bundle has no benefit in execution time, it's just a size difference (related bugs: #31, #34, #38).

## 2.0.10

Fixed bug #26 getRuleContext is incompatible with generated code (2.0.5)

## 2.0.9

- Added exports for the profiling classes.
- Reverted some changes that failed the Java runtime tests.

## 2.0.8

- Fixed string construction with class names (which doesn't work when bundling the sources).

## 2.0.7

- Added an InterpreterDataReader implementation (copied from the vscode-antlr4 extension).
- Benchmark values listed here are now computed from 5 runs, instead just one.
- Added `RuleContext.toStringTree()` overload.

## 2.0.6

- Optimizations in HashMap and HashSet (from Peter van Gulik). This can have dramatic speed improvements, depending on the grammar. In the unit tests this shows mostly by a faster cold start.
- Added CommonJS builds back. Especially when running unit tests using Node.js a CommonJS variant is simpler to handle.
- Added clearDFA() methods in the simulators.

## 2.0.5

- Profiler port (from backspace <backspace@backblog.me>)
- Changed context getters in `ParserRuleContext` for retrieving sub contexts to accept any constructor parameter, for more flexibility.

## 2.0.4

- Code generation improvements, especially for local rule attributes. Attributes in a rule (which are implemented as local variables in the generated code) can be unassigned and need extra null-safety checks (the ? operator) or non-null assertions. The code generator now adds these checks automatically.
- `ParserRuleContext.getChild` now accepts any constructor type.

## 2.0.3

- Removed last reference to a Node.js specific type (Buffer), which avoids the automatic reference to the Node.js typings and an "resolution-mode" assertion for "require" (CommonJS).
- Upgraded the ANTLR4 jar, which now produces optional attributes in rule contexts.

## 2.0.1 - 2.0.2

- There are changes in the package content (typings are now in the dist folder too, instead of source).
- There are now index.ts files in every folder and used for the final export index.ts. This makes it easier to see if something is missing and to include new or renamed files.
- And there are some build changes/fixes as preparation for profiling the runtime.

## 2.0.0

The entire runtime now exclusively uses TypeScript. It was tested with the standard ANTLR4 runtime tests and completed the test suite successfully.

## 1.1.3 - 1.1.7

These releases contain mostly internal changes and bug fixes. The antlr4ng-cli tool dependency has been updated to the latest version and build + test processes has been improved (esbuild instead of webpack, Jest instead of Jasmine).

There are also some smaller fixes in `Interval` and `ParseTreeVisitor`. The latter now has the same implementation as the Java runtime.

- Fixed Bug #8 Wrong property name, using `numberOfSyntaxErrors` now.

## 1.1.1 - 1.1.2

Bug fix releases. They contain many bugs found while integrating the runtime into a large project.

## 1.1.0

This release includes a lot of cleanup.

- Generated parser rules that can appear as either returning a single parse context or a list of that no longer use the `__list()` appendix in their name. Instead method overloading is used now to distinguish between the two cases.
- The members `getTypedRuleContext` and `getTypedRuleContexts` have been renamed to `getRuleContext` and `getRuleContexts` respectively, just as in the Java runtime.
- There are more renames (`_errHandler` -> 'errorHandler`, `_input` -> `inputStream` and more).
- The package has been stripped down to just a single bundle file. This is an ESM module now, so it can be used in both, node and browser environments. No differentiation is made anymore between the two.
- The internal folder structure has been changed to match the Java runtime.
- Extended some classes, added new type definitions and exported some more classes.
- Improved `BitSet` to use less memory.

## 1.0.6 - 1.0.7

- Fixed recognizer token type and rule index maps.
- Fixed `getTokens()` in `BufferedTokenStream`.
- Added new peer dependency `antlr4ng-cli`, which is the tool to generate parser files compatible with this runtime.

## 1.0.5

- Added benchmarks.
- Introduced the `IntStream` interface as the base for `CharStream` and `TokenStream`. This avoids duplicate code in the stream type definitions.
- Removed `FileStream` as a preparation to get rid of the separate package files for node and browser. If something needs to be loaded from a file, the particular environment should provide the code for that.

## 1.0.2 - 1.0.4

- Github build action
- Updated package.json
- Exported `ErrorNode`, `InputMismatchException`
- Some smaller fixes

## 1.0.1

- Added and/or replaced all copyrights to a common ANTLR version.
- Removed all individual default exports. Only the final lib exports contain both, default and non-default exports. This avoids namespace access like `antlr4.atn`. Everything is available under a top level import.
- Renamed ErrorListener to BaseErrorListener, as that is what it is actually when comparing it to the Java runtime.

## 1.0.0

- Initial release.
