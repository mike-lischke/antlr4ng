/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TerminalNode } from "../TerminalNode.js";
import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

export class XPathTokenElement extends XPathElement {
    constructor(tokenName, tokenType) {
        super(tokenName);
        this.tokenType = tokenType;
    }

    evaluate(t) {
        // return all children of t that match nodeName
        let nodes = [];
        for (let c of Trees.getChildren(t)) {
            if (c instanceof TerminalNode) {
                if ((c.symbol.type === this.tokenType && !this.invert) ||
                    (c.symbol.type !== this.tokenType && this.invert)) {
                    nodes.push(c);
                }
            }
        }
        return nodes;
    }
}
