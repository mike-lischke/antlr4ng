/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { XPath } from "./XPath.js";
import { XPathElement } from "./XPathElement.js";

export class XPathWildcardElement extends XPathElement {
    constructor() {
        super(XPath.WILDCARD);
    }

    evaluate(t: any) {
        let kids: any = [];
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
