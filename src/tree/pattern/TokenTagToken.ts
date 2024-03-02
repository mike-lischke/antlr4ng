/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CommonToken } from "../../CommonToken.js";

/**
 * A {@link Token} object representing a token of a particular type; e.g.,
 * `<ID>`. These tokens are created for {@link TagChunk} chunks where the
 * tag corresponds to a lexer rule or token type.
 */
export class TokenTagToken extends CommonToken {
    public readonly tokenName: string;

    /**
     * The name of the label associated with the rule tag, or undefined if this is an unlabeled rule tag.
     */
    public readonly label?: string;

    /**
     * Constructs a new instance of {@link TokenTagToken} for an unlabeled tag
     * with the specified token name and type.
     *
     * @param tokenName The token name.
     * @param type The token type.
     */
    public constructor(tokenName: string, type: number);
    /**
     * Constructs a new instance of {@link TokenTagToken} with the specified
     * token name, type, and label.
     *
     * @param tokenName The token name.
     * @param type The token type.
     * @param label The label associated with the token tag, or `undefined` if
     * the token tag is unlabeled.
     */
    public constructor(tokenName: string, type: number, label: string | undefined);
    public constructor(tokenName: string, type: number, label?: string | undefined) {
        super({ type, source: CommonToken.EMPTY_SOURCE });
        this.tokenName = tokenName;
        this.label = label;
    }

    /**
     *
     * @returns the token tag formatted with `<` and `>` delimiters.
     */
    public override get text(): string {
        if (this.label !== null) {
            return "<" + this.label + ":" + this.tokenName + ">";
        }

        return "<" + this.tokenName + ">";
    }

    /**
     * @returns a string of the form `tokenName:type`.
     */
    public override toString(): string {
        return this.tokenName + ":" + this.type;
    }
}
