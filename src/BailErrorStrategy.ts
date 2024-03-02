/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { InputMismatchException } from "./InputMismatchException.js";
import { ParseCancellationException } from "./misc/ParseCancellationException.js";
import { DefaultErrorStrategy } from "./DefaultErrorStrategy.js";
import { Parser } from "./Parser.js";
import { RecognitionException } from "./RecognitionException.js";

/**
 * This implementation of {@link ANTLRErrorStrategy} responds to syntax errors
 * by immediately canceling the parse operation with a
 * {@link ParseCancellationException}. The implementation ensures that the
 * {@link ParserRuleContext.exception} field is set for all parse tree nodes
 * that were not completed prior to encountering the error.
 *
 * This error strategy is useful in the following scenarios.
 *
 * - **Two-stage parsing:** This error strategy allows the first
 * stage of two-stage parsing to immediately terminate if an error is
 * encountered, and immediately fall back to the second stage. In addition to
 * avoiding wasted work by attempting to recover from errors here, the empty
 * implementation of {@link BailErrorStrategy.sync} improves the performance of the first stage.
 * - **Silent validation:** When syntax errors are not being
 * reported or logged, and the parse result is simply ignored if errors occur,
 * the {@link BailErrorStrategy} avoids wasting work on recovering from errors
 * when the result will be ignored either way.
 *
 * `myParser.setErrorHandler(new BailErrorStrategy());`
 *
 * @see Parser#setErrorHandler(ANTLRErrorStrategy)
 */
export class BailErrorStrategy extends DefaultErrorStrategy {

    /**
     * Instead of recovering from exception `e`, re-throw it wrapped
     * in a {@link ParseCancellationException} so it is not caught by the
     * rule function catches. Use {@link Exception//getCause()} to get the
     * original {@link RecognitionException}.
     */
    public override recover(recognizer: Parser, e: RecognitionException): void {
        throw new ParseCancellationException(e);
    }

    /**
     * Make sure we don't attempt to recover inline; if the parser
     * successfully recovers, it won't throw an exception.
     */
    public override recoverInline(recognizer: Parser): never {
        const exception = new InputMismatchException(recognizer);

        throw new ParseCancellationException(exception);
    }

    // Make sure we don't attempt to recover from problems in subrules.
    public override sync(_recognizer: Parser): void {
        // pass
    }
}
