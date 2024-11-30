/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LexerActionType } from "./LexerActionType.js";
import { LexerAction } from "./LexerAction.js";
import { Lexer } from "../Lexer.js";
import { MurmurHash } from "../utils/MurmurHash.js";

/**
 * Implements the `type` lexer action by calling {@link Lexer.setType} with the assigned type.
 */
export class LexerTypeAction implements LexerAction {
    public readonly type: number;
    public readonly actionType: number;
    public isPositionDependent: boolean = false;

    private cachedHashCode: number | undefined;

    public constructor(type: number) {
        this.actionType = LexerActionType.TYPE;
        this.type = type;
    }

    public execute(lexer: Lexer): void {
        lexer.type = this.type;
    }

    public hashCode(): number {
        if (this.cachedHashCode === undefined) {
            let hash = MurmurHash.initialize();
            hash = MurmurHash.update(hash, this.actionType);
            hash = MurmurHash.update(hash, this.type);
            this.cachedHashCode = MurmurHash.finish(hash, 2);
        }

        return this.cachedHashCode;
    }

    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof LexerTypeAction)) {
            return false;
        }

        return this.type === other.type;
    }

    public toString(): string {
        return "type(" + this.type + ")";
    }
}
