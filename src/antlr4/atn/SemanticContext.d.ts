/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import Parser from "../Parser.js";
import RuleContext from "../context/RuleContext.js";

export declare class SemanticContext {
    public hashCode(): number;
    public evaluate(parser: Parser, outerContext: RuleContext): boolean;
}

export default SemanticContext;
