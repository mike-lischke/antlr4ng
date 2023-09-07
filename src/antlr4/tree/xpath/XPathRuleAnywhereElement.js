/**
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

import Trees from "../Trees.js";
import XPathElement from "./XPathElement.js";

/**
 * Either `ID` at start of path or `...//ID` in middle of path.
 */
export class XPathRuleAnywhereElement extends XPathElement {
    constructor(ruleName, ruleIndex) {
        super(ruleName);
        this.ruleIndex = ruleIndex;
    }

    evaluate(t) {
        return Trees.findAllRuleNodes(t, this.ruleIndex);
    }
}

export default XPathRuleAnywhereElement;
