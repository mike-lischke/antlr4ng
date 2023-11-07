/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { Token } from "./Token.js";
import { BufferedTokenStream } from "./BufferedTokenStream.js";
import { TokenSource } from "./TokenSource.js";

/**
 * This class extends {@link BufferedTokenStream} with functionality to filter
 * token streams to tokens on a particular channel (tokens where
 * {@link Token//getChannel} returns a particular value).
 *
 * <p>
 * This token stream provides access to all tokens by index or when calling
 * methods like {@link getText}. The channel filtering is only used for code
 * accessing tokens via the lookahead methods {@link LA}, {@link LT}, and
 * {@link LB}.</p>
 *
 * <p>
 * By default, tokens are placed on the default channel
 * ({@link Token//DEFAULT_CHANNEL}), but may be reassigned by using the
 * {@code ->channel(HIDDEN)} lexer command, or by using an embedded action to
 * call {@link Lexer//setChannel}.
 * </p>
 *
 * <p>
 * Note: lexer rules which use the {@code ->skip} lexer command or call
 * {@link Lexer//skip} do not produce tokens at all, so input text matched by
 * such a rule will not be available as part of the token stream, regardless of
 * channel.</p>
 */
export class CommonTokenStream extends BufferedTokenStream {
    /**
     * Specifies the channel to use for filtering tokens.
     *
     * <p>
     * The default value is {@link Token#DEFAULT_CHANNEL}, which matches the
     * default channel assigned to tokens created by the lexer.</p>
     */
    protected channel = Token.DEFAULT_CHANNEL;

    public constructor(lexer: TokenSource, channel?: number) {
        super(lexer);
        this.channel = channel ?? Token.DEFAULT_CHANNEL;
    }

    public override adjustSeekIndex(i: number): number {
        return this.nextTokenOnChannel(i, this.channel);
    }

    public override LB(k: number): Token | null {
        if (k === 0 || this.index - k < 0) {
            return null;
        }
        let i = this.index;
        let n = 1;
        // find k good tokens looking backwards
        while (n <= k) {
            // skip off-channel tokens
            i = this.previousTokenOnChannel(i - 1, this.channel);
            n += 1;
        }
        if (i < 0) {
            return null;
        }

        return this.tokens[i];
    }

    public override LT(k: number): Token | null {
        this.lazyInit();
        if (k === 0) {
            return null;
        }
        if (k < 0) {
            return this.LB(-k);
        }
        let i = this.index;
        let n = 1; // we know tokens[pos] is a good one
        // find k good tokens
        while (n < k) {
            // skip off-channel tokens, but make sure to not look past EOF
            if (this.sync(i + 1)) {
                i = this.nextTokenOnChannel(i + 1, this.channel);
            }
            n += 1;
        }

        return this.tokens[i];
    }

    // Count EOF just once.
    public getNumberOfOnChannelTokens(): number {
        let n = 0;
        this.fill();
        for (const t of this.tokens) {
            if (t.channel === this.channel) {
                n += 1;
            }
            if (t.type === Token.EOF) {
                break;
            }
        }

        return n;
    }
}
