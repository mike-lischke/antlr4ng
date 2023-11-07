/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { ParseTree } from "../ParseTree.js";

export abstract class XPathElement {
    public invert: boolean;
    protected nodeName: string;

    /**
     * Construct element like `/ID` or `ID` or `/*` etc...
     * op is null if just node
     */
    public constructor(nodeName: string) {
        this.nodeName = nodeName;
        this.invert = false;
    }

    public toString(): string {
        const inv: string = this.invert ? "!" : "";
        const className: string = Object.constructor.name;

        return className + "[" + inv + this.nodeName + "]";
    }

    /**
     * Given tree rooted at `t` return all nodes matched by this path
     * element.
     */
    public abstract evaluate(t: ParseTree): ParseTree[];
}
