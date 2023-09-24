/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export class ParseTreeVisitor {
    visit(ctx: any) {
        if (Array.isArray(ctx)) {
            return ctx.map(function(this: any, child) {
                return child.accept(this);
            }, this);
        } else {
            return ctx.accept(this);
        }
    }

    visitChildren(ctx: any) {
        if (ctx.children) {
            return this.visit(ctx.children);
        } else {
            return null;
        }
    }

    visitTerminal(node: any) {
    }

    visitErrorNode(node: any) {
    }
}
