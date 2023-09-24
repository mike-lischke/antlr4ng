/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LexerActionType = {
    // The type of a {@link LexerChannelAction} action.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CHANNEL: 0,
    // The type of a {@link LexerCustomAction} action
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CUSTOM: 1,
    // The type of a {@link LexerModeAction} action.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MODE: 2,
    //The type of a {@link LexerMoreAction} action.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MORE: 3,
    //The type of a {@link LexerPopModeAction} action.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    POP_MODE: 4,
    //The type of a {@link LexerPushModeAction} action.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PUSH_MODE: 5,
    //The type of a {@link LexerSkipAction} action.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SKIP: 6,
    //The type of a {@link LexerTypeAction} action.
    // eslint-disable-next-line @typescript-eslint/naming-convention, comma-dangle
    TYPE: 7
};
