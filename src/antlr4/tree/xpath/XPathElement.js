/*
 * Copyright 2016 The ANTLR Project. All rights reserved.
 * Licensed under the BSD-3-Clause license. See LICENSE file in the project root for license information.
 */

export class XPathElement {
    /** Construct element like `/ID` or `ID` or `/*` etc...
     *  op is null if just node
     */
    constructor(nodeName) {
        this.nodeName = nodeName;
        this.invert = false;
    }

    /**
     * Given tree rooted at `t` return all nodes matched by this path
     * element.
     */
    evaluate(t) { }

    toString() {
        let inv = this.invert ? "!" : "";
        let className = Object.constructor.name;

        return className + "[" + inv + this.nodeName + "]";
    }
}

export default XPathElement;
