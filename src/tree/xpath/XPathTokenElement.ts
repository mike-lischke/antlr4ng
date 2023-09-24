/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TerminalNode } from "../TerminalNode.js";
import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

export class XPathTokenElement extends XPathElement {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokenType: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(tokenName: any, tokenType: any) {
        super(tokenName);
        this.tokenType = tokenType;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(t: any) {
        // return all children of t that match nodeName
        // eslint-disable-next-line prefer-const
        let nodes = [];
        // eslint-disable-next-line prefer-const
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
        // eslint-disable-next-line padding-line-between-statements
        return nodes;
    }
}
