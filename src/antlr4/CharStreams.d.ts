/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStream } from "./CharStream.js";

export declare class CharStreams {
    public static fromString(data: string, decodeToUnicodeCodePoints?: boolean): CharStream;
    public static fromBuffer(buffer: Buffer, encoding?: string): CharStream;
    public static fromBlob(blob: Blob, encoding: string, onLoad: (stream: CharStream) => void,
        onError: (error: Error) => void): void;
    public static fromPath(path: string, encoding: string, callback: (err: Error, stream: CharStream) => void): void;
    public static fromPathSync(path: string, encoding: string): CharStream;
}
