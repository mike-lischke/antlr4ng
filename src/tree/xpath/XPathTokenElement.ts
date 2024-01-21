/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTree } from "../ParseTree.js";
import { TerminalNode } from "../TerminalNode.js";
import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

export class XPathTokenElement extends XPathElement {
    protected tokenType: number;

    public constructor(tokenName: string, tokenType: number) {
        super(tokenName);
        this.tokenType = tokenType;
    }

    public evaluate(t: ParseTree): ParseTree[] {
        // return all children of t that match nodeName
        const nodes: ParseTree[] = [];
        for (const c of Trees.getChildren(t)) {
            if (c instanceof TerminalNode && c.symbol) {
                if ((c.symbol.type === this.tokenType && !this.invert) ||
                    (c.symbol.type !== this.tokenType && this.invert)) {
                    nodes.push(c);
                }
            }
        }

        return nodes;
    }

    public override toString(): string {
        const inv: string = this.invert ? "!" : "";

        return "XPathTokenElement[" + inv + this.nodeName + "]";
    }

}
