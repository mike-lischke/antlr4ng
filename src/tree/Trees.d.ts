/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTree } from "./ParseTree.js";
import { Parser } from "../Parser.js";

/** A set of utility routines useful for all kinds of ANTLR trees. */
export declare class Trees {
    /**
     * Print out a whole tree in LISP form. {@link //getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     */
    public static toStringTree(tree: ParseTree, ruleNames: string[] | null, recog: Parser | null): string;

    public static getNodeText(t: ParseTree, ruleNames: string[] | null, recog: Parser | null): string;

    /**
     * Return ordered list of all children of this node
     */
    public static getChildren(t: ParseTree): ParseTree[];

    /**
     * Return a list of all ancestors of this node.  The first node of
     * list is the root and the last is the parent of this node.
     */
    public static getAncestors(t: ParseTree): ParseTree[];

    public static findAllTokenNodes(t: ParseTree, ttype: number): ParseTree[];

    public static findAllRuleNodes(t: ParseTree, ruleIndex: number): ParseTree[];

    public static findAllNodes(t: ParseTree, index: number, findTokens: boolean): ParseTree[];

    public static descendants(t: ParseTree): ParseTree[];
}
