/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

export class XPathTokenAnywhereElement extends XPathElement {
    tokenType: any;
    constructor(tokenName: any, tokenType: any) {
        super(tokenName);
        this.tokenType = tokenType;
    }

    evaluate(t: any) {
        return Trees.findAllTokenNodes(t, this.tokenType);
    }
}
