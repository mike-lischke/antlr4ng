/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { IntStream } from "./IntStream.js";
import { Token } from "./Token.js";
import { TokenSource } from "./TokenSource.js";
import { Interval } from "./misc/Interval.js";

/**
 * An IntStream whose symbols are {@link Token} instances.
 */
export declare interface TokenStream extends IntStream {
    /**
     * Get the {@link Token} instance associated with the value returned by
     * {@link #LA LA(k)}. This method has the same pre- and post-conditions as
     * {@link IntStream#LA}. In addition, when the preconditions of this method
     * are met, the return value is non-null and the value of
     * {@code LT(k).getType()==LA(k)}.
     *
     * @see IntStream#LA
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    LT(k: number): Token;

    /**
     * Gets the {@link Token} at the specified {@code index} in the stream. When
     * the preconditions of this method are met, the return value is non-null.
     *
     * <p>The preconditions for this method are the same as the preconditions of
     * {@link IntStream#seek}. If the behavior of {@code seek(index)} is
     * unspecified for the current state and given {@code index}, then the
     * behavior of this method is also unspecified.</p>
     *
     * <p>The symbol referred to by {@code index} differs from {@code seek()} only
     * in the case of filtering streams where {@code index} lies before the end
     * of the stream. Unlike {@code seek()}, this method does not adjust
     * {@code index} to point to a non-ignored symbol.</p>
     *
     * @throws IllegalArgumentException if {code index} is less than 0
     * @throws UnsupportedOperationException if the stream does not support
     * retrieving the token at the specified index
     */
    get(index: number): Token;

    /**
     * Gets the underlying {@link TokenSource} which provides tokens for this
     * stream.
     */
    getTokenSource(): TokenSource;

    /**
     * Return the text of all tokens within the specified {@code interval}. This
     * method behaves like the following code (including potential exceptions
     * for violating preconditions of {@link #get}, but may be optimized by the
     * specific implementation.
     *
     * <pre>
     * TokenStream stream = ...;
     * String text = "";
     * for (int i = interval.a; i &lt;= interval.b; i++) {
     *   text += stream.get(i).getText();
     * }
     * </pre>
     *
     * @param interval The interval of tokens within this stream to get text
     * for.
     * @returns The text of all tokens within the specified interval in this
     * stream.
     *
     * @throws NullPointerException if {@code interval} is {@code null}
     */
    getText(interval: Interval): string;

    /**
     * Return the text of all tokens in the stream. This method behaves like the
     * following code, including potential exceptions from the calls to
     * {@link IntStream#size} and {@link #getText(Interval)}, but may be
     * optimized by the specific implementation.
     *
     * <pre>
     * TokenStream stream = ...;
     * String text = stream.getText(new Interval(0, stream.size()));
     * </pre>
     *
     * @returns The text of all tokens in the stream.
     */
    getText(): string;
}
