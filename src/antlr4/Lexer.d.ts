/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Recognizer } from "./Recognizer.js";
import { LexerATNSimulator } from "./atn/LexerATNSimulator.js";
import { CharStream } from "./CharStream.js";
import { Token } from "./Token.js";
import { TokenSource } from "./TokenSource.js";
import { TokenFactory } from "./TokenFactory.js";
import { InputStream } from "./InputStream.js";

export declare abstract class Lexer extends Recognizer<LexerATNSimulator> implements TokenSource {
    /* eslint-disable @typescript-eslint/naming-convention */
    public static DEFAULT_MODE: number;
    public static MORE: number;
    public static SKIP: number;

    public static DEFAULT_TOKEN_CHANNEL: number;
    public static MIN_CHAR_VALUE: number;
    public static MAX_CHAR_VALUE: number;

    public static HIDDEN: number;

    public _factory: TokenFactory<Token>;
    public _tokenFactorySourcePair: [TokenSource | null, InputStream | null];
    /* eslint-enable @typescript-eslint/naming-convention */

    public text: string;
    public line: number;
    public column: number;

    public _channel: number;
    public _token: Token | null;
    public _tokenStartCharIndex: number;
    public _tokenStartCharPositionInLine: number;
    public _tokenStartLine: number;
    public _tokenStartColumn: number;
    public _type: number;

    public get inputStream(): CharStream;
    public set inputStream(value: CharStream);

    protected _modeStack: number[];

    public constructor(input: CharStream);

    public getErrorDisplay(s: string | number): string;

    public reset(): void;
    public nextToken(): Token;
    public skip(): void;
    public more(): void;
    public more(m: number): void;
    public pushMode(m: number): void;
    public popMode(): number;
    public emitToken(token: Token): void;
    public emit(): Token;
    public emitEOF(): Token;
    public getAllTokens(): Token[];
}
