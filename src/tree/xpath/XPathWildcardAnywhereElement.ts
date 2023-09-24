/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Trees } from "../Trees.js";
import { XPath } from "./XPath.js";
import { XPathElement } from "./XPathElement.js";

export class XPathWildcardAnywhereElement extends XPathElement {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        super(XPath.WILDCARD);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(t: any) {
        if (this.invert) {
            // !* is weird but valid (empty)
            return [];
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Trees.descendants(t);
    }
}
