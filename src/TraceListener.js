/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTreeListener } from "./tree/ParseTreeListener.js";

export class TraceListener extends ParseTreeListener {
    constructor(parser) {
        super();
        this.parser = parser;
    }

    enterEveryRule(ctx) {
        console.log("enter   " + this.parser.ruleNames[ctx.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
    }

    visitTerminal(node) {
        console.log("consume " + node.symbol + " rule " + this.parser.ruleNames[this.parser._ctx.ruleIndex]);
    }

    exitEveryRule(ctx) {
        console.log("exit    " + this.parser.ruleNames[ctx.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
    }
}
