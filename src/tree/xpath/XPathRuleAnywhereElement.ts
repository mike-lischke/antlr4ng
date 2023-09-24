/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Trees } from "../Trees.js";
import { XPathElement } from "./XPathElement.js";

/**
 * Either `ID` at start of path or `...//ID` in middle of path.
 */
export class XPathRuleAnywhereElement extends XPathElement {
    ruleIndex: any;
    constructor(ruleName: any, ruleIndex: any) {
        super(ruleName);
        this.ruleIndex = ruleIndex;
    }

    evaluate(t: any) {
        return Trees.findAllRuleNodes(t, this.ruleIndex);
    }
}
