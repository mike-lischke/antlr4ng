/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Trees } from "../Trees.js";
import { XPath } from "./XPath.js";
import { XPathElement } from "./XPathElement.js";

export class XPathWildcardAnywhereElement extends XPathElement {
    constructor() {
        super(XPath.WILDCARD);
    }

    evaluate(t) {
        if (this.invert) {
            // !* is weird but valid (empty)
            return [];
        }

        return Trees.descendants(t);
    }
}
