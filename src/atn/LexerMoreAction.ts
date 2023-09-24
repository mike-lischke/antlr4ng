/* eslint-disable jsdoc/require-param, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { LexerActionType } from "../atn/LexerActionType.js";
import { LexerAction } from "./LexerAction.js";

/**
 * Implements the {@code more} lexer action by calling {@link Lexer//more}.
 *
 * <p>The {@code more} command does not have any parameters, so this action is
 * implemented as a singleton instance exposed by {@link //INSTANCE}.</p>
 */
export class LexerMoreAction extends LexerAction {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        super(LexerActionType.MORE);
    }

    /**
     * <p>This action is implemented by calling {@link Lexer//popMode}.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    execute(lexer: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        lexer.more();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return "more";
    }
}

// @ts-expect-error TS(2339): Property 'INSTANCE' does not exist on type 'typeof... Remove this comment to see the full error message
LexerMoreAction.INSTANCE = new LexerMoreAction();
