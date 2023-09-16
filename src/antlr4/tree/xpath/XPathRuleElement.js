/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "../../atn/ParserRuleContext.js";
import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

export class XPathRuleElement extends XPathElement {
    constructor(ruleName, ruleIndex) {
        super(ruleName);
        this.ruleIndex = ruleIndex;
    }

    evaluate(t) {
        // return all children of t that match nodeName
        let nodes = [];
        for (let c of Trees.getChildren(t)) {
            if (c instanceof ParserRuleContext) {
                if ((c.ruleIndex === this.ruleIndex && !this.invert) ||
                    (c.ruleIndex !== this.ruleIndex && this.invert)) {
                    nodes.push(c);
                }
            }
        }
        return nodes;
    }
}
