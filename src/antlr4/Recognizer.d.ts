/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Token } from "./Token.js";
import { Vocabulary } from "./Vocabulary.js";
import { ATN } from "./atn/ATN.js";
import { ATNSimulator } from "./atn/ATNSimulator.js";
import { RuleContext } from "./context/RuleContext.js";
import { BaseErrorListener } from "./error/BaseErrorListener.js";
import { RecognitionException } from "./error/RecognitionException.js";

export declare abstract class Recognizer<ATNInterpreter extends ATNSimulator> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EOF: number;

    public _interp: ATNInterpreter;

    public addErrorListener(listener: BaseErrorListener<ATNInterpreter>): void;
    public removeErrorListeners(): void;

    public getLiteralNames(): string[];
    public getSymbolicNames(): string[];
    public getTokenNames(): string[];

    public getTokenTypeMap(): Map<Vocabulary, Map<string, number>>;
    public getRuleIndexMap(): Map<string[], Map<string, number>>;

    public getTokenType(tokenName: string): number;
    public getErrorHeader(e: RecognitionException): string;
    public getTokenErrorDisplay(t: Token | null): string;

    public sempred(_localctx: RuleContext | null, ruleIndex: number, actionIndex: number): boolean;
    public precpred(localctx: RuleContext | null, precedence: number): boolean;

    public get atn(): ATN;

    public get state(): number;
    public set state(newState: number);

    protected checkVersion(toolVersion: string): void;

    public abstract get grammarFileName(): string;
    public abstract get ruleNames(): string[];
    public abstract getVocabulary(): Vocabulary;
}
