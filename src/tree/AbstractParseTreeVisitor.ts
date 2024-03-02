/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ParserRuleContext } from "../ParserRuleContext.js";
import { ErrorNode } from "./ErrorNode.js";
import { ParseTree } from "./ParseTree.js";
import { ParseTreeVisitor } from "./ParseTreeVisitor.js";
import { TerminalNode } from "./TerminalNode.js";

export abstract class AbstractParseTreeVisitor<T> implements ParseTreeVisitor<T> {
    public visit(tree: ParseTree): T | null {
        return tree.accept(this);
    }

    public visitChildren(node: ParserRuleContext): T | null {
        let result = this.defaultResult();
        const n = node.getChildCount();
        for (let i = 0; i < n; i++) {
            if (!this.shouldVisitNextChild(node, result)) {
                break;
            }

            const c = node.getChild(i);
            if (c) {
                const childResult = c.accept(this);
                result = this.aggregateResult(result, childResult);
            }
        }

        return result;
    };

    public visitTerminal(_node: TerminalNode): T | null {
        return this.defaultResult();
    }

    public visitErrorNode(_node: ErrorNode): T | null {
        return this.defaultResult();
    }

    protected defaultResult(): T | null {
        return null;
    }

    protected shouldVisitNextChild(_node: ParserRuleContext, _currentResult: T | null): boolean {
        return true;
    }

    protected aggregateResult(aggregate: T | null, nextResult: T | null): T | null {
        return nextResult;
    }
}
