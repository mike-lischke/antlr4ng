/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { Interval } from "./misc/Interval.js";
import { Token } from "./Token.js";
import { ParseTreeListener } from "./tree/ParseTreeListener.js";
import { ParseTree } from "./tree/ParseTree.js";
import { TerminalNode } from "./tree/TerminalNode.js";
import { ErrorNode } from "./tree/ErrorNode.js";
import { ATN } from "./atn/ATN.js";
import { Trees } from "./tree/Trees.js";
import type { Parser } from "./Parser.js";
import type { ParseTreeVisitor } from "./tree/ParseTreeVisitor.js";

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
export class ParserRuleContext implements ParseTree {
    public static readonly empty = new ParserRuleContext(null);

    public start: Token | null = null;
    public stop: Token | null = null;

    public readonly children: ParseTree[] = [];

    /**
     * What state invoked the rule associated with this context?
     *  The "return address" is the followState of invokingState
     *  If parent is null, this should be -1 this context object represents
     *  the start rule.
     */
    public invokingState: number;

    #parent: ParserRuleContext | null;

    /**
     * A rule context is a record of a single rule invocation. It knows
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
     */
    public constructor(parent: ParserRuleContext | null, invokingStateNumber: number = -1) {
        this.#parent = parent;
        this.invokingState = invokingStateNumber;
    }

    /** Copy a context */
    public copyFrom(ctx: ParserRuleContext): void {
        this.#parent = ctx.parent;
        this.invokingState = ctx.invokingState;
        this.children.slice(0, this.children.length);
        this.start = ctx.start;
        this.stop = ctx.stop;

        // Copy any error nodes to alt label node.s
        if (ctx.children) {
            // Reset parent pointer for any error nodes.
            ctx.children.forEach((child) => {
                if (child instanceof ErrorNode) {
                    this.children.push(child);
                    child.parent = this;
                }
            });
        }
    }

    // Double dispatch methods for listeners
    public enterRule(_listener: ParseTreeListener): void {
    }

    public exitRule(_listener: ParseTreeListener): void {
    }

    public addChild(child: ParserRuleContext): ParserRuleContext {
        this.children.push(child);

        return child;
    }

    /**
     * Used by enterOuterAlt to toss out a RuleContext previously added as
     * we entered a rule. If we have label, we will need to remove
     * generic ruleContext object.
     */
    public removeLastChild(): void {
        this.children.pop();
    }

    public addTokenNode(token: Token): TerminalNode {
        const node = new TerminalNode(token);
        this.children.push(node);
        node.parent = this;

        return node;
    }

    public addErrorNode(errorNode: ErrorNode): ErrorNode {
        errorNode.parent = this;
        this.children.push(errorNode);

        return errorNode;
    }

    public getChild(i: number): ParseTree | null;
    public getChild<T extends ParseTree>(i: number, type: new (...args: unknown[]) => T): T | null;
    public getChild<T extends ParseTree>(i: number, type?: new (...args: unknown[]) => T): T | null {
        if (i < 0 || i >= this.children.length) {
            return null;
        }

        if (!type) {
            return this.children[i] as T;
        }

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

    public getToken(ttype: number, i: number): TerminalNode | null {
        if (i < 0 || i >= this.children.length) {
            return null;
        }

        for (const child of this.children) {
            if ("symbol" in child) {
                if ((child as TerminalNode).symbol?.type === ttype) {
                    if (i === 0) {
                        return child as TerminalNode;
                    } else {
                        i -= 1;
                    }
                }
            }
        }

        return null;
    }

    public getTokens(ttype: number): TerminalNode[] {
        const tokens = [];
        for (const child of this.children) {
            if ("symbol" in child) {
                if ((child as TerminalNode).symbol?.type === ttype) {
                    tokens.push(child as TerminalNode);
                }
            }
        }

        return tokens;
    }

    // XXX: base the child type selection on the rule index, not the class.
    public getRuleContext<T extends ParserRuleContext, Args extends unknown[]>(index: number,
        ctxType: new (...args: Args) => T): T | null {
        return this.getChild<T>(index, ctxType);
    }

    // XXX: base the child type selection on the rule index, not the class.
    public getRuleContexts<T extends ParserRuleContext, Args extends unknown[]>(
        ctxType: new (...args: Args) => T): T[] {
        const contexts = [];
        for (const child of this.children) {
            if (child instanceof ctxType) {
                contexts.push(child);
            }
        }

        return contexts;
    }

    public getChildCount(): number {
        return this.children.length;
    }

    public getSourceInterval(): Interval {
        if (this.start === null || this.stop === null) {
            return Interval.INVALID_INTERVAL;
        } else {
            return new Interval(this.start.tokenIndex, this.stop.tokenIndex);
        }
    }

    public get parent(): ParserRuleContext | null {
        return this.#parent;
    }

    public set parent(parent: ParserRuleContext | null) {
        this.#parent = parent;
    }

    public depth(): number {
        let n = 0;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let p: ParserRuleContext | null = this;
        while (p !== null) {
            p = p.parent;
            n += 1;
        }

        return n;
    }

    /**
     * A context is empty if there is no invoking state; meaning nobody call
     * current context.
     */
    public isEmpty(): boolean {
        return this.invokingState === -1;
    }

    public get ruleContext(): ParserRuleContext {
        return this;
    }

    public get ruleIndex(): number {
        return -1;
    }

    public getPayload(): ParserRuleContext {
        return this;
    }

    public getText(): string {
        if (this.children.length === 0) {
            return "";
        }

        return this.children.map((child) => {
            return child.getText();
        }).join("");
    }

    /**
     * For rule associated with this parse tree internal node, return
     * the outer alternative number used to match the input. Default
     * implementation does not compute nor store this alt num. Create
     * a subclass of ParserRuleContext with backing field and set
     * option contextSuperClass.
     * to set it.
     */
    public getAltNumber(): number {
        return ATN.INVALID_ALT_NUMBER;
    }

    /**
     * Set the outer alternative number for this context node. Default
     * implementation does nothing to avoid backing field overhead for
     * trees that don't need it.  Create
     * a subclass of ParserRuleContext with backing field and set
     * option contextSuperClass.
     */
    public setAltNumber(_altNumber: number): void {
    }

    public accept<T>(visitor: ParseTreeVisitor<T>): T | null {
        return visitor.visitChildren(this);
    }

    /**
     * Print out a whole tree, not just a node, in LISP format
     * (root child1 .. childN). Print just a node if this is a leaf.
     */
    public toStringTree(recog?: Parser): string;
    public toStringTree(ruleNames: string[] | null, recog: Parser): string;
    public toStringTree(...args: unknown[]): string {
        if (args.length < 2) {
            return Trees.toStringTree(this, null, args[0] as Parser | undefined);
        }

        return Trees.toStringTree(this, args[0] as string[] | null, args[1] as Parser);
    }

    public toString(ruleNames?: string[] | null, stop?: ParserRuleContext | null): string {
        ruleNames = ruleNames ?? null;
        stop = stop ?? null;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let p: ParserRuleContext | null = this;
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
            if (p.parent !== null && (ruleNames !== null || !p.parent.isEmpty())) {
                s += " ";
            }
            p = p.parent;
        }
        s += "]";

        return s;
    }
}
