/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from "../Token.js";
import { RecognitionException } from "../error/RecognitionException.js";
import { ErrorNode } from "../tree/ErrorNode.js";
import { TerminalNode } from "../tree/TerminalNode.js";
import { RuleContext } from "./RuleContext.js";

export declare class ParserRuleContext extends RuleContext {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EMPTY: ParserRuleContext;

    public start: Token | null;
    public stop: Token | null;
    public exception?: RecognitionException;

    public constructor(parent: ParserRuleContext | null, invokingStateNumber: number);

    public copyFrom(ctx: ParserRuleContext): void;
    public addChild(child: RuleContext): void;
    public removeLastChild(): void;
    public addTokenNode(token: Token): TerminalNode;
    public addErrorNode(badToken: Token): ErrorNode;
    public getChildCount(): number;
    public getChild<RuleContext>(i: number): RuleContext | null;
    public getToken(ttype: number, i: number): TerminalNode | null;
    public getTokens(ttype: number): TerminalNode[];
    public getRuleContext<T extends ParserRuleContext>(
        index: number, ctxType: new (parent: ParserRuleContext | null, invokingStateNumber: number) => T): T | null;
    public getRuleContexts<T extends ParserRuleContext>(
        ctxType: new (parent: ParserRuleContext | null, invokingStateNumber: number) => T): T[];

    public get ruleIndex(): number;
}
