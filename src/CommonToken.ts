/* eslint-disable jsdoc/require-returns, jsdoc/no-undefined-types, jsdoc/check-param-names, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from "./Token.js";

export class CommonToken extends Token {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _channel: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _text: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    channel: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    column: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    line: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    source: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    start: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    stop: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokenIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    type: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(source: any, type: any, channel: any, start: any, stop: any) {
        super();
        // @ts-expect-error TS(2339): Property 'EMPTY_SOURCE' does not exist on type 'ty... Remove this comment to see the full error message
        this.source = source !== undefined ? source : CommonToken.EMPTY_SOURCE;
        this.type = type !== undefined ? type : null;
        // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
        this.channel = channel !== undefined ? channel : Token.DEFAULT_CHANNEL;
        this.start = start !== undefined ? start : -1;
        this.stop = stop !== undefined ? stop : -1;
        this.tokenIndex = -1;
        if (this.source[0] !== null) {
            this.line = source[0].line;
            this.column = source[0].column;
        } else {
            this.column = -1;
        }
    }

    /**
     * Constructs a new {@link CommonToken} as a copy of another {@link Token}.
     *
     * <p>
     * If {@code oldToken} is also a {@link CommonToken} instance, the newly
     * constructed token will share a reference to the {@link //text} field and
     * the {@link Pair} stored in {@link //source}. Otherwise, {@link //text} will
     * be assigned the result of calling {@link //getText}, and {@link //source}
     * will be constructed from the result of {@link Token//getTokenSource} and
     * {@link Token//getInputStream}.</p>
     *
     * @param oldToken The token to copy.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    clone() {
        const t = new CommonToken(this.source, this.type, this.channel, this.start, this.stop);
        t.tokenIndex = this.tokenIndex;
        t.line = this.line;
        t.column = this.column;
        t.text = this.text;
        // eslint-disable-next-line padding-line-between-statements
        return t;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    cloneWithType(type: any) {
        const t = new CommonToken(this.source, type, this.channel, this.start, this.stop);
        t.tokenIndex = this.tokenIndex;
        t.line = this.line;
        t.column = this.column;
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (type === Token.EOF)
            // eslint-disable-next-line curly
            t.text = "";
        // eslint-disable-next-line padding-line-between-statements
        return t;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    toString(recognizer: any) {
        let channelStr = "";
        // eslint-disable-next-line no-underscore-dangle
        if (this._channel > 0) {
            channelStr = ",channel=" + this.channel;
        }

        let text = this.text;
        if (text) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            text = text.replace(/\n/g, "\\n");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            text = text.replace(/\r/g, "\\r");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            text = text.replace(/\t/g, "\\t");
        } else {
            text = "<no text>";
        }

        let typeString = String(this.type);
        if (recognizer) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            typeString = recognizer.vocabulary.getDisplayName(this.type);
        }

        return "[@" + this.tokenIndex + "," + this.start + ":" + this.stop + "='" + text + "',<" + typeString + ">" +
            channelStr + "," + this.line + ":" + this.column + "]";
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get text() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._text !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
            return this._text;
        }
        const input = this.getInputStream();
        if (input === null) {
            return null;
        }
        const n = input.size;
        if (this.start < n && this.stop < n) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return input.getText(this.start, this.stop);
        } else {
            return "<EOF>";
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set text(text) {
        // eslint-disable-next-line no-underscore-dangle
        this._text = text;
    }
}

/**
 * An empty {@link Pair} which is used as the default value of
 * {@link //source} for tokens that do not have a source.
 */
// @ts-expect-error TS(2339): Property 'EMPTY_SOURCE' does not exist on type 'ty... Remove this comment to see the full error message
CommonToken.EMPTY_SOURCE = [null, null];
