/* eslint-disable jsdoc/require-param, jsdoc/require-returns, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from '../Token.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ErrorNode } from './ErrorNode.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { TerminalNode } from './TerminalNode.js';
import { escapeWhitespace } from "../utils/escapeWhitespace.js";
import { RuleContext } from "../atn/RuleContext.js";

/** A set of utility routines useful for all kinds of ANTLR trees. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Trees = {
    /**
     * Print out a whole tree in LISP form. {@link //getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    toStringTree: function (tree: any, ruleNames: any, recog: any) {
        ruleNames = ruleNames || null;
        recog = recog || null;
        if (recog !== null) {
            ruleNames = recog.ruleNames;
        }
        // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
        let s = Trees.getNodeText(tree, ruleNames);
        s = escapeWhitespace(s, false);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const c = tree.getChildCount();
        if (c === 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return s;
        }
        // eslint-disable-next-line @typescript-eslint/quotes
        let res = "(" + s + ' ';
        if (c > 0) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            s = Trees.toStringTree(tree.getChild(0), ruleNames);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            res = res.concat(s);
        }
        for (let i = 1; i < c; i++) {
            // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            s = Trees.toStringTree(tree.getChild(i), ruleNames);
            // eslint-disable-next-line @typescript-eslint/quotes
            res = res.concat(' ' + s);
        }
        res = res.concat(")");
        // eslint-disable-next-line padding-line-between-statements
        return res;
    },

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
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
                // eslint-disable-next-line eqeqeq
                if (altNumber != 0) {
                    return ruleNames[t.ruleIndex] + ":" + altNumber;
                }
                // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
                return ruleNames[t.ruleIndex];
            } else if (t instanceof ErrorNode) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                return t.toString();
            } else if (t instanceof TerminalNode) {
                // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
                if (t.symbol !== null) {
                    // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return t.symbol.text;
                }
            }
        }
        // no recog for rule names
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const payload = t.getPayload();
        if (payload instanceof Token) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return payload.text;
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return t.getPayload().toString();
    },

    /**
     * Return ordered list of all children of this node
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    getChildren: function (t: any) {
        const list = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        for (let i = 0; i < t.getChildCount(); i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            list.push(t.getChild(i));
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return list;
    },

    /**
     * Return a list of all ancestors of this node.  The first node of
     * list is the root and the last is the parent of this node.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    getAncestors: function (t: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let ancestors: any = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        t = t.getParent();
        while (t !== null) {
            ancestors = [t].concat(ancestors);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            t = t.getParent();
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return ancestors;
    },

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    findAllTokenNodes: function (t: any, ttype: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Trees.findAllNodes(t, ttype, true);
    },

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    findAllRuleNodes: function (t: any, ruleIndex: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Trees.findAllNodes(t, ruleIndex, false);
    },

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    findAllNodes: function (t: any, index: any, findTokens: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodes: any = [];
        // eslint-disable-next-line no-underscore-dangle
        Trees._findAllNodes(t, index, findTokens, nodes);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return nodes;
    },

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    _findAllNodes: function (t: any, index: any, findTokens: any, nodes: any) {
        // check this node (the root) first
        if (findTokens && (t instanceof TerminalNode)) {
            // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
            if (t.symbol.type === index) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                nodes.push(t);
            }
        } else if (!findTokens && (t instanceof RuleContext)) {
            if (t.ruleIndex === index) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                nodes.push(t);
            }
        }
        // check children
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        for (let i = 0; i < t.getChildCount(); i++) {
            // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-call
            Trees._findAllNodes(t.getChild(i), index, findTokens, nodes);
        }
    },

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, object-shorthand, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
    descendants: function (t: any) {
        let nodes = [t];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        for (let i = 0; i < t.getChildCount(); i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            nodes = nodes.concat(Trees.descendants(t.getChild(i)));
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return nodes;
    // eslint-disable-next-line comma-dangle
    }
};
