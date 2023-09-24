/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from './Token.js';
import { Recognizer } from './Recognizer.js';
import { CommonTokenFactory } from './CommonTokenFactory.js';
import { RecognitionException } from './RecognitionException.js';
import { LexerNoViableAltException } from './LexerNoViableAltException.js';

/**
 * A lexer is recognizer that draws input symbols from a character stream.
 * lexer grammars result in a subclass of this object. A Lexer object
 * uses simplified match() and error recovery mechanisms in the interest of speed.
 */
export class Lexer extends Recognizer {
    _channel: any;
    _factory: any;
    _hitEOF: any;
    _input: any;
    _mode: any;
    _modeStack: any;
    _text: any;
    _token: any;
    _tokenFactorySourcePair: any;
    _tokenStartCharIndex: any;
    _tokenStartColumn: any;
    _tokenStartLine: any;
    _type: any;
    interpreter: any;
    constructor(input: any) {
        super();
        this._input = input;
        // @ts-expect-error TS(2339): Property 'DEFAULT' does not exist on type 'typeof ... Remove this comment to see the full error message
        this._factory = CommonTokenFactory.DEFAULT;
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
        this._token = null;

        /**
         * What character index in the stream did the current token start at?
         * Needed, for example, to get the text for current token. Set at
         * the start of nextToken.
         */
        this._tokenStartCharIndex = -1;

        // The line on which the first character of the token resides///
        this._tokenStartLine = -1;

        // The character position of first character within the line///
        this._tokenStartColumn = -1;

        // Once we see EOF on char stream, next token will be EOF.
        // If you have DONE : EOF ; then you see DONE EOF.
        this._hitEOF = false;

        // The channel number for the current token///
        // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
        this._channel = Token.DEFAULT_CHANNEL;

        // The token type for the current token///
        // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
        this._type = Token.INVALID_TYPE;

        this._modeStack = [];
        // @ts-expect-error TS(2339): Property 'DEFAULT_MODE' does not exist on type 'ty... Remove this comment to see the full error message
        this._mode = Lexer.DEFAULT_MODE;

        /**
         * You can set the text for the current token to override what is in
         * the input char buffer. Use setText() or can set this instance var.
         */
        this._text = null;
    }

    reset() {
        // wack Lexer state variables
        if (this._input !== null) {
            this._input.seek(0); // rewind the input
        }
        this._token = null;
        // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
        this._type = Token.INVALID_TYPE;
        // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
        this._channel = Token.DEFAULT_CHANNEL;
        this._tokenStartCharIndex = -1;
        this._tokenStartColumn = -1;
        this._tokenStartLine = -1;
        this._text = null;

        this._hitEOF = false;
        // @ts-expect-error TS(2339): Property 'DEFAULT_MODE' does not exist on type 'ty... Remove this comment to see the full error message
        this._mode = Lexer.DEFAULT_MODE;
        this._modeStack = [];

        this.interpreter.reset();
    }

    // Return a token from this source; i.e., match a token on the char stream.
    nextToken() {
        if (this._input === null) {
            throw "nextToken requires a non-null input stream.";
        }

        /**
         * Mark start location in char stream so unbuffered streams are
         * guaranteed at least have text of current token
         */
        const tokenStartMarker = this._input.mark();
        try {
            for (; ;) {
                if (this._hitEOF) {
                    this.emitEOF();
                    return this._token;
                }
                this._token = null;
                // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
                this._channel = Token.DEFAULT_CHANNEL;
                this._tokenStartCharIndex = this._input.index;
                this._tokenStartColumn = this.interpreter.column;
                this._tokenStartLine = this.interpreter.line;
                this._text = null;
                let continueOuter = false;
                for (; ;) {
                    // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
                    this._type = Token.INVALID_TYPE;
                    // @ts-expect-error TS(2339): Property 'SKIP' does not exist on type 'typeof Lex... Remove this comment to see the full error message
                    let ttype = Lexer.SKIP;
                    try {
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
                    if (this._input.LA(1) === Token.EOF) {
                        this._hitEOF = true;
                    }
                    // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
                    if (this._type === Token.INVALID_TYPE) {
                        this._type = ttype;
                    }
                    // @ts-expect-error TS(2339): Property 'SKIP' does not exist on type 'typeof Lex... Remove this comment to see the full error message
                    if (this._type === Lexer.SKIP) {
                        continueOuter = true;
                        break;
                    }
                    // @ts-expect-error TS(2339): Property 'MORE' does not exist on type 'typeof Lex... Remove this comment to see the full error message
                    if (this._type !== Lexer.MORE) {
                        break;
                    }
                }
                if (continueOuter) {
                    continue;
                }
                if (this._token === null) {
                    this.emit();
                }
                return this._token;
            }
        } finally {
            // make sure we release marker after match or
            // unbuffered char stream will keep buffering
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
    skip() {
        // @ts-expect-error TS(2339): Property 'SKIP' does not exist on type 'typeof Lex... Remove this comment to see the full error message
        this._type = Lexer.SKIP;
    }

    more() {
        // @ts-expect-error TS(2339): Property 'MORE' does not exist on type 'typeof Lex... Remove this comment to see the full error message
        this._type = Lexer.MORE;
    }

    mode(m: any) {
        this._mode = m;
    }

    pushMode(m: any) {
        if (this.interpreter.debug) {
            console.log("pushMode " + m);
        }
        this._modeStack.push(this._mode);
        this.mode(m);
    }

    popMode() {
        if (this._modeStack.length === 0) {
            throw "Empty Stack";
        }
        if (this.interpreter.debug) {
            console.log("popMode back to " + this._modeStack.slice(0, -1));
        }
        this.mode(this._modeStack.pop());
        return this._mode;
    }

    /**
     * By default does not support multiple emits per nextToken invocation
     * for efficiency reasons. Subclass and override this method, nextToken,
     * and getToken (to push tokens into a list and pull from that list
     * rather than a single variable as this implementation does).
     */
    emitToken(token: any) {
        this._token = token;
    }

    /**
     * The standard method called to automatically emit a token at the
     * outermost lexical rule. The token object should point into the
     * char buffer start..stop. If there is a text override in 'text',
     * use that to set the token's text. Override this method to emit
     * custom Token objects or provide a new factory.
     */
    emit() {
        const t = this._factory.create(this._tokenFactorySourcePair, this._type,
            this._text, this._channel, this._tokenStartCharIndex, this
                .getCharIndex() - 1, this._tokenStartLine,
            this._tokenStartColumn);
        this.emitToken(t);
        return t;
    }

    emitEOF() {
        const cpos = this.column;
        const lpos = this.line;
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        const eof = this._factory.create(this._tokenFactorySourcePair, Token.EOF,
            // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
            null, Token.DEFAULT_CHANNEL, this._input.index,
            this._input.index - 1, lpos, cpos);
        this.emitToken(eof);
        return eof;
    }

    // What is the index of the current character of lookahead?///
    getCharIndex() {
        return this._input.index;
    }

    /**
     * Return a list of all Token objects in input char stream.
     * Forces load of all tokens. Does not include EOF token.
     */
    getAllTokens() {
        const tokens = [];
        let t = this.nextToken();
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        while (t.type !== Token.EOF) {
            tokens.push(t);
            t = this.nextToken();
        }
        return tokens;
    }

    notifyListeners(e: any) {
        const start = this._tokenStartCharIndex;
        const stop = this._input.index;
        const text = this._input.getText(start, stop);
        const msg = "token recognition error at: '" + this.getErrorDisplay(text) + "'";
        const listener = this.getErrorListenerDispatch();
        listener.syntaxError(this, null, this._tokenStartLine,
            this._tokenStartColumn, msg, e);
    }

    getErrorDisplay(s: any) {
        const d = [];
        for (let i = 0; i < s.length; i++) {
            d.push(s[i]);
        }
        return d.join('');
    }

    getErrorDisplayForChar(c: any) {
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (c.charCodeAt(0) === Token.EOF) {
            return "<EOF>";
        } else if (c === '\n') {
            return "\\n";
        } else if (c === '\t') {
            return "\\t";
        } else if (c === '\r') {
            return "\\r";
        } else {
            return c;
        }
    }

    getCharErrorDisplay(c: any) {
        return "'" + this.getErrorDisplayForChar(c) + "'";
    }

    /**
     * Lexers can normally match any char in it's vocabulary after matching
     * a token, so do the easy thing and just kill a character and hope
     * it all works out. You can instead use the rule invocation stack
     * to do sophisticated error recovery if you are in a fragment rule.
     */
    recover(re: any) {
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (this._input.LA(1) !== Token.EOF) {
            if (re instanceof LexerNoViableAltException) {
                // skip a char and try again
                this.interpreter.consume(this._input);
            } else {
                // TODO: Do we lose character or line position information?
                this._input.consume();
            }
        }
    }

    get inputStream() {
        return this._input;
    }

    set inputStream(input) {
        this._input = null;
        this._tokenFactorySourcePair = [this, null];
        this.reset();
        this._input = input;
        this._tokenFactorySourcePair = [this, input];
    }

    get sourceName() {
        return this._input.sourceName;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;
    }

    get line() {
        return this.interpreter.line;
    }

    set line(line) {
        this.interpreter.line = line;
    }

    get column() {
        return this.interpreter.column;
    }

    set column(column) {
        this.interpreter.column = column;
    }

    get text() {
        if (this._text !== null) {
            return this._text;
        } else {
            return this.interpreter.getText(this._input);
        }
    }

    set text(text) {
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
