/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "./ParserRuleContext.js";

export class InterpreterRuleContext extends ParserRuleContext {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    _ruleIndex;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(ruleIndex: any, parent: any, invokingStateNumber: any) {
        if (invokingStateNumber !== undefined) {
            super(parent, invokingStateNumber);
        } else {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
            super();
        }

        // eslint-disable-next-line no-underscore-dangle
        this._ruleIndex = ruleIndex;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get ruleIndex() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._ruleIndex;
    }
}
