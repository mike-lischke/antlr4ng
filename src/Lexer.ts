/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param, @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */

import { Token } from "./Token.js";
import { Recognizer } from "./Recognizer.js";
import { CommonTokenFactory } from "./CommonTokenFactory.js";
import { RecognitionException } from "./RecognitionException.js";
import { LexerNoViableAltException } from "./LexerNoViableAltException.js";
import { LexerATNSimulator } from "./atn/LexerATNSimulator.js";
import { CharStream } from "./CharStream.js";
import { TokenFactory } from "./TokenFactory.js";
import { TokenSource } from "./TokenSource.js";

/**
 * A lexer is recognizer that draws input symbols from a character stream.
 * lexer grammars result in a subclass of this object. A Lexer object
 * uses simplified match() and error recovery mechanisms in the interest of speed.
 */
export abstract class Lexer extends Recognizer<LexerATNSimulator> implements TokenSource {
    public static DEFAULT_MODE = 0;
    public static MORE = -2;
    public static SKIP = -3;

    public static DEFAULT_TOKEN_CHANNEL = Token.DEFAULT_CHANNEL;
    public static HIDDEN = Token.HIDDEN_CHANNEL;
    public static MIN_CHAR_VALUE = 0x0000;
    public static MAX_CHAR_VALUE = 0x10FFFF;

    public _input: CharStream;

    /**
     * The goal of all lexer rules/methods is to create a token object.
     *  This is an instance variable as multiple rules may collaborate to
     *  create a single token.  nextToken will return this object after
     *  matching lexer rule(s).  If you subclass to allow multiple token
     *  emissions, then set this to the last token to be matched or
     *  something nonnull so that the auto token emit mechanism will not
     *  emit another token.
     */
    public _token: Token | null = null;

    /**
     * What character index in the stream did the current token start at?
     *  Needed, for example, to get the text for current token.  Set at
     *  the start of nextToken.
     */
    public _tokenStartCharIndex = -1;

    /** The line on which the first character of the token resides */
    public _tokenStartLine = 0;

    /** The character position of first character within the line */
    public _tokenStartColumn = 0;

    /**
     * Once we see EOF on char stream, next token will be EOF.
     *  If you have DONE : EOF ; then you see DONE EOF.
     */
    public _hitEOF = false;

    /** The channel number for the current token */
    public _channel = 0;

    /** The token type for the current token */
    public _type = 0;

    public _modeStack: number[] = [];
    public _mode: number = Lexer.DEFAULT_MODE;

    /**
     * You can set the text for the current token to override what is in
     *  the input char buffer.  Use setText() or can set this instance var.
     */
    public _text: string | null = null;

    protected _factory: TokenFactory<Token>;

    public constructor(input: CharStream) {
        super();
        this._input = input;
        this._factory = CommonTokenFactory.DEFAULT;
    }

    public reset(seekBack = true): void {
        // wack Lexer state variables
        if (seekBack) {
            this._input.seek(0); // rewind the input
        }
        this._token = null;
        this._type = Token.INVALID_TYPE;
        this._channel = Token.DEFAULT_CHANNEL;
        this._tokenStartCharIndex = -1;
        this._tokenStartColumn = -1;
        this._tokenStartLine = -1;
        this._text = null;

        this._hitEOF = false;
        this._mode = Lexer.DEFAULT_MODE;
        this._modeStack = [];

        this.interpreter.reset();
    }

    // Return a token from this source; i.e., match a token on the char stream.
    public nextToken(): Token {
        if (this._input === null) {
            throw new Error("nextToken requires a non-null input stream.");
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

                    return this._token!;
                }
                this._token = null;
                this._channel = Token.DEFAULT_CHANNEL;
                this._tokenStartCharIndex = this._input.index;
                this._tokenStartColumn = this.interpreter.column;
                this._tokenStartLine = this.interpreter.line;
                this._text = null;
                let continueOuter = false;
                for (; ;) {
                    this._type = Token.INVALID_TYPE;
                    let ttype = Lexer.SKIP;
                    try {
                        ttype = this.interpreter.match(this._input, this._mode);
                    } catch (e) {
                        if (e instanceof LexerNoViableAltException) {
                            this.notifyListeners(e); // report error
                            this.recover(e);
                        } else {
                            throw e;
                        }
                    }
                    if (this._input.LA(1) === Token.EOF) {
                        this._hitEOF = true;
                    }
                    if (this._type === Token.INVALID_TYPE) {
                        this._type = ttype;
                    }
                    if (this._type === Lexer.SKIP) {
                        continueOuter = true;
                        break;
                    }
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

                return this._token!;
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
    public skip(): void {
        this._type = Lexer.SKIP;
    }

    public more(): void {
        this._type = Lexer.MORE;
    }

    public mode(m: number): void {
        this._mode = m;
    }

    public pushMode(m: number): void {
        if (LexerATNSimulator.debug) {
            console.log("pushMode " + m);
        }
        this._modeStack.push(this._mode);
        this.mode(m);
    }

    public popMode(): number {
        if (this._modeStack.length === 0) {
            throw new Error("Empty Stack");
        }
        if (LexerATNSimulator.debug) {
            console.log("popMode back to " + this._modeStack.slice(0, -1));
        }
        this.mode(this._modeStack.pop()!);

        return this._mode;
    }

    /**
     * By default does not support multiple emits per nextToken invocation
     * for efficiency reasons. Subclass and override this method, nextToken,
     * and getToken (to push tokens into a list and pull from that list
     * rather than a single variable as this implementation does).
     */
    public emitToken(token: Token): void {
        this._token = token;
    }

    /**
     * The standard method called to automatically emit a token at the
     * outermost lexical rule. The token object should point into the
     * char buffer start..stop. If there is a text override in 'text',
     * use that to set the token's text. Override this method to emit
     * custom Token objects or provide a new factory.
     */
    public emit(): Token {
        const t = this._factory.create([this, this._input], this._type,
            this._text, this._channel, this._tokenStartCharIndex, this
                .getCharIndex() - 1, this._tokenStartLine,
            this._tokenStartColumn);
        this.emitToken(t);

        return t;
    }

    public emitEOF(): Token {
        const cpos = this.column;
        const lpos = this.line;
        const eof = this._factory.create([this, this._input], Token.EOF,
            null, Token.DEFAULT_CHANNEL, this._input.index,
            this._input.index - 1, lpos, cpos);
        this.emitToken(eof);

        return eof;
    }

    // What is the index of the current character of lookahead?///
    public getCharIndex(): number {
        return this._input.index;
    }

    /**
     * Return a list of all Token objects in input char stream.
     * Forces load of all tokens. Does not include EOF token.
     */
    public getAllTokens(): Token[] {
        const tokens = [];
        let t = this.nextToken()!;
        while (t.type !== Token.EOF) {
            tokens.push(t);
            t = this.nextToken()!;
        }

        return tokens;
    }

    public notifyListeners(e: LexerNoViableAltException): void {
        const start = this._tokenStartCharIndex;
        const stop = this._input.index;
        const text = this._input.getText(start, stop);
        const msg = "token recognition error at: '" + this.getErrorDisplay(text) + "'";
        const listener = this.getErrorListenerDispatch();
        listener.syntaxError(this, null, this._tokenStartLine,
            this._tokenStartColumn, msg, e);
    }

    public getErrorDisplay(s: string): string {
        return s;
    }

    public getErrorDisplayForChar(c: string): string {
        if (c.charCodeAt(0) === Token.EOF) {
            return "<EOF>";
        } else if (c === "\n") {
            return "\\n";
        } else if (c === "\t") {
            return "\\t";
        } else if (c === "\r") {
            return "\\r";
        } else {
            return c;
        }
    }

    public getCharErrorDisplay(c: string): string {
        return "'" + this.getErrorDisplayForChar(c) + "'";
    }

    /**
     * Lexers can normally match any char in it's vocabulary after matching
     * a token, so do the easy thing and just kill a character and hope
     * it all works out. You can instead use the rule invocation stack
     * to do sophisticated error recovery if you are in a fragment rule.
     */
    public recover(re: LexerNoViableAltException | RecognitionException): void {
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

    public get inputStream(): CharStream {
        return this._input;
    }

    public set inputStream(input: CharStream) {
        this.reset(false);
        this._input = input;
    }

    public set tokenFactory(factory: TokenFactory<Token>) {
        this._factory = factory;
    };

    public get tokenFactory(): TokenFactory<Token> {
        return this._factory;
    };

    public get sourceName(): string {
        return this._input.getSourceName();
    }

    public get type(): number {
        return this._type;
    }

    public set type(type: number) {
        this._type = type;
    }

    public get line(): number {
        return this.interpreter.line;
    }

    public set line(line: number) {
        this.interpreter.line = line;
    }

    public get column(): number {
        return this.interpreter.column;
    }

    public set column(column: number) {
        this.interpreter.column = column;
    }

    public get text(): string {
        if (this._text !== null) {
            return this._text;
        } else {
            return this.interpreter.getText(this._input);
        }
    }

    public set text(text: string | null) {
        this._text = text;
    }
}
