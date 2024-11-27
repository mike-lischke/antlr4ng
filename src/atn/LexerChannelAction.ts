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
 * Implements the `channel` lexer action by calling
 * {@link Lexer.setChannel} with the assigned channel.
 * Constructs a new `channel` action with the specified channel value.
 *
 * @param channel The channel value to pass to {@link Lexer.setChannel}
 */
export class LexerChannelAction implements LexerAction {
    public readonly channel: number;
    public readonly actionType: number;
    public isPositionDependent: boolean = false;

    private cachedHashCode: number | undefined;

    public constructor(channel: number) {
        this.actionType = LexerActionType.CHANNEL;
        this.channel = channel;
    }

    /**
     * This action is implemented by calling {@link Lexer.setChannel} with the
     * value provided by {@link getChannel}.
     */
    public execute(lexer: Lexer): void {
        // eslint-disable-next-line no-underscore-dangle
        lexer.channel = this.channel;
    }

    public hashCode(): number {
        if (this.cachedHashCode === undefined) {
            let hash = MurmurHash.initialize();
            hash = MurmurHash.update(hash, this.actionType);
            hash = MurmurHash.update(hash, this.channel);
            this.cachedHashCode = MurmurHash.finish(hash, 2);
        }

        return this.cachedHashCode;
    }

    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        }

        if (!(other instanceof LexerChannelAction)) {
            return false;
        }

        return this.channel === other.channel;
    }

    public toString(): string {
        return "channel(" + this.channel + ")";
    }
}
