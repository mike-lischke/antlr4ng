/**
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

import Trees from "../Trees.js";
import XPathElement from "./XPathElement.js";

export class XPathTokenAnywhereElement extends XPathElement {
    constructor(tokenName, tokenType) {
        super(tokenName);
        this.tokenType = tokenType;
    }

    evaluate(t) {
        return Trees.findAllTokenNodes(t, this.tokenType);
    }
}

export default XPathTokenAnywhereElement;
