/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ParseTreeVisitor {
    visit(tree) {
        return tree.accept(this);
    }

    visitChildren(node) {
        let result = this.defaultResult();
        const n = node.getChildCount();
        for (let i = 0; i < n; i++) {
            if (!this.shouldVisitNextChild(node, result)) {
                break;
            }

            const c = node.getChild(i);
            const childResult = c.accept(this);
            result = this.aggregateResult(result, childResult);
        }

        return result;
    }

    visitTerminal(node) {
        return this.defaultResult();
    }

    visitErrorNode(node) {
        return this.defaultResult();
    }

    defaultResult() {
        return null;
    }

    shouldVisitNextChild(node, currentResult) {
        return true;
    }

    aggregateResult(aggregate, nextResult) {
        return nextResult;
    }
}
