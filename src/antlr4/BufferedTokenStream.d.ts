/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TokenStream } from "./TokenStream.js";
import { TokenSource } from "./TokenSource.js";
import { Token } from "./Token.js";

export declare class BufferedTokenStream extends TokenStream {
    public readonly tokens: Token[];
    public readonly fetchedEOF: boolean;

    public mark(): number;
    public release(marker: number): void;
    public reset(): void;
    public seek(index: number): void;
    public consume(): void;
    public fetch(n: number): void;
    public sync(i: number): number;

    public getTokens(start?: number, stop?: number, types?: Set<number>): Token[];
    public setTokenSource(tokenSource: TokenSource): void;
    public nextTokenOnChannel(i: number, channel: number): number;
    public previousTokenOnChannel(i: number, channel: number): number;
    public filterForChannel(left: number, right: number, channel: number): number;
    public getSourceName(): string;

    public fill(): void;
}
