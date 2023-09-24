/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ParseCancellationException extends Error {
    constructor() {
        super();
        // @ts-expect-error TS(2339): Property 'captureStackTrace' does not exist on typ... Remove this comment to see the full error message
        Error.captureStackTrace(this, ParseCancellationException);
    }
}
