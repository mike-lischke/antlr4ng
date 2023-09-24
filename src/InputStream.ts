/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream } from './CharStream.js';

/**
 * @deprecated Use CharStream instead
*/
export class InputStream extends CharStream {
    constructor(data: any, decodeToUnicodeCodePoints: any) {
        super(data, decodeToUnicodeCodePoints);
    }
}
