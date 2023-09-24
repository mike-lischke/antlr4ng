/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable max-classes-per-file */

import { CommonTokenStream } from "./CommonTokenStream.js";
import { Token } from "./Token.js";
import { Interval } from "./misc/Interval.js";

type Rewrites = Array<RewriteOperation | undefined>;
type Text = unknown;

export declare class TokenStreamRewriter {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static DEFAULT_PROGRAM_NAME: string;

    public constructor(tokens: CommonTokenStream);
    public getTokenStream(): CommonTokenStream;
    public insertAfter(token: Token, text: Text, programName?: string): void;
    public insertAfter(index: number, text: Text, programName?: string): void;
    public insertBefore(token: Token, text: Text, programName?: string): void;
    public insertBefore(index: number, text: Text, programName?: string): void;
    public replaceSingle(token: Token, text: Text, programName?: string): void;
    public replaceSingle(index: number, text: Text, programName?: string): void;
    public replace(from: Token | number, to: Token | number, text: Text, programName?: string): void;
    public delete(from: number | Token, to?: number | Token, programName?: string): void;
    public getProgram(name: string): Rewrites;
    public initializeProgram(name: string): Rewrites;
    public getText(): string;
    public getText(program: string): string;
    public getText(interval: Interval, programName?: string): string;
    public reduceToSingleOperationPerIndex(rewrites: Rewrites): Map<number, RewriteOperation>;
    public catOpText(a: Text, b: Text): string;
    public getKindOfOps(rewrites: Rewrites, kind: unknown, before: number): RewriteOperation[];
}

declare class RewriteOperation {
    public tokens: CommonTokenStream;
    public instructionIndex: number;
    public index: number;
    public text: Text;

    public constructor(tokens: CommonTokenStream, index: number, instructionIndex: number, text: Text);

    public toString(): string;
}
