/* eslint-disable jsdoc/multiline-blocks, jsdoc/require-param, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class XPathElement {
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
 invert: any;
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
 nodeName: any;
 /** Construct element like `/ID` or `ID` or `/*` etc...
  *  op is null if just node
  */
 // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
 constructor(nodeName: any) {
     this.nodeName = nodeName;
     this.invert = false;
 }

 /**
  * Given tree rooted at `t` return all nodes matched by this path
  * element.
  */
 // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
 evaluate(t: any) { }

 // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
 toString() {
     // eslint-disable-next-line prefer-const
     let inv = this.invert ? "!" : "";
     // eslint-disable-next-line prefer-const
     let className = Object.constructor.name;

     return className + "[" + inv + this.nodeName + "]";
 }
}
