/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ErrorNode } from "./ErrorNode";
import { TerminalNode } from "./TerminalNode";
import { ParseTree } from "./ParseTree";

export declare class ParseTreeVisitor<Result> {
    public visit(tree: ParseTree): Result;
    public visitChildren(node: ParseTree): Result;
    public visitTerminal(node: TerminalNode): Result;
    public visitErrorNode(node: ErrorNode): Result;

}

export default ParseTreeVisitor;
