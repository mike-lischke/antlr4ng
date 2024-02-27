/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { type IntStream } from "./IntStream.js";
import { type ParserRuleContext } from "./ParserRuleContext.js";
import { type Token } from "./Token.js";
import { type TokenSource } from "./TokenSource.js";
import { type Interval } from "./misc/Interval.js";

/**
 * An IntStream whose symbols are {@link Token} instances.
 */
export interface TokenStream extends IntStream {
    /**
     * Get the {@link Token} instance associated with the value returned by
     * {@link LA LA(k)}. This method has the same pre- and post-conditions as
     * {@link IntStream.LA}. In addition, when the preconditions of this method
     * are met, the return value is non-null and the value of
     * `LT(k).getType()==LA(k)`.
     *
     * @see IntStream.LA
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LT(k: number): Token | null;

    /**
     * Gets the {@link Token} at the specified `index` in the stream. When
     * the preconditions of this method are met, the return value is non-null.
     *
     * The preconditions for this method are the same as the preconditions of
     * {@link IntStream.seek}. If the behavior of `seek(index)` is
     * unspecified for the current state and given `index`, then the
     * behavior of this method is also unspecified.
     *
     * The symbol referred to by `index` differs from `seek()` only
     * in the case of filtering streams where `index` lies before the end
     * of the stream. Unlike `seek()`, this method does not adjust
     * `index` to point to a non-ignored symbol.
     */
    get(index: number): Token;

    /**
     * Gets the underlying {@link TokenSource} which provides tokens for this
     * stream.
     */
    tokenSource: TokenSource;

    /**
     * Return the text of all tokens within the specified `interval`. This
     * method behaves like the following code (including potential exceptions
     * for violating preconditions of {@link get}, but may be optimized by the
     * specific implementation.
     *
     * ```
     * TokenStream stream = ...;
     * String text = "";
     * for (int i = interval.a; i <= interval.b; i++) {
     *   text += stream.get(i).getText();
     * }
     * ```
     *
     * @param interval The interval of tokens within this stream to get text
     * for.
     * @returns The text of all tokens within the specified interval in this
     * stream.
     *
     * @throws NullPointerException if `interval` is `null`
     */
    getTextFromInterval(interval: Interval): string;

    /**
     * Return the text of all tokens in the stream. This method behaves like the
     * following code, including potential exceptions from the calls to
     * {@link IntStream.size} and {@link getText getText(Interval)}, but may be
     * optimized by the specific implementation.
     *
     * ```
     * TokenStream stream = ...;
     * String text = stream.getTextWithInterval(new Interval(0, stream.size()));
     * ```
     *
     * @returns The text of all tokens in the stream.
     */
    getText(): string;

    /**
     * Return the text of all tokens in the source interval of the specified
     * context. This method behaves like the following code, including potential
     * exceptions from the call to {@link getText getText(Interval)}, but may be
     * optimized by the specific implementation.
     *
     * If `ctx.getSourceInterval()` does not return a valid interval of
     * tokens provided by this stream, the behavior is unspecified.
     *
     * ```
     * TokenStream stream = ...;
     * String text = stream.getTextWithInterval(ctx.getSourceInterval());
     * ```
     *
     * @param ctx The context providing the source interval of tokens to get
     * text for.
     * @returns The text of all tokens within the source interval of `ctx`.
     */
    getTextFromContext(ctx: ParserRuleContext): string;

    /**
     * Return the text of all tokens in this stream between `start` and
     * `stop` (inclusive).
     *
     * If the specified `start` or `stop` token was not provided by
     * this stream, or if the `stop` occurred before the `start`
     * token, the behavior is unspecified.
     *
     * For streams which ensure that the {@link Token.getTokenIndex} method is
     * accurate for all of its provided tokens, this method behaves like the
     * following code. Other streams may implement this method in other ways
     * provided the behavior is consistent with this at a high level.
     *
     * ```
     * TokenStream stream = ...;
     * String text = "";
     * for (int i = start.getTokenIndex(); i <= stop.getTokenIndex(); i++) {
     *   text += stream.get(i).getText();
     * }
     * ```
     *
     * @param start The first token in the interval to get text for.
     * @param stop The last token in the interval to get text for (inclusive).
     * @returns The text of all tokens lying between the specified `start`
     * and `stop` tokens.
     *
     * @throws UnsupportedOperationException if this stream does not support
     * this method for the specified tokens
     */
    getTextFromRange(start: Token | null, stop: Token | null): string;
}
