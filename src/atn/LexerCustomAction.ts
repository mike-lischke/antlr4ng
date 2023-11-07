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
 * Executes a custom lexer action by calling {@link Recognizer//action} with the
 * rule and action indexes assigned to the custom action. The implementation of
 * a custom action is added to the generated code for the lexer in an override
 * of {@link Recognizer//action} when the grammar is compiled.
 *
 * <p>This class may represent embedded actions created with the <code>{...}</code>
 * syntax in ANTLR 4, as well as actions created for lexer commands where the
 * command argument could not be evaluated when the grammar was compiled.</p>
 */
export class LexerCustomAction extends LexerAction {
    private ruleIndex: number;
    private actionIndex: number;

    /**
     * Constructs a custom lexer action with the specified rule and action
     * indexes.
     *
     * @param ruleIndex The rule index to use for calls to
     * {@link Recognizer//action}.
     * @param actionIndex The action index to use for calls to
     * {@link Recognizer//action}.
     */
    public constructor(ruleIndex: number, actionIndex: number) {
        super(LexerActionType.CUSTOM);
        this.ruleIndex = ruleIndex;
        this.actionIndex = actionIndex;
        this.isPositionDependent = true;
    }

    /**
     * <p>Custom actions are implemented by calling {@link Lexer//action} with the
     * appropriate rule and action indexes.</p>
     */
    public override execute(lexer: Lexer): void {
        lexer.action(null, this.ruleIndex, this.actionIndex);
    }

    public override updateHashCode(hash: HashCode): void {
        hash.update(this.actionType, this.ruleIndex, this.actionIndex);
    }

    public override equals(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof LexerCustomAction)) {
            return false;
        } else {
            return this.ruleIndex === other.ruleIndex && this.actionIndex === other.actionIndex;
        }
    }
}
