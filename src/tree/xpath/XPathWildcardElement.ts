/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { XPath } from "./XPath.js";
import { XPathElement } from "./XPathElement.js";

export class XPathWildcardElement extends XPathElement {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        super(XPath.WILDCARD);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(t: any) {
        // eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
        let kids: any = [];
        if (this.invert) {
            // !* is weird but valid (empty)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return kids;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        for (let i = 0; i < t.getChildCount(); i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            kids.push(t.getChild(i));
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return kids;
    }
}
