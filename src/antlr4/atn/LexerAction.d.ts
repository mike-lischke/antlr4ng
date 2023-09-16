/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

export declare class LexerAction {
    public readonly actionType: number;
    public readonly isPositionDependent: boolean;

    public constructor(actionType: number);

    public hashCode(): number;
    public equals(obj: unknown): boolean;
}
