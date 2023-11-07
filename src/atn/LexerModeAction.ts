/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { LexerActionType } from "./LexerActionType.js";
import { LexerAction } from "./LexerAction.js";
import { Lexer } from "../Lexer.js";
import { HashCode } from "../misc/HashCode.js";

/**
 * Implements the {@code mode} lexer action by calling {@link Lexer//mode} with
 * the assigned mode
 */
export class LexerModeAction extends LexerAction {
    private readonly mode: number;

    public constructor(mode: number) {
        super(LexerActionType.MODE);
        this.mode = mode;
    }

    /**
     * <p>This action is implemented by calling {@link Lexer//mode} with the
     * value provided by {@link getMode}.</p>
     */
    public override execute(lexer: Lexer): void {
        lexer.mode(this.mode);
    }

    public override updateHashCode(hash: HashCode): void {
        hash.update(this.actionType, this.mode);
    }

    public override equals(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof LexerModeAction)) {
            return false;
        } else {
            return this.mode === other.mode;
        }
    }

    public override toString(): string {
        return "mode(" + this.mode + ")";
    }
}
