/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParseTreeListener } from "./ParseTreeListener.js";
import { ParseTree } from "./ParseTree.js";

export declare class ParseTreeWalker {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static DEFAULT: ParseTreeWalker;

    public walk<T extends ParseTreeListener>(listener: T, t: ParseTree): void;
}
