/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Parser } from "../Parser.js";
import { ParseTree } from "../tree/ParseTree.js";
import { Interval } from "../misc/Interval.js";
import { ParseTreeVisitor } from "../tree/ParseTreeVisitor.js";

export declare class RuleContext implements ParseTree {
    public get parent(): RuleContext | null;
    public children: ParseTree[] | null;
    public invokingState: number;

    public getParent(): ParseTree | null;
    public depth(): number;

    /**
     * A context is empty if there is no invoking state; meaning nobody call
     * current context.
     */
    public isEmpty(): boolean;

    public getSourceInterval(): Interval;

    public get ruleContext(): RuleContext;

    public get ruleIndex(): number;

    public getPayload<RuleContext>(): RuleContext;

    /**
     * Return the combined text of all child nodes. This method only considers
     * tokens which have been added to the parse tree.
     * <p>
     * Since tokens on hidden channels (e.g. whitespace or comments) are not
     * added to the parse trees, they will not appear in the output of this
     * method.
     */
    public getText(): string;

    /**
     * For rule associated with this parse tree internal node, return
     * the outer alternative number used to match the input. Default
     * implementation does not compute nor store this alt num. Create
     * a subclass of ParserRuleContext with backing field and set
     * option contextSuperClass.
     * to set it.
     */
    public getAltNumber(): number;

    /**
     * Set the outer alternative number for this context node. Default
     * implementation does nothing to avoid backing field overhead for
     * trees that don't need it.  Create
     * a subclass of ParserRuleContext with backing field and set
     * option contextSuperClass.
     */
    public setAltNumber(altNumber: number): void;

    public getChild<RuleContext>(i: number): RuleContext | null;

    public getChildCount(): number;

    public accept<Result>(visitor: ParseTreeVisitor<Result>): Result;

    /**
     * Print out a whole tree, not just a node, in LISP format
     * (root child1 .. childN). Print just a node if this is a leaf.
     */
    public toStringTree(): string;
    public toStringTree(ruleNames: string[] | null, recog: Parser): string;
}
