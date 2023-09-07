/**
 * Copyright 2016 The ANTLR Project.All rights reserved.
 * Licensed under the BSD - 3 - Clause license.See LICENSE file in the project root for license information.
 */

import Trees from "../Trees.js";
import XPath from "./XPath.js";
import XPathElement from "./XPathElement.js";

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

export default XPathWildcardAnywhereElement;
