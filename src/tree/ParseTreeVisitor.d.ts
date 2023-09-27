/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ErrorNode } from "./ErrorNode.js";
import { TerminalNode } from "./TerminalNode.js";
import { ParseTree } from "./ParseTree.js";

export declare class ParseTreeVisitor<Result> {
    public visit(tree: ParseTree): Result;
    public visitChildren(node: ParseTree): Result;
    public visitTerminal(node: TerminalNode): Result;
    public visitErrorNode(node: ErrorNode): Result;

    protected defaultResult(): Result;
    protected shouldVisitNextChild(node: ParseTree, currentResult: Result): boolean;
    protected aggregateResult(aggregate: Result, nextResult: Result): Result;
}
