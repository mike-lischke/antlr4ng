/* eslint-disable jsdoc/check-alignment, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { CharStream } from './CharStream.js';

/**
 * @deprecated Use CharStream instead
*/
export class InputStream extends CharStream {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(data: any, decodeToUnicodeCodePoints: any) {
        super(data, decodeToUnicodeCodePoints);
    }
}
