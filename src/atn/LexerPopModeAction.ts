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
 * Implements the `popMode` lexer action by calling {@link Lexer.popMode}.
 *
 * The `popMode` command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link instance}.
 */
export class LexerPopModeAction implements LexerAction {
    public static readonly instance = new LexerPopModeAction();
    public readonly actionType: number;
    public isPositionDependent: boolean = false;

    public constructor() {
        this.actionType = LexerActionType.POP_MODE;
    }

    public equals(obj: unknown): boolean {
        return obj === this;
    }

    public hashCode(): number {
        return LexerActionType.POP_MODE;
    }

    /**
     * This action is implemented by calling {@link Lexer//popMode}.
     */
    public execute(lexer: Lexer): void {
        lexer.popMode();
    }

    public toString(): string {
        return "popMode";
    }
}
