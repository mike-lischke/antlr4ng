/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "../../ParserRuleContext.js";
import { ParseTree } from "../ParseTree.js";
import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

export class XPathRuleElement extends XPathElement {
    protected ruleIndex: number;

    public constructor(ruleName: string, ruleIndex: number) {
        super(ruleName);
        this.ruleIndex = ruleIndex;
    }

    public evaluate(t: ParseTree): ParseTree[] {
        // return all children of t that match nodeName
        const nodes: ParseTree[] = [];
        for (const c of Trees.getChildren(t)) {
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
