/* eslint-disable jsdoc/require-param, jsdoc/no-undefined-types, jsdoc/require-returns, jsdoc/check-tag-names, jsdoc/tag-lines, jsdoc/valid-types, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { Token } from './Token.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { TerminalNode } from './tree/TerminalNode.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ErrorNode } from './tree/ErrorNode.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ErrorNodeImpl } from './tree/ErrorNodeImpl.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { Recognizer } from './Recognizer.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { DefaultErrorStrategy } from './DefaultErrorStrategy.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ATNDeserializer } from './atn/ATNDeserializer.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ATNDeserializationOptions } from './atn/ATNDeserializationOptions.js';
import { TraceListener } from "./TraceListener.js";
import { TerminalNodeImpl } from "./tree/TerminalNodeImpl.js";

export class Parser extends Recognizer {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _ctx: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _input: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _parseListeners: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _precedenceStack: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _syntaxErrors: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _tracer: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    buildParseTrees: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    bypassAltsAtnCache: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    errorHandler: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getSerializedATN: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    interpreter: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    ruleNames: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    vocabulary: any;
    /**
     * this is all the parsing support code essentially; most of it is error
     * recovery stuff.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(input: any) {
        super();
        // The input stream.
        // eslint-disable-next-line no-underscore-dangle
        this._input = null;
        /**
         * The error handling strategy for the parser. The default value is a new
         * instance of {@link DefaultErrorStrategy}.
         */
        this.errorHandler = new DefaultErrorStrategy();
        // eslint-disable-next-line no-underscore-dangle
        this._precedenceStack = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        this._precedenceStack.push(0);
        /**
         * The {@link ParserRuleContext} object for the currently executing rule.
         * this is always non-null during the parsing process.
         */
        // eslint-disable-next-line no-underscore-dangle
        this._ctx = null;
        /**
         * Specifies whether or not the parser should construct a parse tree during
         * the parsing process. The default value is {@code true}.
         */
        this.buildParseTrees = true;
        /**
         * When {@link //setTrace}{@code (true)} is called, a reference to the
         * {@link TraceListener} is stored here so it can be easily removed in a
         * later call to {@link //setTrace}{@code (false)}. The listener itself is
         * implemented as a parser listener so this field is not directly used by
         * other parser methods.
         */
        // eslint-disable-next-line no-underscore-dangle
        this._tracer = null;
        /**
         * The list of {@link ParseTreeListener} listeners registered to receive
         * events during the parse.
         */
        // eslint-disable-next-line no-underscore-dangle
        this._parseListeners = null;
        /**
         * The number of syntax errors reported during parsing. this value is
         * incremented each time {@link //notifyErrorListeners} is called.
         */
        // eslint-disable-next-line no-underscore-dangle
        this._syntaxErrors = 0;
        this.tokenStream = input;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get context() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._ctx;
    }

    // reset the parser's state
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    reset() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._input !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
            this._input.seek(0);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.errorHandler.reset(this);
        // eslint-disable-next-line no-underscore-dangle
        this._ctx = null;
        // eslint-disable-next-line no-underscore-dangle
        this._syntaxErrors = 0;
        this.setTrace(false);
        // eslint-disable-next-line no-underscore-dangle
        this._precedenceStack = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        this._precedenceStack.push(0);
        if (this.interpreter !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.interpreter.reset();
        }
    }

    /**
     * Match current input symbol against {@code ttype}. If the symbol type
     * matches, {@link ANTLRErrorStrategy//reportMatch} and {@link //consume} are
     * called to complete the match process.
     *
     * <p>If the symbol type does not match,
     * {@link ANTLRErrorStrategy//recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link //buildParseTree} is
     * {@code true} and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy//recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link ParserRuleContext//addErrorNode}.</p>
     *
     * @param ttype the token type to match
     * @return the matched symbol
     * @throws RecognitionException if the current input symbol did not match
     * {@code ttype} and the error strategy could not recover from the
     * mismatched symbol
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    match(ttype: any) {
        let t = this.getCurrentToken();
        if (t.type === ttype) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.errorHandler.reportMatch(this);
            this.consume();
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            t = this.errorHandler.recoverInline(this);
            if (this.buildParseTrees && t.tokenIndex === -1) {
                // we must have conjured up a new token during single token
                // insertion
                // if it's not the current symbol
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this._ctx.addErrorNode(t);
            }
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return t;
    }

    /**
     * Match current input symbol as a wildcard. If the symbol type matches
     * (i.e. has a value greater than 0), {@link ANTLRErrorStrategy//reportMatch}
     * and {@link //consume} are called to complete the match process.
     *
     * <p>If the symbol type does not match,
     * {@link ANTLRErrorStrategy//recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link //buildParseTree} is
     * {@code true} and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy//recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link ParserRuleContext//addErrorNode}.</p>
     *
     * @return the matched symbol
     * @throws RecognitionException if the current input symbol did not match
     * a wildcard and the error strategy could not recover from the mismatched
     * symbol
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    matchWildcard() {
        let t = this.getCurrentToken();
        if (t.type > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.errorHandler.reportMatch(this);
            this.consume();
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            t = this.errorHandler.recoverInline(this);
            if (this.buildParseTrees && t.tokenIndex === -1) {
                // we must have conjured up a new token during single token
                // insertion
                // if it's not the current symbol
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this._ctx.addErrorNode(t);
            }
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return t;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getParseListeners() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._parseListeners || [];
    }

    /**
     * Registers {@code listener} to receive events during the parsing process.
     *
     * <p>To support output-preserving grammar transformations (including but not
     * limited to left-recursion removal, automated left-factoring, and
     * optimized code generation), calls to listener methods during the parse
     * may differ substantially from calls made by
     * {@link ParseTreeWalker//DEFAULT} used after the parse is complete. In
     * particular, rule entry and exit events may occur in a different order
     * during the parse than after the parser. In addition, calls to certain
     * rule entry methods may be omitted.</p>
     *
     * <p>With the following specific exceptions, calls to listener events are
     * <em>deterministic</em>, i.e. for identical input the calls to listener
     * methods will be the same.</p>
     *
     * <ul>
     * <li>Alterations to the grammar used to generate code may change the
     * behavior of the listener calls.</li>
     * <li>Alterations to the command line options passed to ANTLR 4 when
     * generating the parser may change the behavior of the listener calls.</li>
     * <li>Changing the version of the ANTLR Tool used to generate the parser
     * may change the behavior of the listener calls.</li>
     * </ul>
     *
     * @param listener the listener to add
     *
     * @throws NullPointerException if {@code} listener is {@code null}
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addParseListener(listener: any) {
        if (listener === null) {
            // eslint-disable-next-line no-throw-literal
            throw "listener";
        }
        // eslint-disable-next-line no-underscore-dangle
        if (this._parseListeners === null) {
            // eslint-disable-next-line no-underscore-dangle
            this._parseListeners = [];
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        this._parseListeners.push(listener);
    }

    /**
     * Remove {@code listener} from the list of parse listeners.
     *
     * <p>If {@code listener} is {@code null} or has not been added as a parse
     * listener, this method does nothing.</p>
     * @param listener the listener to remove
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    removeParseListener(listener: any) {
        // eslint-disable-next-line no-underscore-dangle
        if (this._parseListeners !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
            const idx = this._parseListeners.indexOf(listener);
            if (idx >= 0) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this._parseListeners.splice(idx, 1);
            }
            // eslint-disable-next-line no-underscore-dangle
            if (this._parseListeners.length === 0) {
                // eslint-disable-next-line no-underscore-dangle
                this._parseListeners = null;
            }
        }
    }

    // Remove all parse listeners.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    removeParseListeners() {
        // eslint-disable-next-line no-underscore-dangle
        this._parseListeners = null;
    }

    // Notify any parse listeners of an enter rule event.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    triggerEnterRuleEvent() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._parseListeners !== null) {
            // eslint-disable-next-line no-underscore-dangle
            const ctx = this._ctx;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
            this._parseListeners.forEach(function (listener: any) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                listener.enterEveryRule(ctx);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                ctx.enterRule(listener);
            });
        }
    }

    /**
     * Notify any parse listeners of an exit rule event.
     * @see //addParseListener
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    triggerExitRuleEvent() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._parseListeners !== null) {
            // reverse order walk of listeners
            // eslint-disable-next-line no-underscore-dangle
            const ctx = this._ctx;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
            this._parseListeners.slice(0).reverse().forEach(function (listener: any) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                ctx.exitRule(listener);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                listener.exitEveryRule(ctx);
            });
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getTokenFactory() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._input.tokenSource._factory;
    }

    // Tell our token source and error strategy about a new way to create tokens.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    setTokenFactory(factory: any) {
        // eslint-disable-next-line no-underscore-dangle
        this._input.tokenSource._factory = factory;
    }

    /**
     * The ATN with bypass alternatives is expensive to create so we create it
     * lazily.
     *
     * @throws UnsupportedOperationException if the current parser does not
     * implement the {@link //getSerializedATN()} method.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getATNWithBypassAlts() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const serializedAtn = this.getSerializedATN();
        if (serializedAtn === null) {
            // eslint-disable-next-line no-throw-literal
            throw "The current parser does not support an ATN with bypass alternatives.";
        }
        let result = this.bypassAltsAtnCache[serializedAtn];
        if (result === null) {
            // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
            const deserializationOptions = new ATNDeserializationOptions();
            deserializationOptions.generateRuleBypassTransitions = true;
            result = new ATNDeserializer(deserializationOptions)
                .deserialize(serializedAtn);
            this.bypassAltsAtnCache[serializedAtn] = result;
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get tokenStream() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._input;
    }

    // Set the token stream and reset the parser.
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set tokenStream(input) {
        // eslint-disable-next-line no-underscore-dangle
        this._input = null;
        this.reset();
        // eslint-disable-next-line no-underscore-dangle
        this._input = input;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get inputStream() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._input;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    set inputStream(input) {
        this.tokenStream = input;
    }

    /**
     * Gets the number of syntax errors reported during parsing. This value is
     * incremented each time {@link //notifyErrorListeners} is called.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get syntaxErrorsCount() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._syntaxErrors;
    }

// eslint-disable-next-line no-multiple-empty-lines

    /**
     * Match needs to return the current input symbol, which gets put
     * into the label for the associated token ref; e.g., x=ID.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getCurrentToken() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, no-underscore-dangle
        return this._input.LT(1);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    notifyErrorListeners(msg: any, offendingToken: any, err: any) {
        offendingToken = offendingToken || null;
        err = err || null;
        if (offendingToken === null) {
            offendingToken = this.getCurrentToken();
        }
        // eslint-disable-next-line no-underscore-dangle
        this._syntaxErrors += 1;
        const line = offendingToken.line;
        const column = offendingToken.column;
        const listener = this.getErrorListenerDispatch();
        listener.syntaxError(this, offendingToken, line, column, msg, err);
    }

    /**
     * Consume and return the {@link //getCurrentToken current symbol}.
     *
     * <p>E.g., given the following input with {@code A} being the current
     * lookahead symbol, this function moves the cursor to {@code B} and returns
     * {@code A}.</p>
     *
     * <pre>
     * A B
     * ^
     * </pre>
     *
     * If the parser is not in error recovery mode, the consumed symbol is added
     * to the parse tree using {@link ParserRuleContext//addChild(Token)}, and
     * {@link ParseTreeListener//visitTerminal} is called on any parse listeners.
     * If the parser <em>is</em> in error recovery mode, the consumed symbol is
     * added to the parse tree using
     * {@link ParserRuleContext//addErrorNode(Token)}, and
     * {@link ParseTreeListener//visitErrorNode} is called on any parse
     * listeners.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    consume() {
        const o = this.getCurrentToken();
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (o.type !== Token.EOF) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.tokenStream.consume();
        }
        // eslint-disable-next-line no-underscore-dangle
        const hasListener = this._parseListeners !== null && this._parseListeners.length > 0;
        if (this.buildParseTrees || hasListener) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let node: any;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (this.errorHandler.inErrorRecoveryMode(this)) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                node = this._ctx.addErrorNode(o);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                node = this._ctx.addTokenNode(o);
            }
            node.invokingState = this.state;
            if (hasListener) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
                this._parseListeners.forEach(function (listener: any) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    if (node instanceof ErrorNode || (node.isErrorNode !== undefined && node.isErrorNode())) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        listener.visitErrorNode(node);
                    } else if (node instanceof TerminalNode) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        listener.visitTerminal(node);
                    }
                });
            }
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return o;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    addContextToParseTree() {
        // add current context to parent if we have a parent
        // eslint-disable-next-line no-underscore-dangle
        if (this._ctx.parent !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
            this._ctx.parent.addChild(this._ctx);
        }
    }

    /**
     * Always called by generated parsers upon entry to a rule. Access field
     * {@link //_ctx} get the current context.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    enterRule(localctx: any, state: any, ruleIndex: any) {
        this.state = state;
        // eslint-disable-next-line no-underscore-dangle
        this._ctx = localctx;
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-call
        this._ctx.start = this._input.LT(1);
        if (this.buildParseTrees) {
            this.addContextToParseTree();
        }
        this.triggerEnterRuleEvent();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    exitRule() {
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-call
        this._ctx.stop = this._input.LT(-1);
        // trigger event on _ctx, before it reverts to parent
        this.triggerExitRuleEvent();
        // eslint-disable-next-line no-underscore-dangle
        this.state = this._ctx.invokingState;
        // eslint-disable-next-line no-underscore-dangle
        this._ctx = this._ctx.parent;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    enterOuterAlt(localctx: any, altNum: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        localctx.setAltNumber(altNum);
        // if we have new localctx, make sure we replace existing ctx
        // that is previous child of parse tree
        // eslint-disable-next-line no-underscore-dangle
        if (this.buildParseTrees && this._ctx !== localctx) {
            // eslint-disable-next-line no-underscore-dangle
            if (this._ctx.parent !== null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this._ctx.parent.removeLastChild();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this._ctx.parent.addChild(localctx);
            }
        }
        // eslint-disable-next-line no-underscore-dangle
        this._ctx = localctx;
    }

    /**
     * Get the precedence level for the top-most precedence rule.
     *
     * @return The precedence level for the top-most precedence rule, or -1 if
     * the parser context is not nested within a precedence rule.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getPrecedence() {
        // eslint-disable-next-line no-underscore-dangle
        if (this._precedenceStack.length === 0) {
            return -1;
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
            return this._precedenceStack[this._precedenceStack.length - 1];
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    enterRecursionRule(localctx: any, state: any, ruleIndex: any, precedence: any) {
        this.state = state;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        this._precedenceStack.push(precedence);
        // eslint-disable-next-line no-underscore-dangle
        this._ctx = localctx;
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-call
        this._ctx.start = this._input.LT(1);
        this.triggerEnterRuleEvent(); // simulates rule entry for left-recursive rules
    }

    // Like {@link //enterRule} but for recursive rules.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    pushNewRecursionContext(localctx: any, state: any, ruleIndex: any) {
        // eslint-disable-next-line no-underscore-dangle
        const previous = this._ctx;
        // eslint-disable-next-line no-underscore-dangle
        previous._parent = localctx;
        previous.invokingState = state;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        previous.stop = this._input.LT(-1);

        // eslint-disable-next-line no-underscore-dangle
        this._ctx = localctx;
        // eslint-disable-next-line no-underscore-dangle
        this._ctx.start = previous.start;
        if (this.buildParseTrees) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
            this._ctx.addChild(previous);
        }
        this.triggerEnterRuleEvent(); // simulates rule entry for left-recursive rules
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    unrollRecursionContexts(parent: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
        this._precedenceStack.pop();
        // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unsafe-call
        this._ctx.stop = this._input.LT(-1);
        // eslint-disable-next-line no-underscore-dangle
        const retCtx = this._ctx; // save current ctx (return value)
        // unroll so _ctx is as it was before call to recursive method
        const parseListeners = this.getParseListeners();
        if (parseListeners !== null && parseListeners.length > 0) {
            // eslint-disable-next-line no-underscore-dangle
            while (this._ctx !== parent) {
                this.triggerExitRuleEvent();
                // eslint-disable-next-line no-underscore-dangle
                this._ctx = this._ctx.parent;
            }
        } else {
            // eslint-disable-next-line no-underscore-dangle
            this._ctx = parent;
        }
        // hook into tree
        // eslint-disable-next-line no-underscore-dangle
        retCtx._parent = parent;
        if (this.buildParseTrees && parent !== null) {
            // add return ctx into invoking rule's tree
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            parent.addChild(retCtx);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getInvokingContext(ruleIndex: any) {
        // eslint-disable-next-line no-underscore-dangle
        let ctx = this._ctx;
        while (ctx !== null) {
            if (ctx.ruleIndex === ruleIndex) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return ctx;
            }
            ctx = ctx.parent;
        }
        // eslint-disable-next-line padding-line-between-statements
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    precpred(localctx: any, precedence: any) {
        // eslint-disable-next-line no-underscore-dangle
        return precedence >= this._precedenceStack[this._precedenceStack.length - 1];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    inContext(context: any) {
        // TODO: useful in parser?
        return false;
    }

    /**
     * Checks whether or not {@code symbol} can follow the current state in the
     * ATN. The behavior of this method is equivalent to the following, but is
     * implemented such that the complete context-sensitive follow set does not
     * need to be explicitly constructed.
     *
     * <pre>
     * return getExpectedTokens().contains(symbol);
     * </pre>
     *
     * @param symbol the symbol type to check
     * @return {@code true} if {@code symbol} can follow the current state in
     * the ATN, otherwise {@code false}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    isExpectedToken(symbol: any) {
        const atn = this.interpreter.atn;
        // eslint-disable-next-line no-underscore-dangle
        let ctx = this._ctx;
        const s = atn.states[this.state];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        let following = atn.nextTokens(s);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (following.contains(symbol)) {
            return true;
        }
        // @ts-expect-error TS(2339): Property 'EPSILON' does not exist on type 'typeof ... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (!following.contains(Token.EPSILON)) {
            return false;
        }
        // @ts-expect-error TS(2339): Property 'EPSILON' does not exist on type 'typeof ... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        while (ctx !== null && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
            const invokingState = atn.states[ctx.invokingState];
            const rt = invokingState.transitions[0];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            following = atn.nextTokens(rt.followState);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (following.contains(symbol)) {
                return true;
            }
            ctx = ctx.parent;
        }
        // @ts-expect-error TS(2339): Property 'EPSILON' does not exist on type 'typeof ... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (following.contains(Token.EPSILON) && symbol === Token.EOF) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Computes the set of input symbols which could follow the current parser
     * state and context, as given by {@link //getState} and {@link //getContext},
     * respectively.
     *
     * @see ATN//getExpectedTokens(int, RuleContext)
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getExpectedTokens() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, no-underscore-dangle
        return this.interpreter.atn.getExpectedTokens(this.state, this._ctx);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getExpectedTokensWithinCurrentRule() {
        const atn = this.interpreter.atn;
        const s = atn.states[this.state];
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return atn.nextTokens(s);
    }

    // Get a rule's index (i.e., {@code RULE_ruleName} field) or -1 if not found.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getRuleIndex(ruleName: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const ruleIndex = this.getRuleIndexMap().get(ruleName);
        if (ruleIndex !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return ruleIndex;
        } else {
            return -1;
        }
    }

    /**
     * Return List&lt;String&gt; of the rule names in your parser instance
     * leading up to a call to the current rule. You could override if
     * you want more details such as the file/line info of where
     * in the ATN a rule is invoked.
     *
     * this is very useful for error messages.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getRuleInvocationStack(p: any) {
        p = p || null;
        if (p === null) {
            // eslint-disable-next-line no-underscore-dangle
            p = this._ctx;
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
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return stack;
    }

    // For debugging and other purposes.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getDFAStrings() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return this.interpreter.decisionToDFA.toString();
    }

    // For debugging and other purposes.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    dumpDFA() {
        let seenOne = false;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.interpreter.decisionToDFA.length; i++) {
            const dfa = this.interpreter.decisionToDFA[i];
            if (dfa.states.length > 0) {
                if (seenOne) {
                    console.log();
                }
                console.log("Decision " + dfa.decision + ":");
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                console.log(dfa.toString(this.vocabulary));
                seenOne = true;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getSourceName() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._input.sourceName;
    }

    /**
     * During a parse is sometimes useful to listen in on the rule entry and exit
     * events as well as token matches. this is for quick and dirty debugging.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    setTrace(trace: any) {
        if (!trace) {
            // eslint-disable-next-line no-underscore-dangle
            this.removeParseListener(this._tracer);
            // eslint-disable-next-line no-underscore-dangle
            this._tracer = null;
        } else {
            // eslint-disable-next-line no-underscore-dangle
            if (this._tracer !== null) {
                // eslint-disable-next-line no-underscore-dangle
                this.removeParseListener(this._tracer);
            }
            // eslint-disable-next-line no-underscore-dangle
            this._tracer = new TraceListener(this);
            // eslint-disable-next-line no-underscore-dangle
            this.addParseListener(this._tracer);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    createTerminalNode(parent: any, t: any) {
        return new TerminalNodeImpl(t);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    createErrorNode(parent: any, t: any) {
        return new ErrorNodeImpl(t);
    }
}

/**
 * this field maps from the serialized ATN string to the deserialized {@link ATN} with
 * bypass alternatives.
 *
 * @see ATNDeserializationOptions//isGenerateRuleBypassTransitions()
 */
// @ts-expect-error TS(2339): Property 'bypassAltsAtnCache' does not exist on ty... Remove this comment to see the full error message
Parser.bypassAltsAtnCache = {};
