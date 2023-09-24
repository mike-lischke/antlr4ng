/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "./ParserRuleContext.js";

export class InterpreterRuleContext extends ParserRuleContext {
    _ruleIndex;

    constructor(ruleIndex: any, parent: any, invokingStateNumber: any) {
        if (invokingStateNumber !== undefined) {
            super(parent, invokingStateNumber);
        } else {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
            super();
        }

        this._ruleIndex = ruleIndex;
    }

    get ruleIndex() {
        return this._ruleIndex;
    }
}
