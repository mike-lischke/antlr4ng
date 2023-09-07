/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import CharStream from "./CharStream.js";
import TokenSource from "./TokenSource.js";

export declare class Token {
    /* eslint-disable @typescript-eslint/naming-convention */

    public static INVALID_TYPE: number;

    /**
     * During lookahead operations, this "token" signifies we hit rule end ATN state
     * and did not follow it despite needing to.
     */
    public static EPSILON: number;

    public static MIN_USER_TOKEN_TYPE: number;

    /**
     * All tokens go to the parser (unless skip() is called in that rule)
     * on a particular "channel". The parser tunes to a particular channel
     * so that whitespace etc... can go to the parser on a "hidden" channel.
     */
    public static DEFAULT_CHANNEL: number;

    /**
     * Anything on different channel than DEFAULT_CHANNEL is not parsed
     * by parser.
     */
    public static HIDDEN_CHANNEL: number;

    public static EOF: number;

    /* eslint-enable @typescript-eslint/naming-convention */

    public tokenIndex: number;
    public line: number;
    public column: number;
    public channel: number;
    public text: string;
    public type: number;
    public start: number;
    public stop: number;

    public readonly tokenSource: TokenSource | undefined;

    public clone(): Token;
    public cloneWithType(type: number): Token;
    public getInputStream(): CharStream;
}

export default Token;
