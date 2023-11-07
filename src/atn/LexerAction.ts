/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Lexer } from "../Lexer.js";
import { HashCode } from "../misc/HashCode.js";

// TODO: make LexerAction an interface
export abstract class LexerAction {
    public readonly actionType: number;
    public isPositionDependent: boolean;

    public constructor(action: number) {
        this.actionType = action;
        this.isPositionDependent = false;
    }

    public hashCode(): number {
        const hash = new HashCode();
        this.updateHashCode(hash);

        return hash.finish();
    }

    public updateHashCode(hash: HashCode): void {
        hash.update(this.actionType);
    }

    public equals(other: unknown): boolean {
        return this === other;
    }

    public abstract execute(lexer: Lexer): void;
}
