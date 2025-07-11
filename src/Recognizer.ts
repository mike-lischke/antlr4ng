/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */

import { Token } from "./Token.js";
import { ConsoleErrorListener } from "./ConsoleErrorListener.js";
import { ProxyErrorListener } from "./ProxyErrorListener.js";
import { ATNSimulator } from "./atn/ATNSimulator.js";
import { ParseInfo } from "./atn/ParseInfo.js";
import { Vocabulary } from "./Vocabulary.js";
import { ANTLRErrorListener } from "./ANTLRErrorListener.js";
import { RecognitionException } from "./RecognitionException.js";
import { ATN } from "./atn/ATN.js";
import { ParserRuleContext } from "./ParserRuleContext.js";
import { IntStream } from "./IntStream.js";

export abstract class Recognizer<ATNInterpreter extends ATNSimulator> {
    public static readonly EOF = -1;

    private static tokenTypeMapCache = new Map<Vocabulary, Map<string, number>>();
    private static ruleIndexMapCache = new Map<string[], Map<string, number>>();

    public interpreter: ATNInterpreter;

    private listeners: ANTLRErrorListener[] = [ConsoleErrorListener.instance];
    private stateNumber = -1;

    public checkVersion(toolVersion: string): void {
        const runtimeVersion = "4.13.1";
        if (runtimeVersion !== toolVersion) {
            console.error("ANTLR runtime and generated code versions disagree: " + runtimeVersion + "!=" + toolVersion);
        }
    }

    public addErrorListener(listener: ANTLRErrorListener): void {
        this.listeners.push(listener);
    }

    public removeErrorListeners(): void {
        this.listeners = [];
    }

    public removeErrorListener(listener: ANTLRErrorListener): void {
        for (let i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);

                return;
            }
        }
    }

    public getErrorListeners(): ANTLRErrorListener[] {
        return this.listeners;
    }

    public getTokenTypeMap(): Map<string, number> {
        const vocabulary = this.vocabulary;

        let result = Recognizer.tokenTypeMapCache.get(vocabulary);
        if (!result) {
            result = new Map<string, number>();
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

            result.set("EOF", Token.EOF);

            Recognizer.tokenTypeMapCache.set(vocabulary, result);
        }

        return result;
    }

    /**
     * Get a map from rule names to rule indexes.
     * Used for XPath and tree pattern compilation.
     */
    public getRuleIndexMap(): Map<string, number> {
        const ruleNames = this.ruleNames;
        let result = Recognizer.ruleIndexMapCache.get(ruleNames);
        if (!result) {
            result = new Map();
            ruleNames.forEach((ruleName, idx) => {
                return result!.set(ruleName, idx);
            });

            Recognizer.ruleIndexMapCache.set(ruleNames, result);
        }

        return result;
    }

    public getTokenType(tokenName: string): number {
        const ttype = this.getTokenTypeMap().get(tokenName);
        if (ttype) {
            return ttype;
        }

        return Token.INVALID_TYPE;
    }

    /** What is the error header, normally line/character position information? */
    public getErrorHeader(e: RecognitionException): string {
        const line = e.offendingToken?.line;
        const column = e.offendingToken?.column;

        return "line " + line + ":" + column;
    }

    public get errorListenerDispatch(): ANTLRErrorListener {
        return new ProxyErrorListener(this.listeners);
    }

    /**
     * subclass needs to override these if there are semantic predicates or actions
     * that the ATN interp needs to execute
     */
    public sempred(_localctx: ParserRuleContext | null, _ruleIndex: number, _actionIndex: number): boolean {
        return true;
    }

    // TODO: make localCtx an optional parameter, not optional null.
    public precpred(_localctx: ParserRuleContext | null, _precedence: number): boolean {
        return true;
    }

    public action(_localctx: ParserRuleContext | null, _ruleIndex: number, _actionIndex: number): void {
        // no-op, subclasses can override if needed
    }

    public get atn(): ATN {
        return this.interpreter.atn;
    }

    public get state(): number {
        return this.stateNumber;
    }

    public set state(state: number) {
        this.stateNumber = state;
    }

    public getParseInfo(): ParseInfo | undefined {
        return undefined;
    }

    public abstract get serializedATN(): number[];

    // TODO: remove need for this: public abstract get literalNames(): Array<string | null>;
    // TODO: remove need for this: public abstract get symbolicNames(): Array<string | null>;
    public abstract get grammarFileName(): string;
    public abstract get ruleNames(): string[];
    public abstract get vocabulary(): Vocabulary;

    public abstract get inputStream(): IntStream | null;
    public abstract set inputStream(input: IntStream | null);
}
