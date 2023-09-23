/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ParseTreeVisitor {
    visit(ctx) {
        if (Array.isArray(ctx)) {
            return ctx.map(function (child) {
                return child.accept(this);
            }, this);
        } else {
            return ctx.accept(this);
        }
    }

    visitChildren(ctx) {
        if (ctx.children) {
            return this.visit(ctx.children);
        } else {
            return null;
        }
    }

    visitTerminal(node) {
    }

    visitErrorNode(node) {
    }
}
