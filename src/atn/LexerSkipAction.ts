/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LexerActionType } from "./LexerActionType.js";
import { LexerAction } from "./LexerAction.js";
import { Lexer } from "../Lexer.js";

/**
 * Implements the {@code skip} lexer action by calling {@link Lexer//skip}.
 *
 * <p>The {@code skip} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link INSTANCE}.</p>
 */
export class LexerSkipAction extends LexerAction {
    /** Provides a singleton instance of this parameter-less lexer action. */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly INSTANCE = new LexerSkipAction();

    public constructor() {
        super(LexerActionType.SKIP);
    }

    public execute(lexer: Lexer): void {
        lexer.skip();
    }

    public override toString(): string {
        return "skip";
    }
}
