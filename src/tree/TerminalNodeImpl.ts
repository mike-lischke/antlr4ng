/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Interval } from "../misc/Interval.js";
// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from '../Token.js';
import { TerminalNode } from "./TerminalNode.js";

export class TerminalNodeImpl extends TerminalNode {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _parent: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    symbol: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(symbol: any) {
        super();
        // eslint-disable-next-line no-underscore-dangle
        this._parent = null;
        this.symbol = symbol;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getChild(i: any) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getSymbol() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.symbol;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get parent() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._parent;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set parent(parent) {
        // eslint-disable-next-line no-underscore-dangle
        this._parent = parent;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getPayload() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.symbol;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getSourceInterval() {
        if (this.symbol === null) {
            // @ts-expect-error TS(2339): Property 'INVALID_INTERVAL' does not exist on type... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Interval.INVALID_INTERVAL;
        }
        const tokenIndex = this.symbol.tokenIndex;
        // eslint-disable-next-line padding-line-between-statements
        return new Interval(tokenIndex, tokenIndex);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getChildCount() {
        return 0;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    accept(visitor: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return visitor.visitTerminal(this);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getText() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.symbol.text;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (this.symbol.type === Token.EOF) {
            return "<EOF>";
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.symbol.text;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toStringTree() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.toString();
    }
}
