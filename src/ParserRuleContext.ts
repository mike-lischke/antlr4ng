/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { RuleContext } from "./RuleContext.js";
import { Interval } from "./misc/Interval.js";
import { Token } from "./Token.js";
import { RecognitionException } from "./RecognitionException.js";
import { ParseTreeListener } from "./tree/ParseTreeListener.js";
import { ParseTree } from "./tree/ParseTree.js";
import { TerminalNode } from "./tree/TerminalNode.js";
import { ErrorNode } from "./tree/ErrorNode.js";

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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EMPTY = new ParserRuleContext();

    public start: Token | null = null;
    public stop: Token | null = null;

    /**
     * The exception that forced this rule to return. If the rule successfully
     * completed, this is {@code null}.
     */
    public exception: RecognitionException | null = null;

    public constructor();
    public constructor(parent: ParserRuleContext | null, invokingStateNumber: number);
    public constructor(parent?: ParserRuleContext | null, invokingStateNumber?: number) {
        if (!parent) {
            super();
        } else {
            super(parent, invokingStateNumber);
        }

        this.start = null;
        this.stop = null;
    }

    public override get parent(): ParserRuleContext | null {
        return super.parent as ParserRuleContext;
    }

    public override set parent(parent: ParserRuleContext | null) {
        super.parent = parent;
    }

    // COPY a ctx (I'm deliberately not using copy constructor)
    public copyFrom(ctx: ParserRuleContext): void {
        // from RuleContext
        this.parent = ctx.parent;
        this.invokingState = ctx.invokingState;
        this.children = null;
        this.start = ctx.start;
        this.stop = ctx.stop;
        // copy any error nodes to alt label node
        if (ctx.children) {
            this.children = [];
            // reset parent pointer for any error nodes
            ctx.children.forEach((child) => {
                if (child instanceof ErrorNode) {
                    this.children!.push(child);
                    child.parent = this;
                }
            }, this);
        }
    }

    // Double dispatch methods for listeners
    public enterRule(_listener: ParseTreeListener): void {
    }

    public exitRule(_listener: ParseTreeListener): void {
    }

    /**
     * Add a parse tree node to this as a child.  Works for
     *  internal and leaf nodes. Does not set parent link;
     *  other add methods must do that. Other addChild methods
     *  call this.
     *
     *  We cannot set the parent pointer of the incoming node
     *  because the existing interfaces do not have a setParent()
     *  method and I don't want to break backward compatibility for this.
     */
    public addAnyChild<T extends ParseTree>(t: T): T {
        if (this.children == null) {
            this.children = [];
        }
        this.children.push(t);

        return t;
    }

    public addChild(child: RuleContext): RuleContext {
        return this.addAnyChild(child);
    }

    /**
     * Used by enterOuterAlt to toss out a RuleContext previously added as
     * we entered a rule. If we have // label, we will need to remove
     * generic ruleContext object.
     */
    public removeLastChild(): void {
        if (this.children !== null) {
            this.children.pop();
        }
    }

    public addTokenNode(token: Token): TerminalNode {
        const node = new TerminalNode(token);
        this.addAnyChild(node);
        node.parent = this;

        return node;
    }

    /**
     * Add a child to this node based upon badToken.  It
     *  creates a ErrorNode rather than using
     *  {@link Parser#createErrorNode(ParserRuleContext, Token)}. I'm leaving this
     *  in for compatibility but the parser doesn't use this anymore.
     *
     * @deprecated
     */
    public addErrorNode(errorNode: ErrorNode): ErrorNode {
        errorNode.parent = this;

        return this.addAnyChild(errorNode);
    }

    public override getChild(i: number): RuleContext | null;
    public override getChild<T extends ParseTree>(i: number,
        type: new (...args: unknown[]) => T): T | null;
    public override getChild<T extends ParseTree>(i: number,
        type?: new (...args: unknown[]) => T): T | null {
        if (this.children === null || i < 0 || i >= this.children.length) {
            return null;
        }

        if (!type) {
            return this.children[i] as T;
        } else {
            for (const child of this.children) {
                if (child instanceof type) {
                    if (i === 0) {
                        return child;
                    } else {
                        i -= 1;
                    }
                }
            }

            return null;
        }
    }

    public getToken(ttype: number, i: number): TerminalNode | null {
        if (this.children === null || i < 0 || i >= this.children.length) {
            return null;
        }

        for (const child of this.children) {
            if (child instanceof TerminalNode) {
                if (child.symbol?.type === ttype) {
                    if (i === 0) {
                        return child;
                    } else {
                        i -= 1;
                    }
                }
            }
        }

        return null;
    }

    public getTokens(ttype: number): TerminalNode[] {
        if (this.children === null) {
            return [];
        } else {
            const tokens = [];
            for (const child of this.children) {
                if (child instanceof TerminalNode) {
                    if (child.symbol?.type === ttype) {
                        tokens.push(child);
                    }
                }
            }

            return tokens;
        }
    }

    public getRuleContext<T extends ParserRuleContext>(index: number,
        ctxType: new (parent: ParserRuleContext | null, invokingStateNumber: number) => T): T | null {
        return this.getChild<T>(index, ctxType);
    }

    public getRuleContexts<T extends ParserRuleContext>(
        ctxType: new (parent: ParserRuleContext | null, invokingStateNumber: number) => T): T[] {
        if (this.children === null) {
            return [];
        } else {
            const contexts = [];
            for (const child of this.children) {
                if (child instanceof ctxType) {
                    contexts.push(child);
                }
            }

            return contexts;
        }
    }

    public override getChildCount(): number {
        if (this.children === null) {
            return 0;
        } else {
            return this.children.length;
        }
    }

    public override getSourceInterval(): Interval {
        if (this.start === null || this.stop === null) {
            return Interval.INVALID_INTERVAL;
        } else {
            return new Interval(this.start.tokenIndex, this.stop.tokenIndex);
        }
    }
}
