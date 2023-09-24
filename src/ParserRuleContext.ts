/* eslint-disable jsdoc/multiline-blocks, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { RuleContext } from './atn/RuleContext.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { TerminalNode } from './tree/TerminalNode.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { TerminalNodeImpl } from './tree/TerminalNodeImpl.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ErrorNodeImpl } from './tree/ErrorNodeImpl.js';
import { Interval } from "./misc/Interval.js";

/**
 * A rule invocation record for parsing.
 *
 *  Contains all of the information about the current rule not stored in the
 *  RuleContext. It handles parse tree children list, Any ATN state
 *  tracing, and the default values available for rule indications:
 *  start, stop, rule index, current alt number, current
 *  ATN state.
 *
 *  Subclasses made for each rule and grammar track the parameters,
 *  return values, locals, and labels specific to that rule. These
 *  are the objects that are returned from rules.
 *
 *  Note text is not an actual field of a rule return value; it is computed
 *  from start and stop using the input stream's toString() method.  I
 *  could add a ctor to this so that we can pass in and store the input
 *  stream, but I'm not sure we want to do that.  It would seem to be undefined
 *  to get the .text property anyway if the rule matches tokens from multiple
 *  input streams.
 *
 *  I do not use getters for fields of objects that are used simply to
 *  group values such as this aggregate.  The getters/setters are there to
 *  satisfy the superclass interface.
 */
export class ParserRuleContext extends RuleContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _parent: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    children: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    exception: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    invokingState: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    start: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    stop: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(parent: any, invokingStateNumber: any) {
        super(parent, invokingStateNumber);
        /**
         * If we are debugging or building a parse tree for a visitor,
         * we need to track all of the tokens and rule invocations associated
         * with this rule's context. This is empty for parsing w/o tree constr.
         * operation because we don't the need to track the details about
         * how we parse this rule.
         */
        this.children = null;
        this.start = null;
        this.stop = null;
        /**
         * The exception that forced this rule to return. If the rule successfully
         * completed, this is {@code null}.
         */
        this.exception = null;
    }

    // COPY a ctx (I'm deliberately not using copy constructor)
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    copyFrom(ctx: any) {
        // from RuleContext
        // eslint-disable-next-line no-underscore-dangle
        this._parent = ctx._parent;
        this.invokingState = ctx.invokingState;
        this.children = null;
        this.start = ctx.start;
        this.stop = ctx.stop;
        // copy any error nodes to alt label node
        if (ctx.children) {
            this.children = [];
            // reset parent pointer for any error nodes
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, array-callback-return, @typescript-eslint/no-explicit-any
            ctx.children.map(function(this: any, child: any) {
                if (child instanceof ErrorNodeImpl) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this.children.push(child);
                    child.parent = this;
                }
            }, this);
        }
    }

    // Double dispatch methods for listeners
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    enterRule(listener: any) {
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    exitRule(listener: any) {
    }

    // Does not set parent link; other add methods do that
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addChild(child: any) {
        if (this.children === null) {
            this.children = [];
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.children.push(child);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return child;
    }

    /** Used by enterOuterAlt to toss out a RuleContext previously added as
     * we entered a rule. If we have // label, we will need to remove
     * generic ruleContext object.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    removeLastChild() {
        if (this.children !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.children.pop();
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addTokenNode(token: any) {
        const node = new TerminalNodeImpl(token);
        this.addChild(node);
        node.parent = this;
        // eslint-disable-next-line padding-line-between-statements
        return node;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addErrorNode(badToken: any) {
        const node = new ErrorNodeImpl(badToken);
        this.addChild(node);
        node.parent = this;
        // eslint-disable-next-line padding-line-between-statements
        return node;
    }

    // @ts-expect-error TS(2416): Property 'getChild' in type 'ParserRuleContext' is... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getChild(i: any, type: any) {
        type = type ?? null;
        if (this.children === null || i < 0 || i >= this.children.length) {
            return null;
        }
        if (type === null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.children[i];
        } else {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < this.children.length; j++) {
                const child = this.children[j];
                if (child instanceof type) {
                    if (i === 0) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return child;
                    } else {
                        i -= 1;
                    }
                }
            }
            // eslint-disable-next-line padding-line-between-statements
            return null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getToken(ttype: any, i: any) {
        if (this.children === null || i < 0 || i >= this.children.length) {
            return null;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let j = 0; j < this.children.length; j++) {
            const child = this.children[j];
            if (child instanceof TerminalNode) {
                // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
                if (child.symbol.type === ttype) {
                    if (i === 0) {
                        return child;
                    } else {
                        i -= 1;
                    }
                }
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getTokens(ttype: any) {
        if (this.children === null) {
            return [];
        } else {
            const tokens = [];
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < this.children.length; j++) {
                const child = this.children[j];
                if (child instanceof TerminalNode) {
                    // @ts-expect-error TS(2339): Property 'symbol' does not exist on type 'Terminal... Remove this comment to see the full error message
                    if (child.symbol.type === ttype) {
                        tokens.push(child);
                    }
                }
            }
            // eslint-disable-next-line padding-line-between-statements
            return tokens;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getRuleContext(i: any, ctxType: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.getChild(i, ctxType);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getRuleContexts(ctxType: any) {
        if (this.children === null) {
            return [];
        } else {
            const contexts = [];
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < this.children.length; j++) {
                const child = this.children[j];
                if (child instanceof ctxType) {
                    contexts.push(child);
                }
            }
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return contexts;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getChildCount() {
        if (this.children === null) {
            return 0;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.children.length;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getSourceInterval() {
        if (this.start === null || this.stop === null) {
            // @ts-expect-error TS(2339): Property 'INVALID_INTERVAL' does not exist on type... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Interval.INVALID_INTERVAL;
        } else {
            return new Interval(this.start.tokenIndex, this.stop.tokenIndex);
        }
    }
}

// @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Ru... Remove this comment to see the full error message
RuleContext.EMPTY = new ParserRuleContext();
