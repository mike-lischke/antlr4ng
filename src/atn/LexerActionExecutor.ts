/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */

import { LexerIndexedCustomAction } from "./LexerIndexedCustomAction.js";
import { LexerAction } from "./LexerAction.js";
import { CharStream } from "../CharStream.js";
import { Lexer } from "../Lexer.js";
import { MurmurHash } from "../utils/MurmurHash.js";

export class LexerActionExecutor implements LexerAction {
    public readonly lexerActions: LexerAction[];
    public readonly actionType: number;
    public isPositionDependent: boolean = false;

    #cachedHashCode: number | undefined;

    /**
     * Represents an executor for a sequence of lexer actions which traversed during
     * the matching operation of a lexer rule (token).
     *
     * The executor tracks position information for position-dependent lexer actions
     * efficiently, ensuring that actions appearing only at the end of the rule do
     * not cause bloating of the {@link DFA} created for the lexer.
     */
    public constructor(lexerActions?: LexerAction[]) {
        this.actionType = -1;
        this.lexerActions = lexerActions ?? [];

        return this;
    }

    /**
     * Creates a {@link LexerActionExecutor} which executes the actions for
     * the input `lexerActionExecutor` followed by a specified
     * `lexerAction`.
     *
     * @param lexerActionExecutor The executor for actions already traversed by
     * the lexer while matching a token within a particular
     * {@link LexerATNConfig}. If this is `null`, the method behaves as
     * though it were an empty executor.
     * @param lexerAction The lexer action to execute after the actions
     * specified in `lexerActionExecutor`.
     *
     * @returns {LexerActionExecutor} A {@link LexerActionExecutor} for executing the combine actions
     * of `lexerActionExecutor` and `lexerAction`.
     */
    public static append(lexerActionExecutor: LexerActionExecutor | null,
        lexerAction: LexerAction): LexerActionExecutor {
        if (lexerActionExecutor === null) {
            return new LexerActionExecutor([lexerAction]);
        }

        const lexerActions = lexerActionExecutor.lexerActions.concat([lexerAction]);

        return new LexerActionExecutor(lexerActions);
    }

    /**
     * Creates a {@link LexerActionExecutor} which encodes the current offset
     * for position-dependent lexer actions.
     *
     * Normally, when the executor encounters lexer actions where
     * {@link LexerAction//isPositionDependent} returns `true`, it calls
     * {@link IntStream.seek} on the input {@link CharStream} to set the input
     * position to the *end* of the current token. This behavior provides
     * for efficient DFA representation of lexer actions which appear at the end
     * of a lexer rule, even when the lexer rule matches a variable number of
     * characters.
     *
     * Prior to traversing a match transition in the ATN, the current offset
     * from the token start index is assigned to all position-dependent lexer
     * actions which have not already been assigned a fixed offset. By storing
     * the offsets relative to the token start index, the DFA representation of
     * lexer actions which appear in the middle of tokens remains efficient due
     * to sharing among tokens of the same length, regardless of their absolute
     * position in the input stream.
     *
     * If the current executor already has offsets assigned to all
     * position-dependent lexer actions, the method returns `this`.
     *
     * @param offset The current offset to assign to all position-dependent
     * lexer actions which do not already have offsets assigned.
     *
     * @returns {LexerActionExecutor} A {@link LexerActionExecutor} which stores input stream offsets
     * for all position-dependent lexer actions.
     */
    public fixOffsetBeforeMatch(offset: number): LexerActionExecutor {
        let updatedLexerActions = null;
        for (let i = 0; i < this.lexerActions.length; i++) {
            if (this.lexerActions[i].isPositionDependent &&
                !(this.lexerActions[i] instanceof LexerIndexedCustomAction)) {
                if (updatedLexerActions === null) {
                    updatedLexerActions = this.lexerActions.concat([]);
                }
                updatedLexerActions[i] = new LexerIndexedCustomAction(offset,
                    this.lexerActions[i]);
            }
        }
        if (updatedLexerActions === null) {
            return this;
        } else {
            return new LexerActionExecutor(updatedLexerActions);
        }
    }

    /**
     * Execute the actions encapsulated by this executor within the context of a
     * particular {@link Lexer}.
     *
     * This method calls {@link IntStream.seek} to set the position of the
     * `input` {@link CharStream} prior to calling
     * {@link LexerAction.execute} on a position-dependent action. Before the
     * method returns, the input position will be restored to the same position
     * it was in when the method was invoked.
     *
     * @param lexer The lexer instance.
     * @param input The input stream which is the source for the current token.
     * When this method is called, the current {@link IntStream.index} for
     * `input` should be the start of the following token, i.e. 1
     * character past the end of the current token.
     * @param startIndex The token start index. This value may be passed to
     * {@link IntStream.seek} to set the `input` position to the beginning
     * of the token.
     */
    public execute(lexer: Lexer, input?: CharStream, startIndex?: number): void {
        if (input === undefined || startIndex === undefined) {
            return;
        }

        let requiresSeek = false;
        const stopIndex = input.index;
        try {
            for (const lexerAction of this.lexerActions) {
                let action = lexerAction;
                if (lexerAction instanceof LexerIndexedCustomAction) {
                    const offset = lexerAction.offset;
                    input.seek(startIndex + offset);
                    action = lexerAction.action;
                    requiresSeek = (startIndex + offset) !== stopIndex;
                } else if (lexerAction.isPositionDependent) {
                    input.seek(stopIndex);
                    requiresSeek = false;
                }
                action.execute(lexer);
            }
        } finally {
            if (requiresSeek) {
                input.seek(stopIndex);
            }
        }
    }

    public hashCode(): number {
        if (this.#cachedHashCode === undefined) {
            let hashCode = MurmurHash.initialize(7);
            for (const lexerAction of this.lexerActions) {
                hashCode = MurmurHash.update(hashCode, lexerAction.hashCode());
            }
            this.#cachedHashCode = MurmurHash.finish(hashCode, this.lexerActions.length);
        }

        return this.#cachedHashCode;
    }

    public get cachedHashCode(): number | undefined {
        return this.#cachedHashCode;
    }

    public equals(other: LexerActionExecutor): boolean {
        if (this === other) {
            return true;
        }

        if (this.cachedHashCode !== other.cachedHashCode) {
            return false;
        }

        if (this.lexerActions.length !== other.lexerActions.length) {
            return false;
        }

        return this.lexerActions.every((action, index) => { return action.equals(other.lexerActions[index]); });
    }
}
