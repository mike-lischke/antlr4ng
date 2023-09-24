/* eslint-disable jsdoc/multiline-blocks, jsdoc/require-param, jsdoc/require-returns, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Interval } from '../misc/Interval.js';
import { ParseTree } from "../tree/ParseTree.js";
// eslint-disable-next-line @typescript-eslint/quotes
import { Trees } from '../tree/Trees.js';

export class RuleContext extends ParseTree {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _parent: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    children: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    invokingState: any;
    /** A rule context is a record of a single rule invocation. It knows
     * which context invoked it, if any. If there is no parent context, then
     * naturally the invoking state is not valid.  The parent link
     * provides a chain upwards from the current rule invocation to the root
     * of the invocation tree, forming a stack. We actually carry no
     * information about the rule associated with this context (except
     * when parsing). We keep only the state number of the invoking state from
     * the ATN submachine that invoked this. Contrast this with the s
     * pointer inside ParserRuleContext that tracks the current state
     * being "executed" for the current rule.
     *
     * The parent contexts are useful for computing lookahead sets and
     * getting error information.
     *
     * These objects are used during parsing and prediction.
     * For the special case of parsers, we use the subclass
     * ParserRuleContext.
     *
     * @see ParserRuleContext
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(parent: any, invokingState: any) {
        super();
        // eslint-disable-next-line no-underscore-dangle
        this._parent = parent ?? null;
        this.children = null;

        /**
         * What state invoked the rule associated with this context?
         * The "return address" is the followState of invokingState
         * If parent is null, this should be -1.
         */
        this.invokingState = invokingState ?? -1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get parent() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._parent;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set parent(value) {
        // eslint-disable-next-line no-underscore-dangle
        this._parent = value;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    depth() {
        let n = 0;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let p = this;
        while (p !== null) {
            p = p.parent;
            n += 1;
        }
        // eslint-disable-next-line padding-line-between-statements
        return n;
    }

    /**
     * A context is empty if there is no invoking state; meaning nobody call
     * current context.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    isEmpty() {
        return this.invokingState === -1;
    }

    // satisfy the ParseTree / SyntaxTree interface
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getSourceInterval() {
        // @ts-expect-error TS(2339): Property 'INVALID_INTERVAL' does not exist on type... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Interval.INVALID_INTERVAL;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get ruleContext() {
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get ruleIndex() {
        return -1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getPayload() {
        return this;
    }

    /**
     * Return the combined text of all child nodes. This method only considers
     * tokens which have been added to the parse tree.
     * <p>
     * Since tokens on hidden channels (e.g. whitespace or comments) are not
     * added to the parse trees, they will not appear in the output of this
     * method.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getText() {
        if (this.getChildCount() === 0) {
            return "";
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
            return this.children.map(function (child: any) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
                return child.getText();
            }).join("");
        }
    }

    /**
     * For rule associated with this parse tree internal node, return
     * the outer alternative number used to match the input. Default
     * implementation does not compute nor store this alt num. Create
     * a subclass of ParserRuleContext with backing field and set
     * option contextSuperClass.
     * to set it.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getAltNumber() {
        // use constant value of ATN.INVALID_ALT_NUMBER to avoid circular dependency
        return 0;
    }

    /**
     * Set the outer alternative number for this context node. Default
     * implementation does nothing to avoid backing field overhead for
     * trees that don't need it.  Create
     * a subclass of ParserRuleContext with backing field and set
     * option contextSuperClass.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    setAltNumber(altNumber: any) {
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    setParent(parent: any) {
        this.parent = parent;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getChild(i: any) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getChildCount() {
        return 0;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    accept(visitor: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return visitor.visitChildren(this);
    }

    /**
     * Print out a whole tree, not just a node, in LISP format
     * (root child1 .. childN). Print just a node if this is a leaf.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    toStringTree(ruleNames: any, recog: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Trees.toStringTree(this, ruleNames, recog);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    toString(ruleNames: any, stop: any) {
        ruleNames = ruleNames || null;
        stop = stop || null;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let p = this;
        let s = "[";
        while (p !== null && p !== stop) {
            if (ruleNames === null) {
                if (!p.isEmpty()) {
                    s += p.invokingState;
                }
            } else {
                const ri = p.ruleIndex;
                const ruleName = (ri >= 0 && ri < ruleNames.length) ? ruleNames[ri]
                    : "" + ri;
                s += ruleName;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (p.parent !== null && (ruleNames !== null || !p.parent.isEmpty())) {
                s += " ";
            }
            p = p.parent;
        }
        s += "]";
        // eslint-disable-next-line padding-line-between-statements
        return s;
    }
}
