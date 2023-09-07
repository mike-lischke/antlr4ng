/**
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

import ParseTree from "../ParseTree.js";
import XPathElement from "./XPathElement.js";

/**
 * Either `ID` at start of path or `...//ID` in middle of path.
 */
export class XPathRuleAnywhereElement extends XPathElement {
    protected ruleIndex: number;

    public constructor(ruleName: string, ruleIndex: number);

    public evaluate(t: ParseTree): ParseTree[];
}

export default XPathRuleAnywhereElement;
