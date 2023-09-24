/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Interval } from "../misc/Interval.js";
import { Token } from '../Token.js';
import { TerminalNode } from "./TerminalNode.js";

export class TerminalNodeImpl extends TerminalNode {
    _parent: any;
    symbol: any;
    constructor(symbol: any) {
        super();
        this._parent = null;
        this.symbol = symbol;
    }

    getChild(i: any) {
        return null;
    }

    getSymbol() {
        return this.symbol;
    }

    get parent() {
        return this._parent;
    }

    set parent(parent) {
        this._parent = parent;
    }

    getPayload() {
        return this.symbol;
    }

    getSourceInterval() {
        if (this.symbol === null) {
            // @ts-expect-error TS(2339): Property 'INVALID_INTERVAL' does not exist on type... Remove this comment to see the full error message
            return Interval.INVALID_INTERVAL;
        }
        const tokenIndex = this.symbol.tokenIndex;
        return new Interval(tokenIndex, tokenIndex);
    }

    getChildCount() {
        return 0;
    }

    accept(visitor: any) {
        return visitor.visitTerminal(this);
    }

    getText() {
        return this.symbol.text;
    }

    toString() {
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (this.symbol.type === Token.EOF) {
            return "<EOF>";
        } else {
            return this.symbol.text;
        }
    }

    toStringTree() {
        return this.toString();
    }
}
