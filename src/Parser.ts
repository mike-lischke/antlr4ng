/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param, no-underscore-dangle */

import { Token } from "./Token.js";
import { TerminalNode } from "./tree/TerminalNode.js";
import { ErrorNode } from "./tree/ErrorNode.js";
import { Recognizer } from "./Recognizer.js";
import { DefaultErrorStrategy } from "./DefaultErrorStrategy.js";
import { ATNDeserializer } from "./atn/ATNDeserializer.js";
import { ParserATNSimulator } from "./atn/ParserATNSimulator.js";
import { TokenStream } from "./TokenStream.js";
import { ParseTreeListener } from "./tree/ParseTreeListener.js";
import { ParserRuleContext } from "./ParserRuleContext.js";
import { TokenFactory } from "./TokenFactory.js";
import { ATN } from "./atn/ATN.js";
import { RecognitionException } from "./RecognitionException.js";
import { RuleTransition } from "./atn/RuleTransition.js";
import { IntervalSet } from "./misc/IntervalSet.js";
import { TraceListener } from "./TraceListener.js";
import { ProfilingATNSimulator } from "./atn/ProfilingATNSimulator.js";
import type { IntStream } from "./IntStream.js";
import type { ParseTreePattern } from "./tree/pattern/ParseTreePattern.js";
import { Lexer } from "./Lexer.js";
import { ParseTreePatternMatcher } from "./tree/pattern/ParseTreePatternMatcher.js";
import { ParseInfo } from "./atn/ParseInfo.js";

export interface IDebugPrinter {
    println(s: string): void;
    print(s: string): void;
}

export abstract class Parser extends Recognizer<ParserATNSimulator> {
    /** For testing only. */
    public printer: IDebugPrinter | null = null;

    /**
     * Specifies whether or not the parser should construct a parse tree during
     * the parsing process. The default value is `true`.
     *
     * @see #getBuildParseTree
     * @see #setBuildParseTree
     */
    public buildParseTrees = true;

    /**
     * The error handling strategy for the parser. The default value is a new
     * instance of {@link DefaultErrorStrategy}.
     *
     * @see #getErrorHandler
     * @see #setErrorHandler
     */
    public errorHandler = new DefaultErrorStrategy();

    /**
     * The {@link ParserRuleContext} object for the currently executing rule.
     * This is always non-null during the parsing process.
     */
    // TODO: make private
    public context: ParserRuleContext | null = null;

    protected precedenceStack: number[] = [];

    /**
     * The list of {@link ParseTreeListener} listeners registered to receive
     * events during the parse.
     *
     * @see #addParseListener
     */
    protected parseListeners: ParseTreeListener[] | null = null;

    /**
     * The number of syntax errors reported during parsing. This value is
     * incremented each time {@link #notifyErrorListeners} is called.
     */
    protected syntaxErrors = 0;

    /** Indicates parser has matched EOF token. See {@link #exitRule()}. */
    protected matchedEOF = false;

    /**
     * When {@link #setTrace}`(true)` is called, a reference to the
     * {@link TraceListener} is stored here so it can be easily removed in a
     * later call to {@link #setTrace}`(false)`. The listener itself is
     * implemented as a parser listener so this field is not directly used by
     * other parser methods.
     */
    private tracer: TraceListener | null = null;

    /**
     * This field holds the deserialized {@link ATN} with bypass alternatives, created
     * lazily upon first demand. In 4.10 I changed from map<serializedATNString, ATN>
     * since we only need one per parser object and also it complicates other targets
     * that don't use ATN strings.
     *
     * @see ATNDeserializationOptions#isGenerateRuleBypassTransitions()
     */
    private bypassAltsAtnCache: ATN | null = null;

    #inputStream!: TokenStream;

    /**
     * This is all the parsing support code essentially. Most of it is error recovery stuff.
     */
    public constructor(input: TokenStream) {
        super();

        this.precedenceStack.push(0);
        this.syntaxErrors = 0;
        this.#inputStream = input;
    }

    /** reset the parser's state */
    public reset(rewindInputStream = true): void {
        if (rewindInputStream) {
            this.inputStream.seek(0);
        }
        this.errorHandler.reset(this);
        this.context = null;
        this.syntaxErrors = 0;
        this.matchedEOF = false;
        this.setTrace(false);
        this.precedenceStack = [];
        this.precedenceStack.push(0);
        if (this.interpreter) {
            this.interpreter.reset();
        }
    }

    /**
     * Match current input symbol against `ttype`. If the symbol type
     * matches, {@link ANTLRErrorStrategy//reportMatch} and {@link consume} are
     * called to complete the match process.
     *
     * If the symbol type does not match,
     * {@link ANTLRErrorStrategy//recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link buildParseTree} is
     * `true` and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy//recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link ParserRuleContext//addErrorNode}.
     *
     * @param ttype the token type to match
     * @returns the matched symbol
     * @throws RecognitionException if the current input symbol did not match
     * `ttype` and the error strategy could not recover from the
     * mismatched symbol
     */
    public match(ttype: number): Token {
        let t = this.getCurrentToken();
        if (t.type === ttype) {
            if (ttype === Token.EOF) {
                this.matchedEOF = true;
            }

            this.errorHandler.reportMatch(this);
            this.consume();
        } else {
            t = this.errorHandler.recoverInline(this);
            if (this.buildParseTrees && t.tokenIndex === -1) {
                // we must have conjured up a new token during single token
                // insertion
                // if it's not the current symbol
                this.context!.addErrorNode(this.createErrorNode(this.context!, t));
            }
        }

        return t;
    }

    /**
     * Match current input symbol as a wildcard. If the symbol type matches
     * (i.e. has a value greater than 0), {@link ANTLRErrorStrategy//reportMatch}
     * and {@link consume} are called to complete the match process.
     *
     * If the symbol type does not match,
     * {@link ANTLRErrorStrategy//recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link buildParseTree} is
     * `true` and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy//recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link ParserRuleContext//addErrorNode}.
     *
     * @returns the matched symbol
     * @throws RecognitionException if the current input symbol did not match
     * a wildcard and the error strategy could not recover from the mismatched
     * symbol
     */
    public matchWildcard(): Token {
        let t = this.getCurrentToken();
        if (t.type > 0) {
            this.errorHandler.reportMatch(this);
            this.consume();
        } else {
            t = this.errorHandler.recoverInline(this);
            if (this.buildParseTrees && t.tokenIndex === -1) {
                // we must have conjured up a new token during single token
                // insertion
                // if it's not the current symbol
                this.context!.addErrorNode(this.createErrorNode(this.context!, t));
            }
        }

        return t;
    }

    public getParseListeners(): ParseTreeListener[] {
        return this.parseListeners ?? [];
    }

    /**
     * Registers `listener` to receive events during the parsing process.
     *
     * To support output-preserving grammar transformations (including but not
     * limited to left-recursion removal, automated left-factoring, and
     * optimized code generation), calls to listener methods during the parse
     * may differ substantially from calls made by
     * {@link ParseTreeWalker//DEFAULT} used after the parse is complete. In
     * particular, rule entry and exit events may occur in a different order
     * during the parse than after the parser. In addition, calls to certain
     * rule entry methods may be omitted.
     *
     * With the following specific exceptions, calls to listener events are
     * deterministic*, i.e. for identical input the calls to listener
     * methods will be the same.
     *
     * - Alterations to the grammar used to generate code may change the
     * behavior of the listener calls.
     * - Alterations to the command line options passed to ANTLR 4 when
     * generating the parser may change the behavior of the listener calls.
     * - Changing the version of the ANTLR Tool used to generate the parser
     * may change the behavior of the listener calls.
     *
     * @param listener the listener to add
     *
     * @throws NullPointerException if {@code} listener is `null`
     */
    public addParseListener(listener: ParseTreeListener): void {
        if (listener === null) {
            throw new Error("listener");
        }
        if (this.parseListeners === null) {
            this.parseListeners = [];
        }
        this.parseListeners.push(listener);
    }

    /**
     * Remove `listener` from the list of parse listeners.
     *
     * If `listener` is `null` or has not been added as a parse
     * listener, this method does nothing.
     *
     * @param listener the listener to remove
     */
    public removeParseListener(listener: ParseTreeListener | null): void {
        if (this.parseListeners !== null && listener !== null) {
            const idx = this.parseListeners.indexOf(listener);
            if (idx >= 0) {
                this.parseListeners.splice(idx, 1);
            }
            if (this.parseListeners.length === 0) {
                this.parseListeners = null;
            }
        }
    }

    // Remove all parse listeners.
    public removeParseListeners(): void {
        this.parseListeners = null;
    }

    // Notify any parse listeners of an enter rule event.
    public triggerEnterRuleEvent(): void {
        if (this.parseListeners !== null) {
            const ctx = this.context!;
            this.parseListeners.forEach((listener) => {
                listener.enterEveryRule(ctx);
                ctx.enterRule(listener);
            });
        }
    }

    /**
     * Notify any parse listeners of an exit rule event.
     *
     * @see //addParseListener
     */
    public triggerExitRuleEvent(): void {
        if (this.parseListeners !== null) {
            // reverse order walk of listeners
            const ctx = this.context!;
            this.parseListeners.slice(0).reverse().forEach((listener) => {
                ctx.exitRule(listener);
                listener.exitEveryRule(ctx);
            });
        }
    }

    public getTokenFactory(): TokenFactory<Token> {
        return this.inputStream.tokenSource.tokenFactory;
    }

    // Tell our token source and error strategy about a new way to create tokens.
    public setTokenFactory(factory: TokenFactory<Token>): void {
        this.inputStream.tokenSource.tokenFactory = factory;
    }

    /**
     * The preferred method of getting a tree pattern. For example, here's a
     * sample use:
     *
     * ```
     * const t = parser.expr();
     * const p = parser.compileParseTreePattern("<ID>+0", MyParser.RULE_expr);
     * const m = p.match(t);
     * const id = m.get("ID");
     * ```
     */
    public compileParseTreePattern(pattern: string, patternRuleIndex: number, lexer?: Lexer): ParseTreePattern {
        if (!lexer) {
            if (this.tokenStream !== null) {
                const tokenSource = this.tokenStream.tokenSource;
                if (tokenSource instanceof Lexer) {
                    lexer = tokenSource;
                }
            }
        }

        if (!lexer) {
            throw new Error("Parser can't discover a lexer to use");
        }

        const m = new ParseTreePatternMatcher(lexer, this);

        return m.compile(pattern, patternRuleIndex);
    }

    /**
     * The ATN with bypass alternatives is expensive to create so we create it
     * lazily.
     *
     * @throws UnsupportedOperationException if the current parser does not
     * implement the {@link getSerializedATN()} method.
     */
    public getATNWithBypassAlts(): ATN {
        const serializedAtn = this.serializedATN;
        if (serializedAtn === null) {
            throw new Error("The current parser does not support an ATN with bypass alternatives.");
        }

        if (this.bypassAltsAtnCache !== null) {
            return this.bypassAltsAtnCache;
        }

        const deserializationOptions = { readOnly: false, verifyATN: true, generateRuleBypassTransitions: true };
        this.bypassAltsAtnCache = new ATNDeserializer(deserializationOptions).deserialize(serializedAtn);

        return this.bypassAltsAtnCache;
    }

    /**
     * Gets the number of syntax errors reported during parsing. This value is
     * incremented each time {@link notifyErrorListeners} is called.
     */
    public get numberOfSyntaxErrors(): number {
        return this.syntaxErrors;
    }

    public get inputStream(): TokenStream {
        return this.#inputStream;
    }

    public set inputStream(input: IntStream) {
        this.tokenStream = input as TokenStream;
    }

    public get tokenStream(): TokenStream {
        return this.#inputStream;
    }

    /** Set the token stream and reset the parser. */
    public set tokenStream(input: TokenStream) {
        this.reset(false);
        this.#inputStream = input;
    }

    /**
     * Match needs to return the current input symbol, which gets put
     * into the label for the associated token ref; e.g., x=ID.
     */
    public getCurrentToken(): Token {
        return this.inputStream.LT(1)!;
    }

    public notifyErrorListeners(msg: string, offendingToken: Token | null, err: RecognitionException | null): void {
        offendingToken = offendingToken ?? null;
        err = err ?? null;
        if (offendingToken === null) {
            offendingToken = this.getCurrentToken();
        }
        this.syntaxErrors += 1;
        const line = offendingToken.line;
        const column = offendingToken.column;
        this.errorListenerDispatch.syntaxError(this, offendingToken, line, column, msg, err);
    }

    /**
     * Consume and return the {@link getCurrentToken current symbol}.
     *
     * E.g., given the following input with `A` being the current
     * lookahead symbol, this function moves the cursor to `B` and returns
     * `A`.
     *
     * ```
     * A B
     * ^
     * ```
     *
     * If the parser is not in error recovery mode, the consumed symbol is added
     * to the parse tree using {@link ParserRuleContext//addChild(Token)}, and
     * {@link ParseTreeListener//visitTerminal} is called on any parse listeners.
     * If the parser *is* in error recovery mode, the consumed symbol is
     * added to the parse tree using
     * {@link ParserRuleContext//addErrorNode(Token)}, and
     * {@link ParseTreeListener//visitErrorNode} is called on any parse
     * listeners.
     */
    public consume(): Token {
        const o = this.getCurrentToken();
        if (o.type !== Token.EOF) {
            this.tokenStream.consume();
        }

        const hasListener = this.parseListeners !== null && this.parseListeners.length > 0;
        if (this.buildParseTrees || hasListener) {
            let node: ErrorNode | TerminalNode;
            if (this.errorHandler.inErrorRecoveryMode(this)) {
                node = this.context!.addErrorNode(this.createErrorNode(this.context!, o));
            } else {
                node = this.context!.addTokenNode(o);
            }

            if (hasListener) {
                this.parseListeners!.forEach((listener) => {
                    if (node instanceof ErrorNode) {
                        listener.visitErrorNode(node);
                    } else {
                        listener.visitTerminal(node);
                    }
                });
            }
        }

        return o;
    }

    public addContextToParseTree(): void {
        // add current context to parent if we have a parent
        if (this.context?.parent) {
            this.context.parent.addChild(this.context);
        }
    }

    /**
     * Always called by generated parsers upon entry to a rule. Access field
     * {@link context} get the current context.
     */
    public enterRule(localctx: ParserRuleContext, state: number, _ruleIndex: number): void {
        this.state = state;
        this.context = localctx;
        this.context.start = this.inputStream.LT(1);
        if (this.buildParseTrees) {
            this.addContextToParseTree();
        }
        this.triggerEnterRuleEvent();
    }

    public exitRule(): void {
        if (this.matchedEOF) {
            // If we have matched EOF, it cannot consume past EOF so we use LT(1) here.
            this.context!.stop = this.inputStream.LT(1); // LT(1) will be end of file
        } else {
            this.context!.stop = this.inputStream.LT(-1); // stop node is what we just matched
        }

        // Trigger event on context, before it reverts to parent.
        this.triggerExitRuleEvent();
        this.state = this.context!.invokingState;
        this.context = this.context!.parent;
    }

    public enterOuterAlt(localctx: ParserRuleContext, altNum: number): void {
        localctx.setAltNumber(altNum);
        // if we have new localctx, make sure we replace existing ctx
        // that is previous child of parse tree
        if (this.buildParseTrees && this.context !== localctx) {
            if (this.context?.parent) {
                this.context.parent.removeLastChild();
                this.context.parent.addChild(localctx);
            }
        }
        this.context = localctx;
    }

    /**
     * Get the precedence level for the top-most precedence rule.
     *
     * @returns The precedence level for the top-most precedence rule, or -1 if
     * the parser context is not nested within a precedence rule.
     */
    public getPrecedence(): number {
        if (this.precedenceStack.length === 0) {
            return -1;
        }

        return this.precedenceStack[this.precedenceStack.length - 1];
    }

    public enterRecursionRule(localctx: ParserRuleContext, state: number, ruleIndex: number, precedence: number): void {
        this.state = state;
        this.precedenceStack.push(precedence);
        this.context = localctx;
        this.context.start = this.inputStream.LT(1);
        this.triggerEnterRuleEvent(); // simulates rule entry for left-recursive rules
    }

    /** Like {@link enterRule} but for recursive rules. */
    public pushNewRecursionContext(localctx: ParserRuleContext, state: number, _ruleIndex: number): void {
        const previous = this.context!;
        previous.parent = localctx;
        previous.invokingState = state;
        previous.stop = this.inputStream.LT(-1);

        this.context = localctx;
        this.context.start = previous.start;
        if (this.buildParseTrees) {
            this.context.addChild(previous);
        }
        this.triggerEnterRuleEvent(); // simulates rule entry for left-recursive rules
    }

    public unrollRecursionContexts(parent: ParserRuleContext | null): void {
        this.precedenceStack.pop();
        this.context!.stop = this.inputStream.LT(-1);
        const retCtx = this.context!; // save current ctx (return value)
        // unroll so _ctx is as it was before call to recursive method
        const parseListeners = this.getParseListeners();
        if (parseListeners !== null && parseListeners.length > 0) {
            while (this.context !== parent) {
                this.triggerExitRuleEvent();
                this.context = this.context!.parent;
            }
        } else {
            this.context = parent;
        }

        // hook into tree
        retCtx.parent = parent;
        if (this.buildParseTrees && parent !== null) {
            // add return ctx into invoking rule's tree
            parent.addChild(retCtx);
        }
    }

    public getInvokingContext(ruleIndex: number): ParserRuleContext | null {
        let ctx = this.context;
        while (ctx !== null) {
            if (ctx.ruleIndex === ruleIndex) {
                return ctx;
            }
            ctx = ctx.parent;
        }

        return null;
    }

    public override precpred(_localctx: ParserRuleContext | null, precedence: number): boolean {
        return precedence >= this.precedenceStack[this.precedenceStack.length - 1];
    }

    /**
     * Checks whether or not `symbol` can follow the current state in the
     * ATN. The behavior of this method is equivalent to the following, but is
     * implemented such that the complete context-sensitive follow set does not
     * need to be explicitly constructed.
     *
     * ```
     * return getExpectedTokens().contains(symbol);
     * ```
     *
     * @param symbol the symbol type to check
     * @returns `true` if `symbol` can follow the current state in
     * the ATN, otherwise `false`.
     */
    public isExpectedToken(symbol: number): boolean {
        const atn = this.interpreter.atn;
        let ctx = this.context;
        const s = atn.states[this.state]!;
        let following = atn.nextTokens(s);
        if (following.contains(symbol)) {
            return true;
        }
        if (!following.contains(Token.EPSILON)) {
            return false;
        }
        while (ctx !== null && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
            const invokingState = atn.states[ctx.invokingState]!;
            const rt = invokingState.transitions[0] as RuleTransition;
            following = atn.nextTokens(rt.followState);
            if (following.contains(symbol)) {
                return true;
            }
            ctx = ctx.parent;
        }
        if (following.contains(Token.EPSILON) && symbol === Token.EOF) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Computes the set of input symbols which could follow the current parser
     * state and context, as given by {@link getState} and {@link getContext},
     * respectively.
     *
     * {@link ATN.getExpectedTokens ATN.getExpectedTokens(int, RuleContext)}
     */
    public getExpectedTokens(): IntervalSet {
        return this.interpreter.atn.getExpectedTokens(this.state, this.context);
    }

    public getExpectedTokensWithinCurrentRule(): IntervalSet {
        const atn = this.interpreter.atn;
        const s = atn.states[this.state]!;

        return atn.nextTokens(s);
    }

    /** Get a rule's index (i.e., `RULE_ruleName` field) or -1 if not found. */
    public getRuleIndex(ruleName: string): number {
        return this.getRuleIndexMap().get(ruleName) ?? -1; // Terribly inefficient.
    }

    /**
     * @returns an array of string of the rule names in your parser instance
     * leading up to a call to the current rule. You could override if
     * you want more details such as the file/line info of where
     * in the ATN a rule is invoked.
     *
     * this is very useful for error messages.
     */
    public getRuleInvocationStack(p?: ParserRuleContext | null): string[] {
        p = p ?? null;
        if (p === null) {
            p = this.context;
        }

        const stack = [];
        while (p !== null) {
            // compute what follows who invoked us
            const ruleIndex = p.ruleIndex;
            if (ruleIndex < 0) {
                stack.push("n/a");
            } else {
                stack.push(this.ruleNames[ruleIndex]);
            }
            p = p.parent;
        }

        return stack;
    }

    /**
     * For debugging and other purposes.
     *
     * TODO: this differs from the Java version. Change it.
     */
    public getDFAStrings(): string {
        return this.interpreter.decisionToDFA.toString();
    }

    /** For debugging and other purposes. */
    public dumpDFA(): void {
        let seenOne = false;
        for (const dfa of this.interpreter.decisionToDFA) {
            if (dfa.length > 0) {
                if (seenOne) {
                    console.log();
                }

                // During tests this field is assigned. Avoids accessing Node.js stuff outside of the tests.
                if (this.printer) {
                    this.printer.println("Decision " + dfa.decision + ":");
                    this.printer.print(dfa.toString(this.vocabulary));
                }

                seenOne = true;
            }
        }
    }

    public getSourceName(): string {
        return this.inputStream.getSourceName();
    }

    public override getParseInfo(): ParseInfo | undefined {
        const interp = this.interpreter;
        if (interp instanceof ProfilingATNSimulator) {
            return new ParseInfo(interp);
        }

        return undefined;
    }

    public setProfile(profile: boolean): void {
        const interp = this.interpreter;
        const saveMode = interp.predictionMode;

        if (profile) {
            if (!(interp instanceof ProfilingATNSimulator)) {
                this.interpreter = new ProfilingATNSimulator(this);
            }
        } else if (interp instanceof ProfilingATNSimulator) {
            const sharedContextCache = interp.sharedContextCache;
            if (sharedContextCache) {
                const sim = new ParserATNSimulator(this, this.atn, interp.decisionToDFA, sharedContextCache);
                this.interpreter = sim;
            }
        }
        this.interpreter.predictionMode = saveMode;
    }

    /**
     * During a parse is sometimes useful to listen in on the rule entry and exit
     * events as well as token matches. this is for quick and dirty debugging.
     */
    public setTrace(trace: boolean): void {
        if (!trace) {
            this.removeParseListener(this.tracer);
            this.tracer = null;
        } else {
            if (this.tracer !== null) {
                this.removeParseListener(this.tracer);
            }
            this.tracer = new TraceListener(this);
            this.addParseListener(this.tracer);
        }
    }

    public createTerminalNode(parent: ParserRuleContext, t: Token): TerminalNode {
        return new TerminalNode(t);
    }

    public createErrorNode(parent: ParserRuleContext, t: Token): ErrorNode {
        return new ErrorNode(t);
    }
}
