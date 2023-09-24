/* eslint-disable jsdoc/require-param, jsdoc/no-undefined-types, jsdoc/require-returns, jsdoc/check-tag-names, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { LexerIndexedCustomAction } from './LexerIndexedCustomAction.js';
import { HashCode } from "../misc/HashCode.js";

export class LexerActionExecutor {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    cachedHashCode: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    lexerActions: any;
    /**
     * Represents an executor for a sequence of lexer actions which traversed during
     * the matching operation of a lexer rule (token).
     *
     * <p>The executor tracks position information for position-dependent lexer actions
     * efficiently, ensuring that actions appearing only at the end of the rule do
     * not cause bloating of the {@link DFA} created for the lexer.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(lexerActions: any) {
        this.lexerActions = lexerActions === null ? [] : lexerActions;
        /**
         * Caches the result of {@link //hashCode} since the hash code is an element
         * of the performance-critical {@link LexerATNConfig//hashCode} operation
         */
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        this.cachedHashCode = HashCode.hashStuff(lexerActions); // "".join([str(la) for la in
        // lexerActions]))
        // eslint-disable-next-line padding-line-between-statements
        return this;
    }

    /**
     * Creates a {@link LexerActionExecutor} which encodes the current offset
     * for position-dependent lexer actions.
     *
     * <p>Normally, when the executor encounters lexer actions where
     * {@link LexerAction//isPositionDependent} returns {@code true}, it calls
     * {@link IntStream//seek} on the input {@link CharStream} to set the input
     * position to the <em>end</em> of the current token. This behavior provides
     * for efficient DFA representation of lexer actions which appear at the end
     * of a lexer rule, even when the lexer rule matches a variable number of
     * characters.</p>
     *
     * <p>Prior to traversing a match transition in the ATN, the current offset
     * from the token start index is assigned to all position-dependent lexer
     * actions which have not already been assigned a fixed offset. By storing
     * the offsets relative to the token start index, the DFA representation of
     * lexer actions which appear in the middle of tokens remains efficient due
     * to sharing among tokens of the same length, regardless of their absolute
     * position in the input stream.</p>
     *
     * <p>If the current executor already has offsets assigned to all
     * position-dependent lexer actions, the method returns {@code this}.</p>
     *
     * @param offset The current offset to assign to all position-dependent
     * lexer actions which do not already have offsets assigned.
     *
     * @return {LexerActionExecutor} A {@link LexerActionExecutor} which stores input stream offsets
     * for all position-dependent lexer actions.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    fixOffsetBeforeMatch(offset: any) {
        let updatedLexerActions = null;
        for (let i = 0; i < this.lexerActions.length; i++) {
            if (this.lexerActions[i].isPositionDependent &&
                !(this.lexerActions[i] instanceof LexerIndexedCustomAction)) {
                if (updatedLexerActions === null) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
     * <p>This method calls {@link IntStream//seek} to set the position of the
     * {@code input} {@link CharStream} prior to calling
     * {@link LexerAction//execute} on a position-dependent action. Before the
     * method returns, the input position will be restored to the same position
     * it was in when the method was invoked.</p>
     *
     * @param lexer The lexer instance.
     * @param input The input stream which is the source for the current token.
     * When this method is called, the current {@link IntStream//index} for
     * {@code input} should be the start of the following token, i.e. 1
     * character past the end of the current token.
     * @param startIndex The token start index. This value may be passed to
     * {@link IntStream//seek} to set the {@code input} position to the beginning
     * of the token.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    execute(lexer: any, input: any, startIndex: any) {
        let requiresSeek = false;
        const stopIndex = input.index;
        try {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < this.lexerActions.length; i++) {
                let lexerAction = this.lexerActions[i];
                if (lexerAction instanceof LexerIndexedCustomAction) {
                    const offset = lexerAction.offset;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    input.seek(startIndex + offset);
                    lexerAction = lexerAction.action;
                    requiresSeek = (startIndex + offset) !== stopIndex;
                } else if (lexerAction.isPositionDependent) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    input.seek(stopIndex);
                    requiresSeek = false;
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                lexerAction.execute(lexer);
            }
        } finally {
            if (requiresSeek) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                input.seek(stopIndex);
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    hashCode() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.cachedHashCode;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    updateHashCode(hash: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        hash.update(this.cachedHashCode);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof LexerActionExecutor)) {
            return false;
        // eslint-disable-next-line eqeqeq
        } else if (this.cachedHashCode != other.cachedHashCode) {
            return false;
        // eslint-disable-next-line eqeqeq
        } else if (this.lexerActions.length != other.lexerActions.length) {
            return false;
        } else {
            const numActions = this.lexerActions.length;
            for (let idx = 0; idx < numActions; ++idx) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (!this.lexerActions[idx].equals(other.lexerActions[idx])) {
                    return false;
                }
            }
            // eslint-disable-next-line padding-line-between-statements
            return true;
        }
    }

    /**
     * Creates a {@link LexerActionExecutor} which executes the actions for
     * the input {@code lexerActionExecutor} followed by a specified
     * {@code lexerAction}.
     *
     * @param lexerActionExecutor The executor for actions already traversed by
     * the lexer while matching a token within a particular
     * {@link LexerATNConfig}. If this is {@code null}, the method behaves as
     * though it were an empty executor.
     * @param lexerAction The lexer action to execute after the actions
     * specified in {@code lexerActionExecutor}.
     *
     * @return {LexerActionExecutor} A {@link LexerActionExecutor} for executing the combine actions
     * of {@code lexerActionExecutor} and {@code lexerAction}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    static append(lexerActionExecutor: any, lexerAction: any) {
        if (lexerActionExecutor === null) {
            return new LexerActionExecutor([lexerAction]);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const lexerActions = lexerActionExecutor.lexerActions.concat([lexerAction]);
        // eslint-disable-next-line padding-line-between-statements
        return new LexerActionExecutor(lexerActions);
    }
}
