/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream } from "../CharStream.js";
import { Recognizer } from "../Recognizer.js";
import { Token } from "../Token.js";
import { TokenStream } from "../TokenStream.js";
import { ATNSimulator } from "../atn/ATNSimulator.js";
import { ParserRuleContext } from "../context/ParserRuleContext.js";
import { RuleContext } from "../context/RuleContext.js";

export interface IExceptionParams {
    message: string;
    recognizer: Recognizer<ATNSimulator> | null;
    input: CharStream | TokenStream | null;
    ctx: ParserRuleContext | null;
}

export declare class RecognitionException extends Error {
    public ctx: RuleContext;
    public offendingToken: Token | null;

    public constructor(params: IExceptionParams);
}
