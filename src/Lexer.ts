/* eslint-disable jsdoc/require-param, jsdoc/require-returns, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from './Token.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { Recognizer } from './Recognizer.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { CommonTokenFactory } from './CommonTokenFactory.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { RecognitionException } from './RecognitionException.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { LexerNoViableAltException } from './LexerNoViableAltException.js';

/**
 * A lexer is recognizer that draws input symbols from a character stream.
 * lexer grammars result in a subclass of this object. A Lexer object
 * uses simplified match() and error recovery mechanisms in the interest of speed.
 */
export class Lexer extends Recognizer {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _channel: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _factory: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _hitEOF: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _input: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _mode: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _modeStack: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _text: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _token: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _tokenFactorySourcePair: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _tokenStartCharIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _tokenStartColumn: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _tokenStartLine: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _type: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    interpreter: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(input: any) {
        super();
        // eslint-disable-next-line no-underscore-dangle
        this._input = input;
        // @ts-expect-error TS(2339): Property 'DEFAULT' does not exist on type 'typeof ... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._factory = CommonTokenFactory.DEFAULT;
        // eslint-disable-next-line no-underscore-dangle
        this._tokenFactorySourcePair = [this, input];

        this.interpreter = null; // child classes must populate this

        /**
         * The goal of all lexer rules/methods is to create a token object.
         * this is an instance variable as multiple rules may collaborate to
         * create a single token. nextToken will return this object after
         * matching lexer rule(s). If you subclass to allow multiple token
         * emissions, then set this to the last token to be matched or
         * something non-null so that the auto token emit mechanism will not
         * emit another token.
         */
        // eslint-disable-next-line no-underscore-dangle
        this._token = null;

        /**
         * What character index in the stream did the current token start at?
         * Needed, for example, to get the text for current token. Set at
         * the start of nextToken.
         */
        // eslint-disable-next-line no-underscore-dangle
        this._tokenStartCharIndex = -1;

        // The line on which the first character of the token resides///
        // eslint-disable-next-line no-underscore-dangle
        this._tokenStartLine = -1;

        // The character position of first character within the line///
        // eslint-disable-next-line no-underscore-dangle
        this._tokenStartColumn = -1;

        // Once we see EOF on char stream, next token will be EOF.
        // If you have DONE : EOF ; then you see DONE EOF.
        // eslint-disable-next-line no-underscore-dangle
        this._hitEOF = false;

        // The channel number for the current token///
        // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._channel = Token.DEFAULT_CHANNEL;

        // The token type for the current token///
        // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._type = Token.INVALID_TYPE;

        // eslint-disable-next-line no-underscore-dangle
        this._modeStack = [];
        // @ts-expect-error TS(2339): Property 'DEFAULT_MODE' does not exist on type 'ty... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._mode = Lexer.DEFAULT_MODE;

        /**
         * You can set the text for the current token to override what is in
         * the input char buffer. Use setText() or can set this instance var.
         */
        // eslint-disable-next-line no-underscore-dangle
        this._text = null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    reset() {
        // wack Lexer state variables
        // eslint-disable-next-line no-underscore-dangle
        if (this._input !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
            this._input.seek(0); // rewind the input
        }
        // eslint-disable-next-line no-underscore-dangle
        this._token = null;
        // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._type = Token.INVALID_TYPE;
        // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._channel = Token.DEFAULT_CHANNEL;
        // eslint-disable-next-line no-underscore-dangle
        this._tokenStartCharIndex = -1;
        // eslint-disable-next-line no-underscore-dangle
        this._tokenStartColumn = -1;
        // eslint-disable-next-line no-underscore-dangle
        this._tokenStartLine = -1;
        // eslint-disable-next-line no-underscore-dangle
        this._text = null;

        // eslint-disable-next-line no-underscore-dangle
        this._hitEOF = false;
        // @ts-expect-error TS(2339): Property 'DEFAULT_MODE' does not exist on type 'ty... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._mode = Lexer.DEFAULT_MODE;
        // eslint-disable-next-line no-underscore-dangle
        this._modeStack = [];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.interpreter.reset();
    }

    // Return a token from this source; i.e., match a token on the char stream.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    nextToken() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._input === null) {
            // eslint-disable-next-line no-throw-literal
            throw "nextToken requires a non-null input stream.";
        }

        /**
         * Mark start location in char stream so unbuffered streams are
         * guaranteed at least have text of current token
         */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        const tokenStartMarker = this._input.mark();
        try {
            for (; ;) {
                // eslint-disable-next-line no-underscore-dangle
                if (this._hitEOF) {
                    this.emitEOF();
                    // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, no-underscore-dangle
                    return this._token;
                }
                // eslint-disable-next-line no-underscore-dangle
                this._token = null;
                // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
                // eslint-disable-next-line no-underscore-dangle
                this._channel = Token.DEFAULT_CHANNEL;
                // eslint-disable-next-line no-underscore-dangle
                this._tokenStartCharIndex = this._input.index;
                // eslint-disable-next-line no-underscore-dangle
                this._tokenStartColumn = this.interpreter.column;
                // eslint-disable-next-line no-underscore-dangle
                this._tokenStartLine = this.interpreter.line;
                // eslint-disable-next-line no-underscore-dangle
                this._text = null;
                let continueOuter = false;
                for (; ;) {
                    // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
                    // eslint-disable-next-line no-underscore-dangle
                    this._type = Token.INVALID_TYPE;
                    // @ts-expect-error TS(2339): Property 'SKIP' does not exist on type 'typeof Lex... Remove this comment to see the full error message
                    let ttype = Lexer.SKIP;
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                        ttype = this.interpreter.match(this._input, this._mode);
                    } catch (e) {
                        if (e instanceof RecognitionException) {
                            this.notifyListeners(e); // report error
                            this.recover(e);
                        } else {
                            // @ts-expect-error TS(2571): Object is of type 'unknown'.
                            console.log(e.stack);
                            throw e;
                        }
                    }
                    // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                    if (this._input.LA(1) === Token.EOF) {
                        // eslint-disable-next-line no-underscore-dangle
                        this._hitEOF = true;
                    }
                    // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
                    // eslint-disable-next-line no-underscore-dangle
                    if (this._type === Token.INVALID_TYPE) {
                        // eslint-disable-next-line no-underscore-dangle
                        this._type = ttype;
                    }
                    // @ts-expect-error TS(2339): Property 'SKIP' does not exist on type 'typeof Lex... Remove this comment to see the full error message
                    // eslint-disable-next-line no-underscore-dangle
                    if (this._type === Lexer.SKIP) {
                        continueOuter = true;
                        break;
                    }
                    // @ts-expect-error TS(2339): Property 'MORE' does not exist on type 'typeof Lex... Remove this comment to see the full error message
                    // eslint-disable-next-line no-underscore-dangle
                    if (this._type !== Lexer.MORE) {
                        break;
                    }
                }
                if (continueOuter) {
                    continue;
                }
                // eslint-disable-next-line no-underscore-dangle
                if (this._token === null) {
                    this.emit();
                }
                // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, no-underscore-dangle
                return this._token;
            }
        } finally {
            // make sure we release marker after match or
            // unbuffered char stream will keep buffering
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
            this._input.release(tokenStartMarker);
        }
    }

    /**
     * Instruct the lexer to skip creating a token for current lexer rule
     * and look for another token. nextToken() knows to keep looking when
     * a lexer rule finishes with token set to SKIP_TOKEN. Recall that
     * if token==null at end of any token rule, it creates one for you
     * and emits it.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    skip() {
        // @ts-expect-error TS(2339): Property 'SKIP' does not exist on type 'typeof Lex... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._type = Lexer.SKIP;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    more() {
        // @ts-expect-error TS(2339): Property 'MORE' does not exist on type 'typeof Lex... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._type = Lexer.MORE;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    mode(m: any) {
        // eslint-disable-next-line no-underscore-dangle
        this._mode = m;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    pushMode(m: any) {
        if (this.interpreter.debug) {
            console.log("pushMode " + m);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        this._modeStack.push(this._mode);
        this.mode(m);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    popMode() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._modeStack.length === 0) {
            // eslint-disable-next-line no-throw-literal
            throw "Empty Stack";
        }
        if (this.interpreter.debug) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
            console.log("popMode back to " + this._modeStack.slice(0, -1));
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        this.mode(this._modeStack.pop());
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._mode;
    }

    /**
     * By default does not support multiple emits per nextToken invocation
     * for efficiency reasons. Subclass and override this method, nextToken,
     * and getToken (to push tokens into a list and pull from that list
     * rather than a single variable as this implementation does).
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    emitToken(token: any) {
        // eslint-disable-next-line no-underscore-dangle
        this._token = token;
    }

    /**
     * The standard method called to automatically emit a token at the
     * outermost lexical rule. The token object should point into the
     * char buffer start..stop. If there is a text override in 'text',
     * use that to set the token's text. Override this method to emit
     * custom Token objects or provide a new factory.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    emit() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        const t = this._factory.create(this._tokenFactorySourcePair, this._type,
            // eslint-disable-next-line no-underscore-dangle
            this._text, this._channel, this._tokenStartCharIndex, this
                // eslint-disable-next-line no-underscore-dangle
                .getCharIndex() - 1, this._tokenStartLine,
            // eslint-disable-next-line no-underscore-dangle
            this._tokenStartColumn);
        this.emitToken(t);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return t;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    emitEOF() {
        const cpos = this.column;
        const lpos = this.line;
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        const eof = this._factory.create(this._tokenFactorySourcePair, Token.EOF,
            // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
            // eslint-disable-next-line no-underscore-dangle
            null, Token.DEFAULT_CHANNEL, this._input.index,
            // eslint-disable-next-line no-underscore-dangle
            this._input.index - 1, lpos, cpos);
        this.emitToken(eof);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return eof;
    }

    // What is the index of the current character of lookahead?///
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getCharIndex() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._input.index;
    }

    /**
     * Return a list of all Token objects in input char stream.
     * Forces load of all tokens. Does not include EOF token.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getAllTokens() {
        const tokens = [];
        let t = this.nextToken();
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        while (t.type !== Token.EOF) {
            tokens.push(t);
            t = this.nextToken();
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return tokens;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    notifyListeners(e: any) {
        // eslint-disable-next-line no-underscore-dangle
        const start = this._tokenStartCharIndex;
        // eslint-disable-next-line no-underscore-dangle
        const stop = this._input.index;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        const text = this._input.getText(start, stop);
        const msg = "token recognition error at: '" + this.getErrorDisplay(text) + "'";
        const listener = this.getErrorListenerDispatch();
        // eslint-disable-next-line no-underscore-dangle
        listener.syntaxError(this, null, this._tokenStartLine,
            // eslint-disable-next-line no-underscore-dangle
            this._tokenStartColumn, msg, e);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getErrorDisplay(s: any) {
        const d = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < s.length; i++) {
            d.push(s[i]);
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/quotes
        return d.join('');
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getErrorDisplayForChar(c: any) {
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (c.charCodeAt(0) === Token.EOF) {
            return "<EOF>";
        // eslint-disable-next-line @typescript-eslint/quotes
        } else if (c === '\n') {
            return "\\n";
        // eslint-disable-next-line @typescript-eslint/quotes
        } else if (c === '\t') {
            return "\\t";
        // eslint-disable-next-line @typescript-eslint/quotes
        } else if (c === '\r') {
            return "\\r";
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return c;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getCharErrorDisplay(c: any) {
        return "'" + this.getErrorDisplayForChar(c) + "'";
    }

    /**
     * Lexers can normally match any char in it's vocabulary after matching
     * a token, so do the easy thing and just kill a character and hope
     * it all works out. You can instead use the rule invocation stack
     * to do sophisticated error recovery if you are in a fragment rule.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    recover(re: any) {
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        if (this._input.LA(1) !== Token.EOF) {
            if (re instanceof LexerNoViableAltException) {
                // skip a char and try again
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this.interpreter.consume(this._input);
            } else {
                // TODO: Do we lose character or line position information?
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this._input.consume();
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get inputStream() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._input;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set inputStream(input) {
        // eslint-disable-next-line no-underscore-dangle
        this._input = null;
        // eslint-disable-next-line no-underscore-dangle
        this._tokenFactorySourcePair = [this, null];
        this.reset();
        // eslint-disable-next-line no-underscore-dangle
        this._input = input;
        // eslint-disable-next-line no-underscore-dangle
        this._tokenFactorySourcePair = [this, input];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get sourceName() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._input.sourceName;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get type() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._type;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set type(type) {
        // eslint-disable-next-line no-underscore-dangle
        this._type = type;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get line() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.interpreter.line;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set line(line) {
        this.interpreter.line = line;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get column() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.interpreter.column;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set column(column) {
        this.interpreter.column = column;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get text() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._text !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
            return this._text;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, no-underscore-dangle
            return this.interpreter.getText(this._input);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set text(text) {
        // eslint-disable-next-line no-underscore-dangle
        this._text = text;
    }
}

// @ts-expect-error TS(2339): Property 'DEFAULT_MODE' does not exist on type 'ty... Remove this comment to see the full error message
Lexer.DEFAULT_MODE = 0;
// @ts-expect-error TS(2339): Property 'MORE' does not exist on type 'typeof Lex... Remove this comment to see the full error message
Lexer.MORE = -2;
// @ts-expect-error TS(2339): Property 'SKIP' does not exist on type 'typeof Lex... Remove this comment to see the full error message
Lexer.SKIP = -3;

// @ts-expect-error TS(2339): Property 'DEFAULT_TOKEN_CHANNEL' does not exist on... Remove this comment to see the full error message
Lexer.DEFAULT_TOKEN_CHANNEL = Token.DEFAULT_CHANNEL;
// @ts-expect-error TS(2339): Property 'HIDDEN' does not exist on type 'typeof L... Remove this comment to see the full error message
Lexer.HIDDEN = Token.HIDDEN_CHANNEL;
// @ts-expect-error TS(2339): Property 'MIN_CHAR_VALUE' does not exist on type '... Remove this comment to see the full error message
Lexer.MIN_CHAR_VALUE = 0x0000;
// @ts-expect-error TS(2339): Property 'MAX_CHAR_VALUE' does not exist on type '... Remove this comment to see the full error message
Lexer.MAX_CHAR_VALUE = 0x10FFFF;
