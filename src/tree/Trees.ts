/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { isToken } from "../Token.js";
import { RuleContext } from "../RuleContext.js";

import { escapeWhitespace } from "../utils/helpers.js";
import { ErrorNode } from "./ErrorNode.js";
import { TerminalNode } from "./TerminalNode.js";
import { ParseTree } from "./ParseTree.js";
import { Parser } from "../Parser.js";

/** A set of utility routines useful for all kinds of ANTLR trees. */
export class Trees {
    /**
     * Print out a whole tree in LISP form. {@link getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     */
    public static toStringTree(tree: ParseTree, ruleNames: string[] | null, recog?: Parser | null): string {
        ruleNames = ruleNames ?? null;
        recog = recog ?? null;
        if (recog !== null) {
            ruleNames = recog.ruleNames;
        }

        let s = Trees.getNodeText(tree, ruleNames);
        s = escapeWhitespace(s!, false);
        const c = tree.getChildCount();
        if (c === 0) {
            return s;
        }

        let res = "(" + s + " ";
        if (c > 0) {
            s = Trees.toStringTree(tree.getChild(0)!, ruleNames);
            res = res.concat(s);
        }
        for (let i = 1; i < c; i++) {
            s = Trees.toStringTree(tree.getChild(i)!, ruleNames);
            res = res.concat(" " + s);
        }
        res = res.concat(")");

        return res;
    }

    public static getNodeText(t: ParseTree, ruleNames: string[] | null, recog?: Parser | null): string | null {
        ruleNames = ruleNames ?? null;
        recog = recog ?? null;
        if (recog !== null) {
            ruleNames = recog.ruleNames;
        }
        if (ruleNames !== null) {
            if (t instanceof RuleContext) {
                const context = t.ruleContext;
                const altNumber = context.getAltNumber();
                // use const value of ATN.INVALID_ALT_NUMBER to avoid circular dependency
                if (altNumber !== 0) {
                    return ruleNames[t.ruleIndex] + ":" + altNumber;
                }

                return ruleNames[t.ruleIndex];
            } else if (t instanceof ErrorNode) {
                return t.toString();
            } else if (t instanceof TerminalNode) {
                if (t.symbol !== null) {
                    return t.symbol.text;
                }
            }
        }
        // no recog for rule names
        const payload = t.getPayload();
        if (isToken(payload)) {
            return payload.text;
        }

        return String(t.getPayload());
    }

    /**
     * Return ordered list of all children of this node
     */
    public static getChildren(t: ParseTree): ParseTree[] {
        const list: ParseTree[] = [];
        for (let i = 0; i < t.getChildCount(); i++) {
            list.push(t.getChild(i)!);
        }

        return list;
    }

    /**
     * Return a list of all ancestors of this node.  The first node of
     * list is the root and the last is the parent of this node.
     */
    public static getAncestors(t: ParseTree): ParseTree[] {
        if (t.parent === null) {
            return [];
        }

        let ancestors: ParseTree[] = [];
        let p: ParseTree | null = t.parent;
        while (p !== null) {
            ancestors = [p].concat(ancestors);
            p = p.parent;
        }

        return ancestors;
    }

    public static findAllTokenNodes(t: ParseTree, ttype: number): ParseTree[] {
        return Trees.findAllNodes(t, ttype, true);
    }

    public static findAllRuleNodes(t: ParseTree, ruleIndex: number): ParseTree[] {
        return Trees.findAllNodes(t, ruleIndex, false);
    }

    public static findAllNodes(t: ParseTree, index: number, findTokens: boolean): ParseTree[] {
        const nodes: ParseTree[] = [];
        Trees.doFindAllNodes(t, index, findTokens, nodes);

        return nodes;
    }

    public static descendants(t: ParseTree): ParseTree[] {
        let nodes = [t];
        for (let i = 0; i < t.getChildCount(); i++) {
            nodes = nodes.concat(Trees.descendants(t.getChild(i)!));
        }

        return nodes;
    }

    private static doFindAllNodes(t: ParseTree, index: number, findTokens: boolean, nodes: ParseTree[]): void {
        // check this node (the root) first
        if (findTokens && (t instanceof TerminalNode)) {
            if (t.symbol?.type === index) {
                nodes.push(t);
            }
        } else if (!findTokens && (t instanceof RuleContext)) {
            if (t.ruleIndex === index) {
                nodes.push(t);
            }
        }
        // check children
        for (let i = 0; i < t.getChildCount(); i++) {
            Trees.doFindAllNodes(t.getChild(i)!, index, findTokens, nodes);
        }
    }

};
