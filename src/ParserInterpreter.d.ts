/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATN } from "./atn/ATN.js";
import { ATNState } from "./atn/ATNState.js";
import { BitSet } from "./misc/BitSet.js";
import { DecisionState } from "./atn/DecisionState.js";
import { InterpreterRuleContext } from "./InterpreterRuleContext.js";
import { Parser } from "./Parser.js";
import { RecognitionException } from "./RecognitionException.js";
import { Token } from "./Token.js";
import { TokenStream } from "./TokenStream.js";
import { Vocabulary } from "./Vocabulary.js";
import { ParserRuleContext } from "./ParserRuleContext.js";
import { RuleContext } from "./atn/RuleContext.js";

/**
 * A parser simulator that mimics what ANTLR's generated
 *  parser code does. A ParserATNSimulator is used to make
 *  predictions via adaptivePredict but this class moves a pointer through the
 *  ATN to simulate parsing. ParserATNSimulator just
 *  makes us efficient rather than having to backtrack, for example.
 *
 *  This properly creates parse trees even for left recursive rules.
 *
 *  We rely on the left recursive rule invocation and special predicate
 *  transitions to make left recursive rules work.
 *
 *  See TestParserInterpreter for examples.
 */
export abstract class ParserInterpreter extends Parser {
    /**
     * This identifies StarLoopEntryState's that begin the (...)*
     *  precedence loops of left recursive rules.
     */
    protected pushRecursionContextStates: BitSet;

    /**
     * This stack corresponds to the _parentctx, _parentState pair of locals
     *  that would exist on call stack frames with a recursive descent parser;
     *  in the generated function for a left-recursive rule you'd see:
     *
     *  private EContext e(int _p) {
     *      ParserRuleContext _parentctx = _ctx;    // Pair.a
     *      int _parentState = state;          // Pair.b
     *      ...
     *  }
     *
     *  Those values are used to create new recursive rule invocation contexts
     *  associated with left operand of an alt like "expr '*' expr".
     */
    protected readonly _parentContextStack: Array<[ParserRuleContext, number]>;

    /**
     * We need a map from (decision,inputIndex)->forced alt for computing ambiguous
     *  parse trees. For now, we allow exactly one override.
     */
    protected overrideDecision: number;
    protected overrideDecisionInputIndex: number;
    protected overrideDecisionAlt: number;
    protected overrideDecisionReached: boolean; // latch and only override once; error might trigger infinite loop

    /**
     * What is the current context when we override a decisions?  This tells
     *  us what the root of the parse tree is when using override
     *  for an ambiguity/lookahead check.
     */
    protected _overrideDecisionRoot?: InterpreterRuleContext;

    protected _rootContext: InterpreterRuleContext;

    /**
     * A copy constructor that creates a new parser interpreter by reusing
     *  the fields of a previous interpreter.
     *
     *  @param old The interpreter to copy
     */
    public constructor(old: ParserInterpreter);
    public constructor(grammarFileName: string, vocabulary: Vocabulary, ruleNames: string[], atn: ATN,
        input: TokenStream);
    public constructor(grammarFileName: ParserInterpreter | string, vocabulary?: Vocabulary,
        ruleNames?: string[], atn?: ATN, input?: TokenStream);

    public reset(resetInput?: boolean): void;

    public override get atn(): ATN;
    public override get vocabulary(): Vocabulary;
    public override get ruleNames(): string[];
    public override get grammarFileName(): string;

    /**
     * Begin parsing at startRuleIndex
     *
     * @param startRuleIndex the grammar rule to start parsing from
     *
     * @returns the parse tree for the entire input
     */
    public parse(startRuleIndex: number): ParserRuleContext;

    public enterRecursionRule(localctx: ParserRuleContext, state: number, ruleIndex: number, precedence: number): void;

    /**
     * Override this parser interpreters normal decision-making process
     *  at a particular decision and input token index. Instead of
     *  allowing the adaptive prediction mechanism to choose the
     *  first alternative within a block that leads to a successful parse,
     *  force it to take the alternative, 1..n for n alternatives.
     *
     *  As an implementation limitation right now, you can only specify one
     *  override. This is sufficient to allow construction of different
     *  parse trees for ambiguous input. It means re-parsing the entire input
     *  in general because you're never sure where an ambiguous sequence would
     *  live in the various parse trees. For example, in one interpretation,
     *  an ambiguous input sequence would be matched completely in expression
     *  but in another it could match all the way back to the root.
     *
     *  s : e '!'? ;
     *  e : ID
     *    | ID '!'
     *    ;
     *
     *  Here, x! can be matched as (s (e ID) !) or (s (e ID !)). In the first
     *  case, the ambiguous sequence is fully contained only by the root.
     *  In the second case, the ambiguous sequences fully contained within just
     *  e, as in: (e ID !).
     *
     *  Rather than trying to optimize this and make
     *  some intelligent decisions for optimization purposes, I settled on
     *  just re-parsing the whole input and then using
     *  {link Trees#getRootOfSubtreeEnclosingRegion} to find the minimal
     *  subtree that contains the ambiguous sequence. I originally tried to
     *  record the call stack at the point the parser detected and ambiguity but
     *  left recursive rules create a parse tree stack that does not reflect
     *  the actual call stack. That impedance mismatch was enough to make
     *  it it challenging to restart the parser at a deeply nested rule
     *  invocation.
     *
     *  Only parser interpreters can override decisions so as to avoid inserting
     *  override checking code in the critical ALL(*) prediction execution path.
     *
     * @param decision
     * @param tokenIndex
     * @param forcedAlt
     */
    public addDecisionOverride(decision: number, tokenIndex: number, forcedAlt: number): void;

    protected get atnState(): ATNState;

    protected visitState(p: ATNState): void;

    /**
     * Method visitDecisionState() is called when the interpreter reaches
     * a decision state (instance of DecisionState). It gives an opportunity
     * for subclasses to track interesting things.
     *
     * @param p : the decision state
     *
     * @returns The prediction made by the interpreter for this decision state.
     */
    protected visitDecisionState(p: DecisionState): number;

    /**
     * Provide simple "factory" for InterpreterRuleContext's.
     *
     * @param parent
     * @param invokingStateNumber
     * @param ruleIndex
     */
    protected createInterpreterRuleContext(parent: ParserRuleContext | undefined, invokingStateNumber: number,
        ruleIndex: number): InterpreterRuleContext;

    protected visitRuleStopState(p: ATNState): void;

    /**
     * Rely on the error handler for this parser but, if no tokens are consumed
     * to recover, add an error node. Otherwise, nothing is seen in the parse
     * tree.
     *
     * @param e
     */
    protected recover(e: RecognitionException): void;

    protected recoverInline(): Token;

    /**
     * Return the root of the parse, which can be useful if the parser
     *  bails out. You still can access the top node. Note that,
     *  because of the way left recursive rules add children, it's possible
     *  that the root will not have any children if the start rule immediately
     *  called and left recursive rule that fails.
     *
     * @since 4.5.1
     */
    public get rootContext(): InterpreterRuleContext;

    public abstract action(localctx: RuleContext | null, ruleIndex: number, actionIndex: number): void;
}
