/* eslint-disable jsdoc/tag-lines, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { TerminalNode } from "./TerminalNode.js";
import { ErrorNode } from "./ErrorNode.js";

export class ParseTreeWalker {
    /**
     * Performs a walk on the given parse tree starting at the root and going down recursively
     * with depth-first search. On each node, {@link ParseTreeWalker//enterRule} is called before
     * recursively walking down into child nodes, then
     * {@link ParseTreeWalker//exitRule} is called after the recursive call to wind up.
     * @param listener The listener used by the walker to process grammar rules
     * @param t The parse tree to be walked on
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    walk(listener: any, t: any) {
        const errorNode = t instanceof ErrorNode ||
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            (t.isErrorNode !== undefined && t.isErrorNode());
        if (errorNode) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            listener.visitErrorNode(t);
        } else if (t instanceof TerminalNode) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            listener.visitTerminal(t);
        } else {
            this.enterRule(listener, t);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            for (let i = 0; i < t.getChildCount(); i++) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const child = t.getChild(i);
                this.walk(listener, child);
            }
            this.exitRule(listener, t);
        }
    }

    /**
     * Enters a grammar rule by first triggering the generic event {@link ParseTreeListener//enterEveryRule}
     * then by triggering the event specific to the given parse tree node
     * @param listener The listener responding to the trigger events
     * @param r The grammar rule containing the rule context
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    enterRule(listener: any, r: any) {
        const ctx = r.ruleContext;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        listener.enterEveryRule(ctx);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        ctx.enterRule(listener);
    }

    /**
     * Exits a grammar rule by first triggering the event specific to the given parse tree node
     * then by triggering the generic event {@link ParseTreeListener//exitEveryRule}
     * @param listener The listener responding to the trigger events
     * @param r The grammar rule containing the rule context
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    exitRule(listener: any, r: any) {
        const ctx = r.ruleContext;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        ctx.exitRule(listener);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        listener.exitEveryRule(ctx);
    }
}

// @ts-expect-error TS(2339): Property 'DEFAULT' does not exist on type 'typeof ... Remove this comment to see the full error message
ParseTreeWalker.DEFAULT = new ParseTreeWalker();
