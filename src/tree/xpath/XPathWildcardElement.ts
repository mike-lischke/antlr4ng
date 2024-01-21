/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTree } from "../ParseTree.js";
import { Trees } from "../Trees.js";
import { XPath } from "./XPath.js";
import { XPathElement } from "./XPathElement.js";

export class XPathWildcardElement extends XPathElement {
    public constructor() {
        super(XPath.WILDCARD);
    }

    public evaluate(t: ParseTree): ParseTree[] {
        const kids: ParseTree[] = [];
        if (this.invert) {
            // !* is weird but valid (empty)
            return kids;
        }
        for (const c of Trees.getChildren(t)) {
            kids.push(c);
        }

        return kids;
    }

    public override toString(): string {
        const inv: string = this.invert ? "!" : "";

        return "XPathWildcardElement[" + inv + this.nodeName + "]";
    }

}
