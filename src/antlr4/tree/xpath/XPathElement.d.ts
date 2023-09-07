/*
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

import ParseTree from "../ParseTree.js";

export abstract class XPathElement {
    public invert: boolean;

    protected nodeName: string;

    /**
     * Construct element like `/ID` or `ID` or `/*` etc...
     *  op is null if just node
     */
    public constructor(nodeName: string);

    public toString(): string;

    /**
     * Given tree rooted at `t` return all nodes matched by this path
     * element.
     */
    public abstract evaluate(t: ParseTree): ParseTree[];
}

export default XPathElement;
