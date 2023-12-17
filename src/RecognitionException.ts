/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream } from "./CharStream.js";
import { ParserRuleContext } from "./ParserRuleContext.js";
import { Recognizer } from "./Recognizer.js";
import { RuleContext } from "./RuleContext.js";
import { Token } from "./Token.js";
import { TokenStream } from "./TokenStream.js";
import { ATNSimulator } from "./atn/ATNSimulator.js";
import { IntervalSet } from "./misc/IntervalSet.js";

export interface IExceptionParams {
    message: string;
    recognizer: Recognizer<ATNSimulator> | null;
    input: CharStream | TokenStream | null;
    ctx: ParserRuleContext | null;
}

/**
 * The root of the ANTLR exception hierarchy. In general, ANTLR tracks just
 *  3 kinds of errors: prediction errors, failed predicate errors, and
 *  mismatched input errors. In each case, the parser knows where it is
 *  in the input, where it is in the ATN, the rule invocation stack,
 *  and what kind of problem occurred.
 */
export class RecognitionException extends Error {
    public ctx: RuleContext | null;

    /**
     * The current {@link Token} when an error occurred. Since not all streams
     * support accessing symbols by index, we have to track the {@link Token}
     * instance itself
     */
    public offendingToken: Token | null = null;

    /**
     * Get the ATN state number the parser was in at the time the error
     * occurred. For {@link NoViableAltException} and
     * {@link LexerNoViableAltException} exceptions, this is the
     * {@link DecisionState} number. For others, it is the state whose outgoing
     * edge we couldn't match.
     */
    public offendingState = -1;

    protected recognizer: Recognizer<ATNSimulator> | null;
    protected input: CharStream | TokenStream | null;

    public constructor(params: IExceptionParams) {
        super(params.message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RecognitionException);
        }

        this.message = params.message;
        this.recognizer = params.recognizer;
        this.input = params.input;
        this.ctx = params.ctx;

        if (this.recognizer !== null) {
            this.offendingState = this.recognizer.state;
        }
    }

    /**
     * Gets the set of input symbols which could potentially follow the
     * previously matched symbol at the time this exception was thrown.
     *
     * <p>If the set of expected tokens is not known and could not be computed,
     * this method returns {@code null}.</p>
     *
     * @returns The set of token types that could potentially follow the current
     * state in the ATN, or {@code null} if the information is not available.
     */
    public getExpectedTokens(): IntervalSet | null {
        if (this.recognizer !== null && this.ctx !== null) {
            return this.recognizer.atn.getExpectedTokens(this.offendingState, this.ctx);
        } else {
            return null;
        }
    }

    // <p>If the state number is not known, this method returns -1.</p>
    public override toString(): string {
        return this.message;
    }
}
