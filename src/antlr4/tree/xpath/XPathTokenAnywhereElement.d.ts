/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTree } from "../ParseTree.js";
import { XPathElement } from "./XPathElement.js";

export class XPathTokenAnywhereElement extends XPathElement {
    protected tokenType: number;

    public constructor(tokenName: string, tokenType: number);

    public evaluate(t: ParseTree): ParseTree[];
}
