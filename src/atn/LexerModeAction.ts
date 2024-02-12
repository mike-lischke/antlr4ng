/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { LexerActionType } from "./LexerActionType.js";
import { LexerAction } from "./LexerAction.js";
import { Lexer } from "../Lexer.js";
import { MurmurHash } from "../utils/MurmurHash.js";

/**
 * Implements the `mode` lexer action by calling {@link Lexer//mode} with
 * the assigned mode
 */
export class LexerModeAction extends LexerAction {
    public readonly mode: number;

    #cachedHashCode: number | undefined;

    public constructor(mode: number) {
        super(LexerActionType.MODE);
        this.mode = mode;
    }

    /**
     * This action is implemented by calling {@link Lexer//mode} with the
     * value provided by {@link getMode}.
     */
    public override execute(lexer: Lexer): void {
        lexer.mode(this.mode);
    }

    public override hashCode(): number {
        if (this.#cachedHashCode === undefined) {
            let hash = MurmurHash.initialize();
            hash = MurmurHash.update(hash, this.actionType);
            hash = MurmurHash.update(hash, this.mode);
            this.#cachedHashCode = MurmurHash.finish(hash, 2);
        }

        return this.#cachedHashCode;
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
