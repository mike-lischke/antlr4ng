/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LexerActionType } from "./LexerActionType.js";
import { LexerAction } from "./LexerAction.js";
import { Lexer } from "../Lexer.js";
import { HashCode } from "../misc/HashCode.js";

/**
 * Implements the {@code type} lexer action by calling {@link Lexer//setType}
 * with the assigned type
 */

export class LexerTypeAction extends LexerAction {
    public readonly type: number;

    public constructor(type: number) {
        super(LexerActionType.TYPE);
        this.type = type;
    }

    public override execute(lexer: Lexer): void {
        // eslint-disable-next-line no-underscore-dangle
        lexer._type = this.type;
    }

    public override updateHashCode(hash: HashCode): void {
        hash.update(this.actionType, this.type);
    }

    public override equals(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof LexerTypeAction)) {
            return false;
        } else {
            return this.type === other.type;
        }
    }

    public override toString(): string {
        return "type(" + this.type + ")";
    }
}
