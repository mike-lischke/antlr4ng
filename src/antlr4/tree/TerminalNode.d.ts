/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import ParseTree from "./ParseTree.js";
import Token from "../Token.js";
import Interval from "../misc/Interval.js";

export declare class TerminalNode implements ParseTree {
    public symbol: Token;
    public parentCtx: ParseTree | null;

    public constructor(symbol: Token);

    public getParent(): ParseTree | null;
    public getChild<ParseTree>(i: number): ParseTree | null;
    public getSymbol(): Token;
    public getPayload<T>(): T;
    public getSourceInterval(): Interval;
    public getChildCount(): number;

    public toStringTree(): string;

    public getText(): string;
}

export default TerminalNode;
