/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { LexerActionType } from "./LexerActionType.js";
import { LexerAction } from "./LexerAction.js";
import { Lexer } from "../Lexer.js";

/**
 * Implements the `popMode` lexer action by calling {@link Lexer//popMode}.
 *
 * The `popMode` command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link INSTANCE}.
 */
export class LexerPopModeAction extends LexerAction {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly INSTANCE = new LexerPopModeAction();

    public constructor() {
        super(LexerActionType.POP_MODE);
    }

    /**
     * This action is implemented by calling {@link Lexer//popMode}.
     */
    public override execute(lexer: Lexer): void {
        lexer.popMode();
    }

    public override toString(): string {
        return "popMode";
    }
}
