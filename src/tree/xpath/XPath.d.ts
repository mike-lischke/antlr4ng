/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Parser } from "../../Parser.js";
import { ParseTree } from "../ParseTree.js";
import { Token } from "../../Token.js";
import { XPathElement } from "./XPathElement.js";

/**
 * Represent a subset of XPath XML path syntax for use in identifying nodes in
 * parse trees.
 *
 * Split path into words and separators `/` and `//` via ANTLR
 * itself then walk path elements from left to right. At each separator-word
 * pair, find set of nodes. Next stage uses those as work list.
 *
 * The basic interface is
 * {@link XPath#findAll ParseTree.findAll}`(tree, pathString, parser)`.
 * But that is just shorthand for:
 *
 * ```
 * let p = new XPath(parser, pathString);
 * return p.evaluate(tree);
 * ```
 *
 * See `TestXPath` for descriptions. In short, this
 * allows operators:
 *
 * | | |
 * | --- | --- |
 * | `/` | root |
 * | `//` | anywhere |
 * | `!` | invert; this much appear directly after root or anywhere operator |
 *
 * and path elements:
 *
 * | | |
 * | --- | --- |
 * | `ID` | token name |
 * | `'string'` | any string literal token from the grammar |
 * | `expr` | rule name |
 * | `*` | wildcard matching any node |
 *
 * Whitespace is not allowed.
 */
export class XPath {
    /* eslint-disable @typescript-eslint/naming-convention */

    public static readonly WILDCARD: string; // word not operator/separator
    public static readonly NOT: string;      // word for invert operator

    /* eslint-enable @typescript-eslint/naming-convention */

    protected path: string;
    protected elements: XPathElement[];
    protected parser: Parser;

    public constructor(parser: Parser, path: string);

    public static findAll(tree: ParseTree, xpath: string, parser: Parser): Set<ParseTree>;

    // TODO: check for invalid token/rule names, bad syntax

    public split(path: string): XPathElement[];

    /**
     * Return a list of all nodes starting at `t` as root that satisfy the
     * path. The root `/` is relative to the node passed to.
     */
    public evaluate(t: ParseTree): Set<ParseTree>;

    /**
     * Convert word like `*` or `ID` or `expr` to a path
     * element. `anywhere` is `true` if `//` precedes the
     * word.
     */
    protected getXPathElement(wordToken: Token, anywhere: boolean): XPathElement;

}
