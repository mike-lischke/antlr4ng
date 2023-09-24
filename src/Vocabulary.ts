/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from "./Token.js";

export class Vocabulary {
    displayNames: any;
    literalNames: any;
    maxTokenType: any;
    symbolicNames: any;
    constructor(literalNames: any, symbolicNames: any, displayNames: any) {
        // @ts-expect-error TS(2339): Property 'EMPTY_NAMES' does not exist on type 'typ... Remove this comment to see the full error message
        this.literalNames = literalNames != null ? literalNames : Vocabulary.EMPTY_NAMES;
        // @ts-expect-error TS(2339): Property 'EMPTY_NAMES' does not exist on type 'typ... Remove this comment to see the full error message
        this.symbolicNames = symbolicNames != null ? symbolicNames : Vocabulary.EMPTY_NAMES;
        // @ts-expect-error TS(2339): Property 'EMPTY_NAMES' does not exist on type 'typ... Remove this comment to see the full error message
        this.displayNames = displayNames != null ? displayNames : Vocabulary.EMPTY_NAMES;
        // See note here on -1 part: https://github.com/antlr/antlr4/pull/1146
        this.maxTokenType =
            Math.max(this.displayNames.length,
                Math.max(this.literalNames.length, this.symbolicNames.length)) - 1;
    }

    static fromTokenNames(tokenNames: any) {
        if (tokenNames == null || tokenNames.length === 0) {
            // @ts-expect-error TS(2339): Property 'EMPTY_VOCABULARY' does not exist on type... Remove this comment to see the full error message
            return Vocabulary.EMPTY_VOCABULARY;
        }

        const literalNames = [...tokenNames];
        const symbolicNames = [...tokenNames];
        for (let i = 0; i < tokenNames.length; i++) {
            let tokenName = tokenNames[i];
            if (tokenName == null) {
                continue;
            }

            if (!tokenName.isEmpty()) {
                const firstChar = tokenName.charAt(0);
                if (firstChar === "'") {
                    symbolicNames[i] = null;
                    continue;
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

    getMaxTokenType() {
        return this.maxTokenType;
    }

    getLiteralName(tokenType: any) {
        if (tokenType >= 0 && tokenType < this.literalNames.length) {
            return this.literalNames[tokenType];
        }

        return null;
    }

    getSymbolicName(tokenType: any) {
        if (tokenType >= 0 && tokenType < this.symbolicNames.length) {
            return this.symbolicNames[tokenType];
        }

        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (tokenType === Token.EOF) {
            return "EOF";
        }

        return null;
    }

    getDisplayName(tokenType: any) {
        if (tokenType >= 0 && tokenType < this.displayNames.length) {
            const displayName = this.displayNames[tokenType];
            if (displayName != null) {
                return displayName;
            }
        }

        const literalName = this.getLiteralName(tokenType);
        if (literalName != null) {
            return literalName;
        }

        const symbolicName = this.getSymbolicName(tokenType);
        if (symbolicName != null) {
            return symbolicName;
        }

        return `${tokenType}`;
    }

    getLiteralNames() {
        return this.literalNames;
    }

    getSymbolicNames() {
        return this.symbolicNames;
    }

    getDisplayNames() {
        return this.displayNames;
    }
}

// @ts-expect-error TS(2339): Property 'EMPTY_NAMES' does not exist on type 'typ... Remove this comment to see the full error message
Vocabulary.EMPTY_NAMES = [];
// @ts-expect-error TS(2339): Property 'EMPTY_VOCABULARY' does not exist on type... Remove this comment to see the full error message
Vocabulary.EMPTY_VOCABULARY = new Vocabulary(Vocabulary.EMPTY_NAMES, Vocabulary.EMPTY_NAMES, Vocabulary.EMPTY_NAMES);
