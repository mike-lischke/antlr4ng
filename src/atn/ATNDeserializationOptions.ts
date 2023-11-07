/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ATNDeserializationOptions {
    public static readonly defaultOptions = new ATNDeserializationOptions();

    public readOnly = false;
    public verifyATN: boolean;
    public generateRuleBypassTransitions: boolean;

    public constructor(copyFrom?: ATNDeserializationOptions) {
        this.readOnly = false;
        this.verifyATN = copyFrom == null ? true : copyFrom.verifyATN;
        this.generateRuleBypassTransitions = copyFrom == null ? false : copyFrom.generateRuleBypassTransitions;
    }

    static {
        ATNDeserializationOptions.defaultOptions.readOnly = true;
    }
}
