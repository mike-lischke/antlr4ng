/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { InputStream } from "./InputStream.js";
import { Recognizer } from "./Recognizer.js";
import { Token } from "./Token.js";
import { TokenSource } from "./TokenSource.js";
import { ATNSimulator } from "./atn/ATNSimulator.js";

export declare class CommonToken extends Token {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public readonly EMPTY_SOURCE: [TokenSource | null, InputStream | null];

    public readonly source: [TokenSource | null, InputStream | null];

    public constructor(source: [TokenSource | null, InputStream | null], type: number, channel: number, start: number,
        stop: number);

    public clone(): CommonToken;
    public cloneWithType(type: number): CommonToken;

    public toString(recognizer?: Recognizer<ATNSimulator>): string;
}
