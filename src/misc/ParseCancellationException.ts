/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * This exception is thrown to cancel a parsing operation. This exception does
 * not extend {@link RecognitionException}, allowing it to bypass the standard
 * error recovery mechanisms. {@link BailErrorStrategy} throws this exception in
 * response to a parse error.
 */
export class ParseCancellationException extends Error {

    public constructor(e: Error) {
        super();
        this.cause = e;
        //Error.captureStackTrace(this, ParseCancellationException);
    }
}
