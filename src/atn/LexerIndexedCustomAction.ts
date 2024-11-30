/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { LexerAction } from "./LexerAction.js";
import { Lexer } from "../Lexer.js";
import { MurmurHash } from "../utils/MurmurHash.js";

/**
 * This implementation of {@link LexerAction} is used for tracking input offsets
 * for position-dependent actions within a {@link LexerActionExecutor}.
 *
 * This action is not serialized as part of the ATN, and is only required for
 * position-dependent lexer actions which appear at a location other than the
 * end of a rule. For more information about DFA optimizations employed for
 * lexer actions, see {@link LexerActionExecutor//append} and
 * {@link LexerActionExecutor//fixOffsetBeforeMatch}.
 *
 * Constructs a new indexed custom action by associating a character offset
 * with a {@link LexerAction}.
 *
 * Note: This class is only required for lexer actions for which
 * {@link LexerAction//isPositionDependent} returns `true`.
 *
 * @param offset The offset into the input {@link CharStream}, relative to
 * the token start index, at which the specified lexer action should be
 * executed.
 * @param action The lexer action to execute at a particular offset in the
 * input {@link CharStream}.
 */

export class LexerIndexedCustomAction implements LexerAction {
    public readonly offset: number;
    public readonly action: LexerAction;
    public readonly actionType: number;
    public isPositionDependent: boolean = true;

    private cachedHashCode: number | undefined;

    public constructor(offset: number, action: LexerAction) {
        this.actionType = action.actionType;
        this.offset = offset;
        this.action = action;
    }

    /**
     * This method calls {@link execute} on the result of {@link getAction}
     * using the provided `lexer`.
     */
    public execute(lexer: Lexer): void {
        // Assume the input stream position was properly set by the calling code
        this.action.execute(lexer);
    }

    public hashCode(): number {
        if (this.cachedHashCode === undefined) {
            let hash = MurmurHash.initialize();
            hash = MurmurHash.update(hash, this.offset);
            hash = MurmurHash.updateFromComparable(hash, this.action);

            this.cachedHashCode = MurmurHash.finish(hash, 2);
        }

        return this.cachedHashCode;
    }

    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof LexerIndexedCustomAction)) {
            return false;
        }

        return this.offset === other.offset && this.action === other.action;
    }
}
