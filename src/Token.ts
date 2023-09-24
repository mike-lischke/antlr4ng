/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/**
 * A token has properties: text, type, line, character position in the line
 * (so we can ignore tabs), token channel, index, and source from which
 * we obtained this token.
 */
export class Token {
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

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        this.source = null;
        this.type = null; // token type of the token
        this.channel = null; // The parser ignores everything not on DEFAULT_CHANNEL
        this.start = null; // optional; return -1 if not implemented.
        this.stop = null; // optional; return -1 if not implemented.
        this.tokenIndex = null; // from 0..n-1 of the token object in the input stream
        this.line = null; // line=1..n of the 1st character
        this.column = null; // beginning of the line at which it occurs, 0..n-1
        // eslint-disable-next-line no-underscore-dangle
        this._text = null; // text of the token.
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getTokenSource() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.source[0];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getInputStream() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.source[1];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get text() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._text;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set text(text) {
        // eslint-disable-next-line no-underscore-dangle
        this._text = text;
    }
}

// @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
Token.INVALID_TYPE = 0;

/**
 * During lookahead operations, this "token" signifies we hit rule end ATN state
 * and did not follow it despite needing to.
 */
// @ts-expect-error TS(2339): Property 'EPSILON' does not exist on type 'typeof ... Remove this comment to see the full error message
Token.EPSILON = -2;

// @ts-expect-error TS(2339): Property 'MIN_USER_TOKEN_TYPE' does not exist on t... Remove this comment to see the full error message
Token.MIN_USER_TOKEN_TYPE = 1;

// @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
Token.EOF = -1;

/**
 * All tokens go to the parser (unless skip() is called in that rule)
 * on a particular "channel". The parser tunes to a particular channel
 * so that whitespace etc... can go to the parser on a "hidden" channel.
 */
// @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
Token.DEFAULT_CHANNEL = 0;

/**
 * Anything on different channel than DEFAULT_CHANNEL is not parsed
 * by parser.
 */
// @ts-expect-error TS(2339): Property 'HIDDEN_CHANNEL' does not exist on type '... Remove this comment to see the full error message
Token.HIDDEN_CHANNEL = 1;
