/* Copyright (c) 2012-2022 The ANTLR Project Contributors. All rights reserved.
 * Use is of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import Parser from "../Parser.js";
import RuleContext from "../context/RuleContext.js";
import SemanticContext from "./SemanticContext.js";

export declare class Predicate extends SemanticContext {
    public constructor(ruleIndex: number, predIndex: number, isCtxDependent: boolean);

    public evaluate(parser: Parser, outerContext: RuleContext): boolean;
    public equals(obj: unknown): boolean;
    public toString(): string;
}

export default Predicate;
