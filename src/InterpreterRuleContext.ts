/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "./ParserRuleContext.js";

/**
 * This class extends {@link ParserRuleContext} by allowing the value of
 * {@link getRuleIndex} to be explicitly set for the context.
 *
 * {@link ParserRuleContext} does not include field storage for the rule index
 * since the context classes created by the code generator override the
 * {@link getRuleIndex} method to return the correct value for that context.
 * Since the parser interpreter does not use the context classes generated for a
 * parser, this class (with slightly more memory overhead per node) is used to
 * provide equivalent functionality.
 */
export class InterpreterRuleContext extends ParserRuleContext {
    /** This is the backing field for {@link #getRuleIndex}. */
    #ruleIndex: number;

    public constructor(ruleIndex: number, parent: ParserRuleContext | null, invokingStateNumber?: number) {
        super(parent, invokingStateNumber);

        this.#ruleIndex = ruleIndex;
    }

    public override get ruleIndex(): number {
        return this.#ruleIndex;
    }
}
