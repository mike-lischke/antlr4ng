# TypeScript Code Generator for ANTLR 4

This package is a wrapper for the ANTLR 4 code generator (the [ANTLR4 tool](https://www.antlr.org/download.html)) version 4.13.2 (dev build). With it you can generate TypeScript parser and lexer files from a grammar file. It uses a custom build of the ANTLR4 jar, to generate code that is compatible with the [antlr4ng TypeScript runtime](https://www.npmjs.com/package/antlr4ng).

## Installation

To install the package, run the following command:

```bash
npm install --save-dev antlr4ng-cli
```

**Note: currently you need to have Java installed on your system, as the ANTLR4 jar is a Java application.**

## Usage

In your `package.json` file, add a script to generate the parser and lexer files:

```json
{
  "scripts": {
    "generate": "antlr4ng -o src/generated src/MyGrammar.g4"
  }
}
```

Then run the script:

```bash
npm run generate
```
