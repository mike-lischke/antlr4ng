/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTree } from "../ParseTree.js";
import { Trees } from "../Trees.js";
import { XPath } from "./XPath.js";
import { XPathElement } from "./XPathElement.js";

export class XPathWildcardAnywhereElement extends XPathElement {
    public constructor() {
        super(XPath.WILDCARD);
    }

    public evaluate(t: ParseTree): ParseTree[] {
        if (this.invert) {
            // !* is weird but valid (empty)
            return [];
        }

        return Trees.descendants(t);
    }
}
