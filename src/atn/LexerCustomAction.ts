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
 * Executes a custom lexer action by calling {@link Recognizer.action} with the
 * rule and action indexes assigned to the custom action. The implementation of
 * a custom action is added to the generated code for the lexer in an override
 * of {@link Recognizer//action} when the grammar is compiled.
 *
 * This class may represent embedded actions created with the `{...}`
 * syntax in ANTLR 4, as well as actions created for lexer commands where the
 * command argument could not be evaluated when the grammar was compiled.
 */
export class LexerCustomAction implements LexerAction {
    public readonly ruleIndex: number;
    public readonly actionIndex: number;
    public readonly actionType: number;
    public isPositionDependent: boolean = true;

    private cachedHashCode: number | undefined;

    /**
     * Constructs a custom lexer action with the specified rule and action indexes.
     *
     * @param ruleIndex The rule index to use for calls to {@link Recognizer.action}.
     * @param actionIndex The action index to use for calls to {@link Recognizer.action}.
     */
    public constructor(ruleIndex: number, actionIndex: number) {
        this.actionType = LexerActionType.CUSTOM;
        this.ruleIndex = ruleIndex;
        this.actionIndex = actionIndex;
    }

    /**
     * Custom actions are implemented by calling {@link Lexer.action} with the
     * appropriate rule and action indexes.
     */
    public execute(lexer: Lexer): void {
        lexer.action(null, this.ruleIndex, this.actionIndex);
    }

    public hashCode(): number {
        if (this.cachedHashCode === undefined) {
            let hash = MurmurHash.initialize();
            hash = MurmurHash.update(hash, this.actionType);
            hash = MurmurHash.update(hash, this.ruleIndex);
            hash = MurmurHash.update(hash, this.actionIndex);
            this.cachedHashCode = MurmurHash.finish(hash, 3);
        }

        return this.cachedHashCode;
    }

    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof LexerCustomAction)) {
            return false;
        }

        return this.ruleIndex === other.ruleIndex && this.actionIndex === other.actionIndex;
    }
}
