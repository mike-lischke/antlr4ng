[![Weekly Downloads](https://img.shields.io/npm/dw/antlr4ng-cli?style=for-the-badge&color=blue)](https://www.npmjs.com/package/antlr4ng-cli)
[![npm version](https://img.shields.io/npm/v/antlr4ng-cli?style=for-the-badge&color=yellow)](https://www.npmjs.com/package/antlr4ng-cli)

# Custom ANTLR4 Code Generator

This package contains a custom code generator for ANTLR4 grammars. It is based on the official ANTLR4 code generator, but includes support for the [`antlr4ng`](https://github.com/mike-lischke/antlr4ng) runtime, so the TypeScript output is different. Other than that it is a drop-in replacement for the official generator and can also be used with the official runtimes (C++, Java, etc.).

## Installation

To install the package, run the following command:

```bash
npm install antlr4ng-cli
```

## Usage

The package needs Java installed on your system, To generate your parser, run the following command:

```bash
antlr4ng <options> <grammar-file>
```

in the root of your project, where you installed the package.

> Note: in contrast to `antlr4ts` you have to specify the target language explicitly, just as if you use the generator jar file directly. A typical case would be:
>
> ```bash
> antlr4ng -Dlanguage=TypeScript -o generated/ -visitor -listener -Xexact-output-dir path/to/YourLexer.g4 path/to/YourParser.g4
> ```

## Release Notes

### 1.0.2

Updated the ANTLR4 jar.

### 1.0.1

- Some changes for renamed class members in the runtime (e.g. `_interp` -> `interpreter`).

### 1.0.0

- Initial release.
