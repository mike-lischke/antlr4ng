# JavaScript + TypeScript Target Runtime for ANTLR 4

[![npm version](https://img.shields.io/npm/v/antlr4)](https://www.npmjs.com/package/antlr4)
[![Badge showing the supported LTS versions of Node.JS in the latest NPM release](https://img.shields.io/node/v-lts/antlr4)](https://www.npmjs.com/package/antlr4)
[![npm type definitions](https://img.shields.io/npm/types/antlr4)](https://www.npmjs.com/package/antlr4)

This package is a fork of the official ANTLR4 JavaScript runtime, with the following changes:

- Much improved TypeScript type definitions.
- XPath implementation.
- Vocabulary implementation.
- Complete Interval implementation.
- Consistent formatting (indentation, semicolons, spaces, etc.).
- Numerous smaller fixes (`null` instead of `undefined` and others).
- Smaller node package (no test specs or other unnecessary files).

It is a drop-in replacement of the `antlr4` package, and can be used as such. For more information about ANTLR see www.antlr.org. More details about the JavaScript/TypeScript target can be found [here](https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md).
