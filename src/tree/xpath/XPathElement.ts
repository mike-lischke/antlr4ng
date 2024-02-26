/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTree } from "../ParseTree.js";

export abstract class XPathElement {
    public invert: boolean;
    protected nodeName?: string;

    /**
     * Construct element like `/ID` or `ID` or `/*` etc... `nodeName` is undefined if just node
     *
     * @param nodeName The name of the node; may be undefined for any node.
     */
    public constructor(nodeName?: string) {
        this.nodeName = nodeName;
        this.invert = false;
    }

    public toString(): string {
        const inv: string = this.invert ? "!" : "";

        return "XPathElement[" + inv + this.nodeName + "]";
    }

    /**
     * Given tree rooted at `t` return all nodes matched by this path
     * element.
     */
    public abstract evaluate(t: ParseTree): ParseTree[];
}
