/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Lexer } from "../Lexer.js";
import type { IComparable } from "../index.js";

/**
 * Represents a single action which can be executed following the successful
 * match of a lexer rule. Lexer actions are used for both embedded action syntax
 * and ANTLR 4's new lexer command syntax.
 */
export interface LexerAction extends IComparable {
    readonly actionType: number;
    isPositionDependent: boolean;

    execute(lexer: Lexer): void;
    toString(): string;
}
