/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from "./Token.js";

export class Vocabulary {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    displayNames: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    literalNames: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    maxTokenType: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    symbolicNames: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(literalNames: any, symbolicNames: any, displayNames: any) {
        // @ts-expect-error TS(2339): Property 'EMPTY_NAMES' does not exist on type 'typ... Remove this comment to see the full error message
        this.literalNames = literalNames != null ? literalNames : Vocabulary.EMPTY_NAMES;
        // @ts-expect-error TS(2339): Property 'EMPTY_NAMES' does not exist on type 'typ... Remove this comment to see the full error message
        this.symbolicNames = symbolicNames != null ? symbolicNames : Vocabulary.EMPTY_NAMES;
        // @ts-expect-error TS(2339): Property 'EMPTY_NAMES' does not exist on type 'typ... Remove this comment to see the full error message
        this.displayNames = displayNames != null ? displayNames : Vocabulary.EMPTY_NAMES;
        // See note here on -1 part: https://github.com/antlr/antlr4/pull/1146
        this.maxTokenType =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Math.max(this.displayNames.length,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                Math.max(this.literalNames.length, this.symbolicNames.length)) - 1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    static fromTokenNames(tokenNames: any) {
        if (tokenNames == null || tokenNames.length === 0) {
            // @ts-expect-error TS(2339): Property 'EMPTY_VOCABULARY' does not exist on type... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Vocabulary.EMPTY_VOCABULARY;
        }

        const literalNames = [...tokenNames];
        const symbolicNames = [...tokenNames];
        for (let i = 0; i < tokenNames.length; i++) {
            // eslint-disable-next-line prefer-const
            let tokenName = tokenNames[i];
            if (tokenName == null) {
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (!tokenName.isEmpty()) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const firstChar = tokenName.charAt(0);
                if (firstChar === "'") {
                    symbolicNames[i] = null;
                    continue;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                } else if (firstChar.toUpperCase() === firstChar) {
                    literalNames[i] = null;
                    continue;
                }
            }

            // wasn't a literal or symbolic name
            literalNames[i] = null;
            symbolicNames[i] = null;
        }

        return new Vocabulary(literalNames, symbolicNames, tokenNames);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getMaxTokenType() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.maxTokenType;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getLiteralName(tokenType: any) {
        if (tokenType >= 0 && tokenType < this.literalNames.length) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.literalNames[tokenType];
        }

        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getSymbolicName(tokenType: any) {
        if (tokenType >= 0 && tokenType < this.symbolicNames.length) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return this.symbolicNames[tokenType];
        }

        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (tokenType === Token.EOF) {
            return "EOF";
        }

        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getDisplayName(tokenType: any) {
        if (tokenType >= 0 && tokenType < this.displayNames.length) {
            const displayName = this.displayNames[tokenType];
            if (displayName != null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return displayName;
            }
        }

        const literalName = this.getLiteralName(tokenType);
        if (literalName != null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return literalName;
        }

        const symbolicName = this.getSymbolicName(tokenType);
        if (symbolicName != null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return symbolicName;
        }

        return `${tokenType}`;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getLiteralNames() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.literalNames;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getSymbolicNames() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.symbolicNames;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getDisplayNames() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.displayNames;
    }
}

// @ts-expect-error TS(2339): Property 'EMPTY_NAMES' does not exist on type 'typ... Remove this comment to see the full error message
Vocabulary.EMPTY_NAMES = [];
// @ts-expect-error TS(2339): Property 'EMPTY_VOCABULARY' does not exist on type... Remove this comment to see the full error message
Vocabulary.EMPTY_VOCABULARY = new Vocabulary(Vocabulary.EMPTY_NAMES, Vocabulary.EMPTY_NAMES, Vocabulary.EMPTY_NAMES);
