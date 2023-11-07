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
 * Implements the {@code channel} lexer action by calling
 * {@link Lexer//setChannel} with the assigned channel.
 * Constructs a new {@code channel} action with the specified channel value.
 *
 * @param channel The channel value to pass to {@link Lexer//setChannel}
 */
export class LexerChannelAction extends LexerAction {
    public readonly channel: number;

    public constructor(channel: number) {
        super(LexerActionType.CHANNEL);
        this.channel = channel;
    }

    /**
     * <p>This action is implemented by calling {@link Lexer//setChannel} with the
     * value provided by {@link getChannel}.</p>
     */
    public execute(lexer: Lexer): void {
        // eslint-disable-next-line no-underscore-dangle
        lexer._channel = this.channel;
    }

    public override updateHashCode(hash: HashCode): void {
        hash.update(this.actionType, this.channel);
    }

    public override equals(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof LexerChannelAction)) {
            return false;
        } else {
            return this.channel === other.channel;
        }
    }

    public override toString(): string {
        return "channel(" + this.channel + ")";
    }
}
