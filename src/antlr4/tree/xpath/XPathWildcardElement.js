/**
 * Copyright 2016 The ANTLR Project.All rights reserved.
 * Licensed under the BSD - 3 - Clause license.See LICENSE file in the project root for license information.
 */

import XPath from "./XPath.js";
import XPathElement from "./XPathElement.js";

export class XPathWildcardElement extends XPathElement {
    constructor() {
        super(XPath.WILDCARD);
    }

    evaluate(t) {
        let kids = [];
        if (this.invert) {
            // !* is weird but valid (empty)
            return kids;
        }

        for (let i = 0; i < t.getChildCount(); i++) {
            kids.push(t.getChild(i));
        }
        return kids;
    }
}

export default XPathWildcardElement;
