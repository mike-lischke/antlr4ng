/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Parser } from "../Parser.js";
import { RuleContext } from "./RuleContext.js";
import { SemanticContext } from "./SemanticContext.js";

export declare class PrecedencePredicate extends SemanticContext {
    public precedence: number;

    public constructor(precedence?: number);

    public evaluate(parser: Parser, parserCallStack: RuleContext): boolean;
    public evalPrecedence(parser: Parser, parserCallStack: RuleContext): SemanticContext;

    public compareTo(o: PrecedencePredicate): number;
    public equals(other: unknown): boolean;
    public toString(): string;
}
