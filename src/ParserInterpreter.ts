/* eslint-disable max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNState } from "./atn/ATNState.js";
import { BitSet } from "./misc/BitSet.js";
import { FailedPredicateException } from "./FailedPredicateException.js";
import { InputMismatchException } from "./InputMismatchException.js";
import { InterpreterRuleContext } from "./InterpreterRuleContext.js";
import { LoopEndState } from "./atn/LoopEndState.js";
import { Parser } from "./Parser.js";
import { ParserATNSimulator } from "./atn/ParserATNSimulator.js";
import { RecognitionException } from "./RecognitionException.js";
import { StarLoopEntryState } from "./atn/StarLoopEntryState.js";
import { Token } from "./Token.js";
import { ATNStateType } from "./atn/ATNStateType.js";
import { TransitionType } from "./atn/TransitionType.js";
import { DFA } from "./dfa/DFA.js";
import { PredictionContextCache } from "./atn/PredictionContextCache.js";

export class ParserInterpreter extends Parser {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    action: any;
    #grammarFileName;
    #atn;
    #ruleNames;
    #vocabulary;
    #decisionToDFA;
    #sharedContextCache = new PredictionContextCache();

    #pushRecursionContextStates;

    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    _rootContext: any;

    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility
    _parentContextStack = [];

    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility
    overrideDecision = -1;
    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility
    overrideDecisionInputIndex = -1;
    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility
    overrideDecisionAlt = -1;
    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility
    overrideDecisionReached = false;

    // eslint-disable-next-line @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility
    _overrideDecisionRoot = undefined;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(grammarFileName: any, vocabulary: any, ruleNames: any, atn: any, input: any) {
        super(input);
        this.#grammarFileName = grammarFileName;
        this.#atn = atn;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.#ruleNames = ruleNames.slice(0);
        this.#vocabulary = vocabulary;

        // Cache the ATN states where pushNewRecursionContext() must be called in `visitState()`.
        this.#pushRecursionContextStates = new BitSet();
        // eslint-disable-next-line prefer-const
        for (let state of atn.states) {
            if (state instanceof StarLoopEntryState && state.precedenceRuleDecision) {
                this.#pushRecursionContextStates.set(state.stateNumber);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
        this.#decisionToDFA = atn.decisionToState.map(function (ds: any, i: any) {
            return new DFA(ds, i);
        });

        // get atn simulator that knows how to do predictions
        this.interpreter = new ParserATNSimulator(this, atn, this.#decisionToDFA, this.#sharedContextCache);
    }

    // @ts-expect-error TS(2416): Property 'reset' in type 'ParserInterpreter' is no... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    reset(resetInput: any) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        super.reset(resetInput);

        this.overrideDecisionReached = false;
        // eslint-disable-next-line no-underscore-dangle
        this._overrideDecisionRoot = undefined;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get atn() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#atn;
    }

    // @ts-expect-error TS(2611): 'vocabulary' is defined as a property in class 'Pa... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get vocabulary() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#vocabulary;
    }

    // @ts-expect-error TS(2611): 'ruleNames' is defined as a property in class 'Par... Remove this comment to see the full error message
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get ruleNames() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#ruleNames;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get grammarFileName() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#grammarFileName;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get atnState() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.#atn.states[this.state];
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    parse(startRuleIndex: any) {
        // eslint-disable-next-line prefer-const
        let startRuleStartState = this.#atn.ruleToStartState[startRuleIndex];

        // @ts-expect-error TS(2339): Property 'INVALID_STATE_NUMBER' does not exist on ... Remove this comment to see the full error message
        // eslint-disable-next-line no-underscore-dangle
        this._rootContext = this.createInterpreterRuleContext(undefined, ATNState.INVALID_STATE_NUMBER, startRuleIndex);
        if (startRuleStartState.isPrecedenceRule) {
            // eslint-disable-next-line no-underscore-dangle
            this.enterRecursionRule(this._rootContext, startRuleStartState.stateNumber, startRuleIndex, 0);
        }
        else {
            // eslint-disable-next-line no-underscore-dangle
            this.enterRule(this._rootContext, startRuleStartState.stateNumber, startRuleIndex);
        }

        while (true) {
            // eslint-disable-next-line prefer-const
            let p = this.atnState;
            switch (p.stateType) {
                case ATNStateType.RULE_STOP:
                    // pop; return from rule
                    // eslint-disable-next-line no-underscore-dangle
                    if (this._ctx.isEmpty) {
                        if (startRuleStartState.isPrecedenceRule) {
                            // eslint-disable-next-line prefer-const, no-underscore-dangle
                            let result = this._ctx;
                            // eslint-disable-next-line prefer-const, no-underscore-dangle
                            let parentContext = this._parentContextStack.pop();
                            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                            this.unrollRecursionContexts(parentContext[0]);
                            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
                            return result;
                        }
                        else {
                            this.exitRule();
                            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, no-underscore-dangle
                            return this._rootContext;
                        }
                    }

                    this.visitRuleStopState(p);
                    break;

                default:
                    try {
                        this.visitState(p);
                    }
                    catch (e) {
                        if (e instanceof RecognitionException) {
                            this.state = this.#atn.ruleToStopState[p.ruleIndex].stateNumber;
                            this.context.exception = e;
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                            this.errorHandler.reportError(this, e);
                            this.recover(e);
                        } else {
                            throw e;
                        }
                    }

                    break;
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    enterRecursionRule(localctx: any, state: any, ruleIndex: any, precedence: any) {
        // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
        // eslint-disable-next-line no-underscore-dangle
        this._parentContextStack.push([this._ctx, localctx.invokingState]);
        super.enterRecursionRule(localctx, state, ruleIndex, precedence);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    visitState(p: any) {
        let predictedAlt = 1;
        if (p.transitions.length > 1) {
            predictedAlt = this.visitDecisionState(p);
        }

        // eslint-disable-next-line prefer-const
        let transition = p.transitions[predictedAlt - 1];
        switch (transition.serializationType) {
            case TransitionType.EPSILON:
                if (this.#pushRecursionContextStates.get(p.stateNumber) &&
                    !(transition.target instanceof LoopEndState)) {
                    // We are at the start of a left recursive rule's (...)* loop
                    // and we're not taking the exit branch of loop.
                    // eslint-disable-next-line prefer-const, no-underscore-dangle
                    let parentContext = this._parentContextStack[this._parentContextStack.length - 1];
                    // eslint-disable-next-line prefer-const
                    let localctx =
                        // eslint-disable-next-line no-underscore-dangle
                        this.createInterpreterRuleContext(parentContext[0], parentContext[1], this._ctx.ruleIndex);
                    this.pushNewRecursionContext(localctx,
                        this.#atn.ruleToStartState[p.ruleIndex].stateNumber,
                        // eslint-disable-next-line no-underscore-dangle
                        this._ctx.ruleIndex);
                }
                break;

            case TransitionType.ATOM:
                this.match(transition.label.minElement);
                break;

            case TransitionType.RANGE:
            case TransitionType.SET:
            case TransitionType.NOT_SET:
                // @ts-expect-error TS(2339): Property 'MIN_USER_TOKEN_TYPE' does not exist on t... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                if (!transition.matches(this._input.LA(1), Token.MIN_USER_TOKEN_TYPE, 65535)) {
                    this.recoverInline();
                }
                this.matchWildcard();
                break;

            case TransitionType.WILDCARD:
                this.matchWildcard();
                break;

            case TransitionType.RULE:
                // eslint-disable-next-line prefer-const
                let ruleStartState = transition.target;
                // eslint-disable-next-line prefer-const
                let ruleIndex = ruleStartState.ruleIndex;
                // eslint-disable-next-line prefer-const, no-underscore-dangle
                let newContext = this.createInterpreterRuleContext(this._ctx, p.stateNumber, ruleIndex);
                if (ruleStartState.isPrecedenceRule) {
                    this.enterRecursionRule(newContext, ruleStartState.stateNumber, ruleIndex, (transition).precedence);
                }
                else {
                    this.enterRule(newContext, transition.target.stateNumber, ruleIndex);
                }
                break;

            case TransitionType.PREDICATE:
                // eslint-disable-next-line prefer-const
                let predicateTransition = transition;
                // eslint-disable-next-line no-underscore-dangle
                if (!this.sempred(this._ctx, predicateTransition.ruleIndex, predicateTransition.predIndex)) {
                    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
                    throw new FailedPredicateException(this);
                }

                break;

            case TransitionType.ACTION:
                // eslint-disable-next-line prefer-const
                let actionTransition = transition;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this.action(this._ctx, actionTransition.ruleIndex, actionTransition.actionIndex);
                break;

            case TransitionType.PRECEDENCE:
                // eslint-disable-next-line no-underscore-dangle
                if (!this.precpred(this._ctx, transition.precedence)) {
                    // eslint-disable-next-line prefer-const
                    let precedence = transition.precedence;
                    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
                    throw new FailedPredicateException(this, `precpred(_ctx, ${precedence})`);
                }
                break;

            default:
                throw new Error("UnsupportedOperationException: Unrecognized ATN transition type.");
        }

        this.state = transition.target.stateNumber;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    visitDecisionState(p: any) {
        let predictedAlt = 1;

        if (p.transitions.length > 1) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.errorHandler.sync(this);
            // eslint-disable-next-line prefer-const
            let decision = p.decision;
            // eslint-disable-next-line no-underscore-dangle
            if (decision === this.overrideDecision && this._input.index === this.overrideDecisionInputIndex &&
                !this.overrideDecisionReached) {
                predictedAlt = this.overrideDecisionAlt;
                this.overrideDecisionReached = true;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                predictedAlt = this.interpreter.adaptivePredict(this._input, decision, this._ctx);
            }
        }

        return predictedAlt;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    createInterpreterRuleContext(parent: any, invokingStateNumber: any, ruleIndex: any) {
        return new InterpreterRuleContext(ruleIndex, parent, invokingStateNumber);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    visitRuleStopState(p: any) {
        // eslint-disable-next-line prefer-const
        let ruleStartState = this.#atn.ruleToStartState[p.ruleIndex];
        if (ruleStartState.isPrecedenceRule) {
            // eslint-disable-next-line prefer-const, no-underscore-dangle
            let parentContext = this._parentContextStack.pop();
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            this.unrollRecursionContexts(parentContext[0]);
            // @ts-expect-error TS(2532): Object is possibly 'undefined'.
            this.state = parentContext[1];
        } else {
            this.exitRule();
        }

        // eslint-disable-next-line prefer-const
        let ruleTransition = this.#atn.states[this.state].transitions[0];
        this.state = ruleTransition.followState.stateNumber;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addDecisionOverride(decision: any, tokenIndex: any, forcedAlt: any) {
        this.overrideDecision = decision;
        this.overrideDecisionInputIndex = tokenIndex;
        this.overrideDecisionAlt = forcedAlt;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get overrideDecisionRoot() {
        // eslint-disable-next-line no-underscore-dangle
        return this._overrideDecisionRoot;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    recover(e: any) {
        // eslint-disable-next-line prefer-const, no-underscore-dangle
        let i = this._input.index;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.errorHandler.recover(this, e);
        // eslint-disable-next-line no-underscore-dangle
        if (this._input.index === i) {
            // no input consumed, better add an error node
            // eslint-disable-next-line prefer-const
            let tok = e.offendingToken;
            if (!tok) {
                throw new Error("Expected exception to have an offending token");
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const source = tok.getTokenSource();
            const stream = source?.inputStream ?? null;
            const sourcePair = [source, stream];

            if (e instanceof InputMismatchException) {
                // eslint-disable-next-line prefer-const
                let expectedTokens = e.getExpectedTokens();
                if (!expectedTokens) {
                    throw new Error("Expected the exception to provide expected tokens");
                }

                // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
                let expectedTokenType = Token.INVALID_TYPE;
                if (!expectedTokens.isNil) {
                    // get any element
                    expectedTokenType = expectedTokens.minElement;
                }

                // eslint-disable-next-line prefer-const
                let errToken =
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this.getTokenFactory().create(sourcePair,
                        expectedTokenType, tok.text,
                        // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
                        Token.DEFAULT_CHANNEL,
                        -1, -1, // invalid start/stop
                        tok.line, tok.charPositionInLine);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this._ctx.addErrorNode(this.createErrorNode(this._ctx, errToken));
            } else { // NoViableAlt
                // eslint-disable-next-line prefer-const
                let errToken =
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this.getTokenFactory().create(sourcePair,
                        // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
                        Token.INVALID_TYPE, tok.text,
                        // @ts-expect-error TS(2339): Property 'DEFAULT_CHANNEL' does not exist on type ... Remove this comment to see the full error message
                        Token.DEFAULT_CHANNEL,
                        -1, -1, // invalid start/stop
                        tok.line, tok.charPositionInLine);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
                this._ctx.addErrorNode(this.createErrorNode(this._ctx, errToken));
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    recoverInline() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return this.errorHandler.recoverInline(this);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get rootContext() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, no-underscore-dangle
        return this._rootContext;
    }
}
