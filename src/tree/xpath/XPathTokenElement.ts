/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TerminalNode } from "../TerminalNode.js";
import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

export class XPathTokenElement extends XPathElement {
    tokenType: any;
    constructor(tokenName: any, tokenType: any) {
        super(tokenName);
        this.tokenType = tokenType;
    }

    evaluate(t: any) {
        // return all children of t that match nodeName
        let nodes = [];
        for (let c of Trees.getChildren(t)) {
            if (c instanceof TerminalNode) {
                // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
                if ((c.symbol.type === this.tokenType && !this.invert) ||
                    // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
                    (c.symbol.type !== this.tokenType && this.invert)) {
                    nodes.push(c);
                }
            }
        }
        return nodes;
    }
}
