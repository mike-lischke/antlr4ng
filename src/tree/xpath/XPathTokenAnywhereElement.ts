/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

export class XPathTokenAnywhereElement extends XPathElement {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokenType: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(tokenName: any, tokenType: any) {
        super(tokenName);
        this.tokenType = tokenType;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(t: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Trees.findAllTokenNodes(t, this.tokenType);
    }
}
