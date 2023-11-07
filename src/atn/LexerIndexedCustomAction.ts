/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { LexerAction } from "./LexerAction.js";
import { Lexer } from "../Lexer.js";
import { HashCode } from "../misc/HashCode.js";

/**
 * This implementation of {@link LexerAction} is used for tracking input offsets
 * for position-dependent actions within a {@link LexerActionExecutor}.
 *
 * <p>This action is not serialized as part of the ATN, and is only required for
 * position-dependent lexer actions which appear at a location other than the
 * end of a rule. For more information about DFA optimizations employed for
 * lexer actions, see {@link LexerActionExecutor//append} and
 * {@link LexerActionExecutor//fixOffsetBeforeMatch}.</p>
 *
 * Constructs a new indexed custom action by associating a character offset
 * with a {@link LexerAction}.
 *
 * <p>Note: This class is only required for lexer actions for which
 * {@link LexerAction//isPositionDependent} returns {@code true}.</p>
 *
 * @param offset The offset into the input {@link CharStream}, relative to
 * the token start index, at which the specified lexer action should be
 * executed.
 * @param action The lexer action to execute at a particular offset in the
 * input {@link CharStream}.
 */

export class LexerIndexedCustomAction extends LexerAction {
    public readonly offset: number;
    public readonly action: LexerAction;

    public constructor(offset: number, action: LexerAction) {
        super(action.actionType);
        this.offset = offset;
        this.action = action;
        this.isPositionDependent = true;
    }

    /**
     * <p>This method calls {@link execute} on the result of {@link getAction}
     * using the provided {@code lexer}.</p>
     */
    public execute(lexer: Lexer): void {
        // assume the input stream position was properly set by the calling code
        this.action.execute(lexer);
    }

    public override updateHashCode(hash: HashCode): void {
        hash.update(this.actionType, this.offset, this.action);
    }

    public override equals(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof LexerIndexedCustomAction)) {
            return false;
        } else {
            return this.offset === other.offset && this.action === other.action;
        }
    }
}
