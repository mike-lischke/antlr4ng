/* eslint-disable jsdoc/require-returns, jsdoc/multiline-blocks, jsdoc/require-param, jsdoc/no-multi-asterisks, jsdoc/no-undefined-types */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from './Token.js';
import { ConsoleErrorListener } from './ConsoleErrorListener.js';
import { ProxyErrorListener } from './ProxyErrorListener.js';

export class Recognizer {
    static EOF = -1;
    static tokenTypeMapCache = new Map();
    static ruleIndexMapCache = new Map();

    _listeners: any;
    _stateNumber: any;
    getVocabulary: any;
    interpreter: any;
    ruleNames: any;

    constructor() {
        // @ts-expect-error TS(2339): Property 'INSTANCE' does not exist on type 'typeof... Remove this comment to see the full error message
        this._listeners = [ConsoleErrorListener.INSTANCE];
        this.interpreter = null;
        this._stateNumber = -1;
    }

    checkVersion(toolVersion: any) {
        const runtimeVersion = "4.13.1";
        if (runtimeVersion !== toolVersion) {
            console.log("ANTLR runtime and generated code versions disagree: " + runtimeVersion + "!=" + toolVersion);
        }
    }

    addErrorListener(listener: any) {
        this._listeners.push(listener);
    }

    removeErrorListeners() {
        this._listeners = [];
    }

    getTokenTypeMap() {
        const vocabulary = this.getVocabulary();

        let result = Recognizer.tokenTypeMapCache.get(vocabulary);
        if (!result) {
            result = new Map();
            for (let i = 0; i <= this.atn.maxTokenType; i++) {
                const literalName = vocabulary.getLiteralName(i);
                if (literalName) {
                    result.set(literalName, i);
                }

                const symbolicName = vocabulary.getSymbolicName(i);
                if (symbolicName) {
                    result.set(symbolicName, i);
                }
            }

            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            result.set("EOF", Token.EOF);

            Recognizer.tokenTypeMapCache.set(vocabulary, result);
        }
        return result;
    }

    /**
     * Get a map from rule names to rule indexes.
     * <p>Used for XPath and tree pattern compilation.</p>
     */
    getRuleIndexMap() {
        const ruleNames = this.ruleNames;
        let result = Recognizer.ruleIndexMapCache.get(ruleNames);
        if (!result) {
            result = new Map();
            ruleNames.forEach((ruleName: any, idx: any) => result.set(ruleName, idx));

            Recognizer.ruleIndexMapCache.set(ruleNames, result);
        }

        return result;
    }

    getTokenType(tokenName: any) {
        const ttype = this.getTokenTypeMap().get(tokenName);
        if (ttype) {
            return ttype;
        }

        // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
        return Token.INVALID_TYPE;
    }

    // What is the error header, normally line/character position information?
    getErrorHeader(e: any) {
        const line = e.offendingToken.line;
        const column = e.offendingToken.column;
        return "line " + line + ":" + column;
    }

    /**
     * How should a token be displayed in an error message? The default
     * is to display just the text, but during development you might
     * want to have a lot of information spit out.  Override in that case
     * to use t.toString() (which, for CommonToken, dumps everything about
     * the token). This is better than forcing you to override a method in
     * your token objects because you don't have to go modify your lexer
     * so that it creates a new Java type.
     *
     * @deprecated This method is not called by the ANTLR 4 Runtime. Specific
     * implementations of {@link ANTLRErrorStrategy} may provide a similar
     * feature when necessary. For example, see
     * {@link DefaultErrorStrategy//getTokenErrorDisplay}.*/
    getTokenErrorDisplay(t: any) {
        if (t === null) {
            return "<no token>";
        }
        let s = t.text;
        if (s === null) {
            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            if (t.type === Token.EOF) {
                s = "<EOF>";
            } else {
                s = "<" + t.type + ">";
            }
        }
        s = s.replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
        return "'" + s + "'";
    }

    getErrorListenerDispatch() {
        return new ProxyErrorListener(this._listeners);
    }

    /**
     * subclass needs to override these if there are sempreds or actions
     * that the ATN interp needs to execute
     */
    sempred(localctx: any, ruleIndex: any, actionIndex: any) {
        return true;
    }

    precpred(localctx: any, precedence: any) {
        return true;
    }

    get atn() {
        return this.interpreter.atn;
    }

    get state() {
        return this._stateNumber;
    }

    set state(state) {
        this._stateNumber = state;
    }
}
