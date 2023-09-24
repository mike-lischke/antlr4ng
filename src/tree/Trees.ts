/* eslint-disable jsdoc/require-param, jsdoc/require-returns */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from '../Token.js';
import { ErrorNode } from './ErrorNode.js';
import { TerminalNode } from './TerminalNode.js';
import { escapeWhitespace } from "../utils/escapeWhitespace.js";
import { RuleContext } from "../atn/RuleContext.js";

/** A set of utility routines useful for all kinds of ANTLR trees. */
export const Trees = {
    /**
     * Print out a whole tree in LISP form. {@link //getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     */
    toStringTree: function (tree: any, ruleNames: any, recog: any) {
        ruleNames = ruleNames || null;
        recog = recog || null;
        if (recog !== null) {
            ruleNames = recog.ruleNames;
        }
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        let s = Trees.getNodeText(tree, ruleNames);
        s = escapeWhitespace(s, false);
        const c = tree.getChildCount();
        if (c === 0) {
            return s;
        }
        let res = "(" + s + ' ';
        if (c > 0) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            s = Trees.toStringTree(tree.getChild(0), ruleNames);
            res = res.concat(s);
        }
        for (let i = 1; i < c; i++) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            s = Trees.toStringTree(tree.getChild(i), ruleNames);
            res = res.concat(' ' + s);
        }
        res = res.concat(")");
        return res;
    },

    getNodeText: function (t: any, ruleNames: any, recog: any) {
        ruleNames = ruleNames || null;
        recog = recog || null;
        if (recog !== null) {
            ruleNames = recog.ruleNames;
        }
        if (ruleNames !== null) {
            if (t instanceof RuleContext) {
                const context = t.ruleContext;
                const altNumber = context.getAltNumber();
                // use const value of ATN.INVALID_ALT_NUMBER to avoid circular dependency
                if (altNumber != 0) {
                    return ruleNames[t.ruleIndex] + ":" + altNumber;
                }
                return ruleNames[t.ruleIndex];
            } else if (t instanceof ErrorNode) {
                return t.toString();
            } else if (t instanceof TerminalNode) {
                // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
                if (t.symbol !== null) {
                    // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
                    return t.symbol.text;
                }
            }
        }
        // no recog for rule names
        const payload = t.getPayload();
        if (payload instanceof Token) {
            return payload.text;
        }
        return t.getPayload().toString();
    },

    /**
     * Return ordered list of all children of this node
     */
    getChildren: function (t: any) {
        const list = [];
        for (let i = 0; i < t.getChildCount(); i++) {
            list.push(t.getChild(i));
        }
        return list;
    },

    /**
     * Return a list of all ancestors of this node.  The first node of
     * list is the root and the last is the parent of this node.
     */
    getAncestors: function (t: any) {
        let ancestors: any = [];
        t = t.getParent();
        while (t !== null) {
            ancestors = [t].concat(ancestors);
            t = t.getParent();
        }
        return ancestors;
    },

    findAllTokenNodes: function (t: any, ttype: any) {
        return Trees.findAllNodes(t, ttype, true);
    },

    findAllRuleNodes: function (t: any, ruleIndex: any) {
        return Trees.findAllNodes(t, ruleIndex, false);
    },

    findAllNodes: function (t: any, index: any, findTokens: any) {
        const nodes: any = [];
        Trees._findAllNodes(t, index, findTokens, nodes);
        return nodes;
    },

    _findAllNodes: function (t: any, index: any, findTokens: any, nodes: any) {
        // check this node (the root) first
        if (findTokens && (t instanceof TerminalNode)) {
            // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
            if (t.symbol.type === index) {
                nodes.push(t);
            }
        } else if (!findTokens && (t instanceof RuleContext)) {
            if (t.ruleIndex === index) {
                nodes.push(t);
            }
        }
        // check children
        for (let i = 0; i < t.getChildCount(); i++) {
            Trees._findAllNodes(t.getChild(i), index, findTokens, nodes);
        }
    },

    descendants: function (t: any) {
        let nodes = [t];
        for (let i = 0; i < t.getChildCount(); i++) {
            nodes = nodes.concat(Trees.descendants(t.getChild(i)));
        }
        return nodes;
    }
};
