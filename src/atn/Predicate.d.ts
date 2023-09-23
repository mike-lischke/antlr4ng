/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Parser } from "../Parser.js";
import { RuleContext } from "./RuleContext.js";
import { SemanticContext } from "./SemanticContext.js";

export declare class Predicate extends SemanticContext {
    public constructor(ruleIndex: number, predIndex: number, isCtxDependent: boolean);

    public evaluate(parser: Parser, outerContext: RuleContext): boolean;
    public equals(obj: unknown): boolean;
    public toString(): string;
}
