/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention */

export namespace ATNStateType {
    export const INVALID_TYPE = 0;
    export const BASIC = 1;
    export const RULE_START = 2;
    export const BLOCK_START = 3;
    export const PLUS_BLOCK_START = 4;
    export const STAR_BLOCK_START = 5;
    export const TOKEN_START = 6;
    export const RULE_STOP = 7;
    export const BLOCK_END = 8;
    export const STAR_LOOP_BACK = 9;
    export const STAR_LOOP_ENTRY = 10;
    export const PLUS_LOOP_BACK = 11;
    export const LOOP_END = 12;
}
