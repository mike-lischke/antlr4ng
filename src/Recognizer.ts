/* eslint-disable jsdoc/require-returns, jsdoc/multiline-blocks, jsdoc/require-param, jsdoc/no-multi-asterisks, jsdoc/no-undefined-types, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from './Token.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ConsoleErrorListener } from './ConsoleErrorListener.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ProxyErrorListener } from './ProxyErrorListener.js';

export class Recognizer {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention
    static EOF = -1;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    static tokenTypeMapCache = new Map();
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    static ruleIndexMapCache = new Map();

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _listeners: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _stateNumber: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getVocabulary: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    interpreter: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    ruleNames: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        // @ts-expect-error TS(2339): Property 'INSTANCE' does not exist on type 'typeof... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._listeners = [ConsoleErrorListener.INSTANCE];
        this.interpreter = null;
        // eslint-disable-next-line no-underscore-dangle
        this._stateNumber = -1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    checkVersion(toolVersion: any) {
        const runtimeVersion = "4.13.1";
        if (runtimeVersion !== toolVersion) {
            console.log("ANTLR runtime and generated code versions disagree: " + runtimeVersion + "!=" + toolVersion);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addErrorListener(listener: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        this._listeners.push(listener);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    removeErrorListeners() {
        // eslint-disable-next-line no-underscore-dangle
        this._listeners = [];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getTokenTypeMap() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const vocabulary = this.getVocabulary();

        let result = Recognizer.tokenTypeMapCache.get(vocabulary);
        if (!result) {
            result = new Map();
            for (let i = 0; i <= this.atn.maxTokenType; i++) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const literalName = vocabulary.getLiteralName(i);
                if (literalName) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    result.set(literalName, i);
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const symbolicName = vocabulary.getSymbolicName(i);
                if (symbolicName) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    result.set(symbolicName, i);
                }
            }

            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            result.set("EOF", Token.EOF);

            Recognizer.tokenTypeMapCache.set(vocabulary, result);
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return result;
    }

    /**
     * Get a map from rule names to rule indexes.
     * <p>Used for XPath and tree pattern compilation.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getRuleIndexMap() {
        const ruleNames = this.ruleNames;
        let result = Recognizer.ruleIndexMapCache.get(ruleNames);
        if (!result) {
            result = new Map();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, arrow-body-style
            ruleNames.forEach((ruleName: any, idx: any) => result.set(ruleName, idx));

            Recognizer.ruleIndexMapCache.set(ruleNames, result);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getTokenType(tokenName: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const ttype = this.getTokenTypeMap().get(tokenName);
        if (ttype) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return ttype;
        }

        // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Token.INVALID_TYPE;
    }

    // What is the error header, normally line/character position information?
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getErrorHeader(e: any) {
        const line = e.offendingToken.line;
        const column = e.offendingToken.column;
        // eslint-disable-next-line padding-line-between-statements
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
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        s = s.replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
        // eslint-disable-next-line padding-line-between-statements
        return "'" + s + "'";
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getErrorListenerDispatch() {
        // eslint-disable-next-line no-underscore-dangle
        return new ProxyErrorListener(this._listeners);
    }

    /**
     * subclass needs to override these if there are sempreds or actions
     * that the ATN interp needs to execute
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    sempred(localctx: any, ruleIndex: any, actionIndex: any) {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    precpred(localctx: any, precedence: any) {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get atn() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.interpreter.atn;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get state() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._stateNumber;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set state(state) {
        // eslint-disable-next-line no-underscore-dangle
        this._stateNumber = state;
    }
}
