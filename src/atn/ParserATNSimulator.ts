/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle, jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */

import { NoViableAltException } from "../NoViableAltException.js";
import { Token } from "../Token.js";
import { DFAState } from "../dfa/DFAState.js";
import { BitSet } from "../misc/BitSet.js";
import { HashSet } from "../misc/HashSet.js";
import { DoubleDict } from "../utils/DoubleDict.js";
import { ATN } from "./ATN.js";
import { ATNConfig } from "./ATNConfig.js";
import { ATNConfigSet } from "./ATNConfigSet.js";
import { ATNSimulator } from "./ATNSimulator.js";
import { ActionTransition } from "./ActionTransition.js";
import { AtomTransition } from "./AtomTransition.js";
import { NotSetTransition } from "./NotSetTransition.js";
import { PredictionContext } from "./PredictionContext.js";
import { predictionContextFromRuleContext } from "./PredictionContextUtils.js";
import { PredictionMode } from "./PredictionMode.js";
import { RuleStopState } from "./RuleStopState.js";
import { RuleTransition } from "./RuleTransition.js";
import { SemanticContext } from "./SemanticContext.js";
import { SetTransition } from "./SetTransition.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";
import { Vocabulary } from "../Vocabulary.js";

import { Parser } from "../Parser.js";
import { DFA } from "../dfa/DFA.js";
import { PredictionContextCache } from "./PredictionContextCache.js";
import { TokenStream } from "../TokenStream.js";
import { ParserRuleContext } from "../ParserRuleContext.js";
import { DecisionState } from "./DecisionState.js";
import { ATNState } from "./ATNState.js";
import { Transition } from "./Transition.js";

import type { EpsilonTransition } from "./EpsilonTransition.js";
import type { StarLoopEntryState } from "./StarLoopEntryState.js";
import type { BlockStartState } from "./BlockStartState.js";
import type { PrecedencePredicateTransition } from "./PrecedencePredicateTransition.js";
import type { PredicateTransition } from "./PredicateTransition.js";
import { PredPrediction } from "../dfa/PredPrediction.js";

/** Comprises the input values for the current prediction run. */
interface PredictionState {
    input?: TokenStream;
    startIndex: number;
    outerContext?: ParserRuleContext,
    dfa?: DFA,

}

/**
 * The embodiment of the adaptive LL(*), ALL(*), parsing strategy.
 *
 * The basic complexity of the adaptive strategy makes it harder to understand.
 * We begin with ATN simulation to build paths in a DFA. Subsequent prediction
 * requests go through the DFA first. If they reach a state without an edge for
 * the current symbol, the algorithm fails over to the ATN simulation to
 * complete the DFA path for the current input (until it finds a conflict state
 * or uniquely predicting state).
 *
 * All of that is done without using the outer context because we want to create
 * a DFA that is not dependent upon the rule invocation stack when we do a
 * prediction. One DFA works in all contexts. We avoid using context not
 * necessarily because it's slower, although it can be, but because of the DFA
 * caching problem. The closure routine only considers the rule invocation stack
 * created during prediction beginning in the decision rule. For example, if
 * prediction occurs without invoking another rule's ATN, there are no context
 * stacks in the configurations. When lack of context leads to a conflict, we
 * don't know if it's an ambiguity or a weakness in the strong LL(*) parsing
 * strategy (versus full LL(*)).
 *
 * When SLL yields a configuration set with conflict, we rewind the input and
 * retry the ATN simulation, this time using full outer context without adding
 * to the DFA. Configuration context stacks will be the full invocation stacks
 * from the start rule. If we get a conflict using full context, then we can
 * definitively say we have a true ambiguity for that input sequence. If we
 * don't get a conflict, it implies that the decision is sensitive to the outer
 * context. (It is not context-sensitive in the sense of context-sensitive
 * grammars.)
 *
 * The next time we reach this DFA state with an SLL conflict, through DFA
 * simulation, we will again retry the ATN simulation using full context mode.
 * This is slow because we can't save the results and have to "interpret" the
 * ATN each time we get that input.
 *
 * **CACHING FULL CONTEXT PREDICTIONS**
 *
 * We could cache results from full context to predicted alternative easily and
 * that saves a lot of time but doesn't work in presence of predicates. The set
 * of visible predicates from the ATN start state changes depending on the
 * context, because closure can fall off the end of a rule. I tried to cache
 * tuples (stack context, semantic context, predicted alt) but it was slower
 * than interpreting and much more complicated. Also required a huge amount of
 * memory. The goal is not to create the world's fastest parser anyway. I'd like
 * to keep this algorithm simple. By launching multiple threads, we can improve
 * the speed of parsing across a large number of files.
 *
 * There is no strict ordering between the amount of input used by SLL vs LL,
 * which makes it really hard to build a cache for full context. Let's say that
 * we have input A B C that leads to an SLL conflict with full context X. That
 * implies that using X we might only use A B but we could also use A B C D to
 * resolve conflict. Input A B C D could predict alternative 1 in one position
 * in the input and A B C E could predict alternative 2 in another position in
 * input. The conflicting SLL configurations could still be non-unique in the
 * full context prediction, which would lead us to requiring more input than the
 * original A B C.	To make a	prediction cache work, we have to track	the exact
 * input	used during the previous prediction. That amounts to a cache that maps
 * X to a specific DFA for that context.
 *
 * Something should be done for left-recursive expression predictions. They are
 * likely LL(1) + pred eval. Easier to do the whole SLL unless error and retry
 * with full LL thing Sam does.
 *
 * **AVOIDING FULL CONTEXT PREDICTION**
 *
 * We avoid doing full context retry when the outer context is empty, we did not
 * dip into the outer context by falling off the end of the decision state rule,
 * or when we force SLL mode.
 *
 * As an example of the not dip into outer context case, consider as super
 * constructor calls versus function calls. One grammar might look like
 * this:
 *
 * ```
 * ctorBody
 *   : '{' superCall? stat* '}'
 *   ;
 * ```
 *
 * Or, you might see something like
 *
 * ```
 * stat
 *   : superCall ';'
 *   | expression ';'
 *   | ...
 *   ;
 * ```
 *
 * In both cases I believe that no closure operations will dip into the outer
 * context. In the first case ctorBody in the worst case will stop at the '}'.
 * In the 2nd case it should stop at the ';'. Both cases should stay within the
 * entry rule and not dip into the outer context.
 *
 * **PREDICATES**
 *
 * Predicates are always evaluated if present in either SLL or LL both. SLL and
 * LL simulation deals with predicates differently. SLL collects predicates as
 * it performs closure operations like ANTLR v3 did. It delays predicate
 * evaluation until it reaches and accept state. This allows us to cache the SLL
 * ATN simulation whereas, if we had evaluated predicates on-the-fly during
 * closure, the DFA state configuration sets would be different and we couldn't
 * build up a suitable DFA.
 *
 * When building a DFA accept state during ATN simulation, we evaluate any
 * predicates and return the sole semantically valid alternative. If there is
 * more than 1 alternative, we report an ambiguity. If there are 0 alternatives,
 * we throw an exception. Alternatives without predicates act like they have
 * true predicates. The simple way to think about it is to strip away all
 * alternatives with false predicates and choose the minimum alternative that
 * remains.
 *
 * When we start in the DFA and reach an accept state that's predicated, we test
 * those and return the minimum semantically viable alternative. If no
 * alternatives are viable, we throw an exception.
 *
 * During full LL ATN simulation, closure always evaluates predicates and
 * on-the-fly. This is crucial to reducing the configuration set size during
 * closure. It hits a landmine when parsing with the Java grammar, for example,
 * without this on-the-fly evaluation.
 *
 * **SHARING DFA**
 *
 * All instances of the same parser share the same decision DFAs through a
 * static field. Each instance gets its own ATN simulator but they share the
 * same {@link decisionToDFA} field. They also share a
 * {@link PredictionContextCache} object that makes sure that all
 * {@link PredictionContext} objects are shared among the DFA states. This makes
 * a big size difference.
 *
 * **THREAD SAFETY**
 *
 * The {@link ParserATNSimulator} locks on the {@link decisionToDFA} field when
 * it adds a new DFA object to that array. {@link addDFAEdge}
 * locks on the DFA for the current decision when setting the
 * {@link DFAState.edges} field. {@link addDFAState} locks on
 * the DFA for the current decision when looking up a DFA state to see if it
 * already exists. We must make sure that all requests to add DFA states that
 * are equivalent result in the same shared DFA object. This is because lots of
 * threads will be trying to update the DFA at once. The
 * {@link addDFAState} method also locks inside the DFA lock
 * but this time on the shared context cache when it rebuilds the
 * configurations' {@link PredictionContext} objects using cached
 * subgraphs/nodes. No other locking occurs, even during DFA simulation. This is
 * safe as long as we can guarantee that all threads referencing
 * `s.edge[t]` get the same physical target {@link DFAState}, or
 * `null`. Once into the DFA, the DFA simulation does not reference the
 * {@link DFA.states} map. It follows the {@link DFAState.edges} field to new
 * targets. The DFA simulator will either find {@link DFAState.edges} to be
 * `null`, to be non-`null` and `dfa.edges[t]` null, or
 * `dfa.edges[t]` to be non-null. The
 * {@link addDFAEdge} method could be racing to set the field
 * but in either case the DFA simulator works; if `null`, and requests ATN
 * simulation. It could also race trying to get `dfa.edges[t]`, but either
 * way it will work because it's not doing a test and set operation.
 *
 * **Starting with SLL then failing to combined SLL/LL (Two-Stage
 * Parsing)**
 *
 * Sam pointed out that if SLL does not give a syntax error, then there is no
 * point in doing full LL, which is slower. We only have to try LL if we get a
 * syntax error. For maximum speed, Sam starts the parser set to pure SLL
 * mode with the {@link BailErrorStrategy}:
 *
 * ```
 * parser.{@link Parser.getInterpreter() getInterpreter()}.{@link setPredictionMode setPredictionMode}`(`
 * {@link PredictionMode.SLL}`)`;
 * parser.{@link Parser.setErrorHandler setErrorHandler}(new {@link BailErrorStrategy}());
 * ```
 *
 * If it does not get a syntax error, then we're done. If it does get a syntax
 * error, we need to retry with the combined SLL/LL strategy.
 *
 * The reason this works is as follows. If there are no SLL conflicts, then the
 * grammar is SLL (at least for that input set). If there is an SLL conflict,
 * the full LL analysis must yield a set of viable alternatives which is a
 * subset of the alternatives reported by SLL. If the LL set is a singleton,
 * then the grammar is LL but not SLL. If the LL set is the same size as the SLL
 * set, the decision is SLL. If the LL set has size > 1, then that decision
 * is truly ambiguous on the current input. If the LL set is smaller, then the
 * SLL conflict resolution might choose an alternative that the full LL would
 * rule out as a possibility based upon better context information. If that's
 * the case, then the SLL parse will definitely get an error because the full LL
 * analysis says it's not viable. If SLL conflict resolution chooses an
 * alternative within the LL set, them both SLL and LL would choose the same
 * alternative because they both choose the minimum of multiple conflicting
 * alternatives.
 *
 * Let's say we have a set of SLL conflicting alternatives `{1, 2, 3`} and
 * a smaller LL set called *s*. If *s* is `{2, 3`}, then SLL
 * parsing will get an error because SLL will pursue alternative 1. If
 * s* is `{1, 2`} or `{1, 3`} then both SLL and LL will
 * choose the same alternative because alternative one is the minimum of either
 * set. If *s* is `{2`} or `{3`} then SLL will get a syntax
 * error. If *s* is `{1`} then SLL will succeed.
 *
 * Of course, if the input is invalid, then we will get an error for sure in
 * both SLL and LL parsing. Erroneous input will therefore require 2 passes over
 * the input.
 */
export class ParserATNSimulator extends ATNSimulator {
    /** SLL, LL, or LL + exact ambig detection? */
    public predictionMode: number;
    public readonly decisionToDFA: DFA[];

    protected readonly parser: Parser;

    /**
     * Each prediction operation uses a cache for merge of prediction contexts.
     * Don't keep around as it wastes huge amounts of memory. DoubleKeyMap
     * isn't synchronized but we're ok since two threads shouldn't reuse same
     * parser/atn sim object because it can only handle one input at a time.
     * This maps graphs a and b to merged result c. (a,b)->c. We can avoid
     * the merge if we ever see a and b again.  Note that (b,a)->c should
     * also be examined during cache lookup.
     */
    protected mergeCache = new DoubleDict<PredictionContext, PredictionContext, PredictionContext>();

    // Used also in the profiling ATN simulator.
    protected predictionState: PredictionState | undefined;

    public constructor(recog: Parser, atn: ATN, decisionToDFA: DFA[], sharedContextCache?: PredictionContextCache) {
        super(atn, sharedContextCache);
        this.parser = recog;
        this.decisionToDFA = decisionToDFA;
    }

    private static getUniqueAlt(configs: ATNConfigSet): number {
        let alt = ATN.INVALID_ALT_NUMBER;
        for (const c of configs) {
            if (alt === ATN.INVALID_ALT_NUMBER) {
                alt = c.alt; // found first alt
            } else if (c.alt !== alt) {
                return ATN.INVALID_ALT_NUMBER;
            }
        }

        return alt;
    }

    public reset(): void { }

    public override clearDFA(): void {
        for (let d = 0; d < this.decisionToDFA.length; d++) {
            this.decisionToDFA[d] = new DFA(this.atn.getDecisionState(d), d);
        }
    }

    // TODO: make outerContext an optional parameter, not optional null.
    public adaptivePredict(input: TokenStream, decision: number, outerContext: ParserRuleContext | null): number {
        const dfa = this.decisionToDFA[decision];
        this.predictionState = {
            input,
            startIndex: input.index,
            outerContext: outerContext ?? undefined,
            dfa,
        };

        const m = input.mark();
        const index = input.index;

        // Now we are certain to have a specific decision's DFA
        // But, do we still need an initial state?
        try {
            let s0;
            if (dfa.isPrecedenceDfa) {
                // the start state for a precedence DFA depends on the current
                // parser precedence, and is provided by a DFA method.
                s0 = dfa.getPrecedenceStartState(this.parser.getPrecedence());
            } else {
                // the start state for a "regular" DFA is just s0
                s0 = dfa.s0;
            }

            if (!s0) {
                if (!outerContext) {
                    outerContext = ParserRuleContext.empty;
                }

                const fullCtx = false;
                let s0_closure = this.computeStartState(dfa.atnStartState!, ParserRuleContext.empty, fullCtx);

                if (dfa.isPrecedenceDfa) {
                    // If this is a precedence DFA, we use applyPrecedenceFilter
                    // to convert the computed start state to a precedence start
                    // state. We then use DFA.setPrecedenceStartState to set the
                    // appropriate start state for the precedence level rather
                    // than simply setting DFA.s0.
                    s0_closure = this.applyPrecedenceFilter(s0_closure);
                    s0 = this.addDFAState(dfa, DFAState.fromConfigs(s0_closure));
                    dfa.setPrecedenceStartState(this.parser.getPrecedence(), s0);
                } else {
                    s0 = this.addDFAState(dfa, DFAState.fromConfigs(s0_closure));
                    dfa.s0 = s0;
                }
            }
            const alt = this.execATN(dfa, s0, input, index, outerContext!);

            return alt;
        } finally {
            this.predictionState.dfa = undefined;
            this.mergeCache = new DoubleDict(); // Wack cache after each prediction.
            input.seek(index);
            input.release(m);
        }
    }

    /**
     * Performs ATN simulation to compute a predicted alternative based
     *  upon the remaining input, but also updates the DFA cache to avoid
     *  having to traverse the ATN again for the same input sequence.
     *
     * There are some key conditions we're looking for after computing a new
     * set of ATN configs (proposed DFA state):
     *       if the set is empty, there is no viable alternative for current symbol
     *       does the state uniquely predict an alternative?
     *       does the state have a conflict that would prevent us from
     *         putting it on the work list?
     *
     * We also have some key operations to do:
     *       add an edge from previous DFA state to potentially new DFA state, D,
     *         upon current symbol but only if adding to work list, which means in all
     *         cases except no viable alternative (and possibly non-greedy decisions?)
     *       collecting predicates and adding semantic context to DFA accept states
     *       adding rule context to context-sensitive DFA accept states
     *       consuming an input symbol
     *       reporting a conflict
     *       reporting an ambiguity
     *       reporting a context sensitivity
     *       reporting insufficient predicates
     *
     * cover these cases:
     *    dead end
     *    single alt
     *    single alt + preds
     *    conflict
     *    conflict + preds
     */
    public execATN(dfa: DFA, s0: DFAState, input: TokenStream, startIndex: number,
        outerContext: ParserRuleContext): number {

        let alt: number;
        let previousState = s0;

        let t = input.LA(1);
        while (true) {
            let nextState = this.getExistingTargetState(previousState, t);
            if (!nextState) {
                nextState = this.computeTargetState(dfa, previousState, t);
            }

            if (nextState === ATNSimulator.ERROR) {
                // if any configs in previous dipped into outer context, that
                // means that input up to t actually finished entry rule
                // at least for SLL decision. Full LL doesn't dip into outer
                // so don't need special case.
                // We will get an error no matter what so delay until after
                // decision; better error message. Also, no reachable target
                // ATN states in SLL implies LL will also get nowhere.
                // If conflict in states that dip out, choose min since we
                // will get error no matter what.
                const e = this.noViableAlt(input, outerContext, previousState.configs, startIndex);
                input.seek(startIndex);
                alt = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(previousState.configs, outerContext);
                if (alt !== ATN.INVALID_ALT_NUMBER) {
                    return alt;
                } else {
                    throw e;
                }
            }
            if (nextState.requiresFullContext && this.predictionMode !== PredictionMode.SLL) {
                // IF PREDS, MIGHT RESOLVE TO SINGLE ALT => SLL (or syntax error)
                let conflictingAlts: BitSet | null = null;
                if (nextState.predicates !== null) {
                    const conflictIndex = input.index;
                    if (conflictIndex !== startIndex) {
                        input.seek(startIndex);
                    }
                    conflictingAlts = this.evalSemanticContext(nextState.predicates, outerContext, true);
                    if (conflictingAlts.length === 1) {

                        return conflictingAlts.nextSetBit(0)!;
                    }
                    if (conflictIndex !== startIndex) {
                        // restore the index so reporting the fallback to full
                        // context occurs with the index at the correct spot
                        input.seek(conflictIndex);
                    }
                }

                const fullCtx = true;
                const s0_closure = this.computeStartState(dfa.atnStartState!, outerContext, fullCtx);
                this.reportAttemptingFullContext(dfa, conflictingAlts!, nextState.configs, startIndex, input.index);
                alt = this.execATNWithFullContext(dfa, nextState, s0_closure, input, startIndex, outerContext);

                return alt;
            }

            if (nextState.isAcceptState) {
                if (nextState.predicates === null) {
                    return nextState.prediction;
                }

                const stopIndex = input.index;
                input.seek(startIndex);
                const alts = this.evalSemanticContext(nextState.predicates, outerContext, true);
                if (alts.length === 0) {
                    throw this.noViableAlt(input, outerContext, nextState.configs, startIndex);
                }

                if (alts.length === 1) {
                    return alts.nextSetBit(0)!;
                }

                // Report ambiguity after predicate evaluation to make sure the correct set of ambig alts is reported.
                this.reportAmbiguity(dfa, nextState, startIndex, stopIndex, false, alts, nextState.configs);

                return alts.nextSetBit(0)!;

            }
            previousState = nextState;

            if (t !== Token.EOF) {
                input.consume();
                t = input.LA(1);
            }
        }
    }

    /**
     * Get an existing target state for an edge in the DFA. If the target state
     * for the edge has not yet been computed or is otherwise not available,
     * this method returns `null`.
     *
     * @param previousD The current DFA state
     * @param t The next input symbol
     * @returns The existing target DFA state for the given input symbol
     * `t`, or `null` if the target state for this edge is not
     * already cached
     */
    public getExistingTargetState(previousD: DFAState, t: number): DFAState | undefined {
        return previousD.edges[t + 1];
    }

    /**
     * Compute a target state for an edge in the DFA, and attempt to add the
     * computed state and corresponding edge to the DFA.
     *
     * @param dfa The DFA
     * @param previousD The current DFA state
     * @param t The next input symbol
     *
     * @returns The computed target DFA state for the given input symbol
     * `t`. If `t` does not lead to a valid DFA state, this method
     * returns {@link ERROR
     */
    public computeTargetState(dfa: DFA, previousD: DFAState, t: number): DFAState {
        const reach = this.computeReachSet(previousD.configs, t, false);
        if (reach === null) {
            this.addDFAEdge(dfa, previousD, t, ATNSimulator.ERROR);

            return ATNSimulator.ERROR;
        }

        // create new target state; we'll add to DFA after it's complete
        let D = DFAState.fromConfigs(reach);

        const predictedAlt = ParserATNSimulator.getUniqueAlt(reach);

        if (predictedAlt !== ATN.INVALID_ALT_NUMBER) {
            // NO CONFLICT, UNIQUELY PREDICTED ALT
            D.isAcceptState = true;
            D.configs.uniqueAlt = predictedAlt;
            D.prediction = predictedAlt;
        } else if (PredictionMode.hasSLLConflictTerminatingPrediction(this.predictionMode, reach)) {
            // MORE THAN ONE VIABLE ALTERNATIVE
            D.configs.conflictingAlts = this.getConflictingAlts(reach);
            D.requiresFullContext = true;
            // in SLL-only mode, we will stop at this state and return the minimum alt
            D.isAcceptState = true;
            D.prediction = D.configs.conflictingAlts.nextSetBit(0)!;
        }
        if (D.isAcceptState && D.configs.hasSemanticContext) {
            this.predicateDFAState(D, this.atn.getDecisionState(dfa.decision)!);
            if (D.predicates !== null) {
                D.prediction = ATN.INVALID_ALT_NUMBER;
            }
        }
        // all adds to dfa are done after we've created full D state
        D = this.addDFAEdge(dfa, previousD, t, D)!;

        return D;
    }

    public getRuleName(index: number): string {
        if (this.parser !== null && index >= 0) {
            return this.parser.ruleNames[index];
        } else {
            return "<rule " + index + ">";
        }
    }

    public getTokenName(t: number): string {
        if (t === Token.EOF) {
            return "EOF";
        }

        const vocabulary = this.parser?.vocabulary ?? Vocabulary.EMPTY_VOCABULARY;
        const displayName = vocabulary.getDisplayName(t)!;
        if (displayName === t.toString()) {
            return displayName;
        }

        return displayName + "<" + t + ">";
    }

    public getLookaheadName(input: TokenStream): string {
        return this.getTokenName(input.LA(1));
    }

    /**
     * Used for debugging in adaptivePredict around execATN but I cut
     * it out for clarity now that alg. works well. We can leave this
     * "dead" code for a bit
     */
    public dumpDeadEndConfigs(e: NoViableAltException): void {
        console.log("dead end configs: ");
        const decs = e.deadEndConfigs!;
        for (const c of decs) {
            let trans = "no edges";
            if (c.state.transitions.length > 0) {
                const t = c.state.transitions[0];
                if (t instanceof AtomTransition) {
                    trans = "Atom " + this.getTokenName(t.labelValue);
                } else if (t instanceof SetTransition) {
                    const neg = (t instanceof NotSetTransition);
                    trans = (neg ? "~" : "") + "Set " + t.label;
                }
            }
            console.error(c.toString(this.parser, true) + ":" + trans);
        }
    }

    protected predicateDFAState(dfaState: DFAState, decisionState: DecisionState): void {
        // We need to test all predicates, even in DFA states that
        // uniquely predict alternative.
        const altCount = decisionState.transitions.length;
        // Update DFA so reach becomes accept state with (predicate,alt)
        // pairs if preds found for conflicting alts
        const altsToCollectPredsFrom = this.getConflictingAltsOrUniqueAlt(dfaState.configs)!;
        const altToPred = this.getPredsForAmbigAlts(altsToCollectPredsFrom, dfaState.configs, altCount);
        if (altToPred !== null) {
            dfaState.predicates = this.getPredicatePredictions(altsToCollectPredsFrom, altToPred);
            dfaState.prediction = ATN.INVALID_ALT_NUMBER; // make sure we use preds
        } else {
            // There are preds in configs but they might go away
            // when OR'd together like {p}? || NONE == NONE. If neither
            // alt has preds, resolve to min alt
            dfaState.prediction = altsToCollectPredsFrom.nextSetBit(0)!;
        }
    }

    // comes back with reach.uniqueAlt set to a valid alt
    protected execATNWithFullContext(dfa: DFA, D: DFAState, // how far we got before failing over
        s0: ATNConfigSet, input: TokenStream, startIndex: number, outerContext: ParserRuleContext): number {
        const fullCtx = true;
        let foundExactAmbig = false;
        let reach;
        let previous = s0;
        input.seek(startIndex);
        let t = input.LA(1);
        let predictedAlt = -1;
        for (; ;) { // while more work
            reach = this.computeReachSet(previous, t, fullCtx);
            if (reach === null) {
                // if any configs in previous dipped into outer context, that
                // means that input up to t actually finished entry rule
                // at least for LL decision. Full LL doesn't dip into outer
                // so don't need special case.
                // We will get an error no matter what so delay until after
                // decision; better error message. Also, no reachable target
                // ATN states in SLL implies LL will also get nowhere.
                // If conflict in states that dip out, choose min since we
                // will get error no matter what.
                const e = this.noViableAlt(input, outerContext, previous, startIndex);
                input.seek(startIndex);
                const alt = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(previous, outerContext);
                if (alt !== ATN.INVALID_ALT_NUMBER) {
                    return alt;
                } else {
                    throw e;
                }
            }
            const altSubSets = PredictionMode.getConflictingAltSubsets(reach);
            reach.uniqueAlt = ParserATNSimulator.getUniqueAlt(reach);

            // unique prediction?
            if (reach.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
                predictedAlt = reach.uniqueAlt;
                break;
            } else if (this.predictionMode !== PredictionMode.LL_EXACT_AMBIG_DETECTION) {
                predictedAlt = PredictionMode.resolvesToJustOneViableAlt(altSubSets);
                if (predictedAlt !== ATN.INVALID_ALT_NUMBER) {
                    break;
                }
            } else {
                // In exact ambiguity mode, we never try to terminate early.
                // Just keeps scarfing until we know what the conflict is
                if (PredictionMode.allSubsetsConflict(altSubSets) && PredictionMode.allSubsetsEqual(altSubSets)) {
                    foundExactAmbig = true;
                    predictedAlt = PredictionMode.getSingleViableAlt(altSubSets);
                    break;
                }
                // else there are multiple non-conflicting subsets or
                // we're not sure what the ambiguity is yet.
                // So, keep going.
            }
            previous = reach;
            if (t !== Token.EOF) {
                input.consume();
                t = input.LA(1);
            }
        }
        // If the configuration set uniquely predicts an alternative,
        // without conflict, then we know that it's a full LL decision
        // not SLL.
        if (reach.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
            this.reportContextSensitivity(dfa, predictedAlt, reach, startIndex, input.index);

            return predictedAlt;
        }
        // We do not check predicates here because we have checked them
        // on-the-fly when doing full context prediction.

        //
        // In non-exact ambiguity detection mode, we might	actually be able to
        // detect an exact ambiguity, but I'm not going to spend the cycles
        // needed to check. We only emit ambiguity warnings in exact ambiguity
        // mode.
        //
        // For example, we might know that we have conflicting configurations.
        // But, that does not mean that there is no way forward without a
        // conflict. It's possible to have nonconflicting alt subsets as in:

        // altSubSets=[{1, 2}, {1, 2}, {1}, {1, 2}]

        // from
        //
        //    [(17,1,[5 $]), (13,1,[5 10 $]), (21,1,[5 10 $]), (11,1,[$]),
        //     (13,2,[5 10 $]), (21,2,[5 10 $]), (11,2,[$])]
        //
        // In this case, (17,1,[5 $]) indicates there is some next sequence that
        // would resolve this without conflict to alternative 1. Any other viable
        // next sequence, however, is associated with a conflict.  We stop
        // looking for input because no amount of further lookahead will alter
        // the fact that we should predict alternative 1.  We just can't say for
        // sure that there is an ambiguity without looking further.

        this.reportAmbiguity(dfa, D, startIndex, input.index, foundExactAmbig, undefined, reach);

        return predictedAlt;
    }

    protected computeReachSet(closure: ATNConfigSet, t: number, fullCtx: boolean): ATNConfigSet | null {
        const intermediate = new ATNConfigSet(fullCtx);

        // Configurations already in a rule stop state indicate reaching the end
        // of the decision rule (local context) or end of the start rule (full
        // context). Once reached, these configurations are never updated by a
        // closure operation, so they are handled separately for the performance
        // advantage of having a smaller intermediate set when calling closure.
        //
        // For full-context reach operations, separate handling is required to
        // ensure that the alternative matching the longest overall sequence is
        // chosen when multiple such configurations can match the input.

        let skippedStopStates = null;

        // First figure out where we can reach on input t
        for (const c of closure) {
            if (c.state instanceof RuleStopState) {
                if (fullCtx || t === Token.EOF) {
                    if (skippedStopStates === null) {
                        skippedStopStates = [];
                    }
                    skippedStopStates.push(c);
                }
                continue;
            }

            for (const trans of c.state.transitions) {
                const target = this.getReachableTarget(trans, t);
                if (target !== null) {
                    const cfg = ATNConfig.createWithConfig(target, c);
                    intermediate.add(cfg, this.mergeCache);
                }
            }
        }

        // Now figure out where the reach operation can take us...
        let reach: ATNConfigSet | null = null;

        // This block optimizes the reach operation for intermediate sets which
        // trivially indicate a termination state for the overall
        // adaptivePredict operation.
        //
        // The conditions assume that intermediate
        // contains all configurations relevant to the reach set, but this
        // condition is not true when one or more configurations have been
        // withheld in skippedStopStates, or when the current symbol is EOF.
        if (skippedStopStates === null && t !== Token.EOF) {
            if (intermediate.length === 1) {
                // Don't pursue the closure if there is just one state.
                // It can only have one alternative; just add to result
                // Also don't pursue the closure if there is unique alternative
                // among the configurations.
                reach = intermediate;
            } else if (ParserATNSimulator.getUniqueAlt(intermediate) !== ATN.INVALID_ALT_NUMBER) {
                // Also don't pursue the closure if there is unique alternative
                // among the configurations.
                reach = intermediate;
            }
        }

        // If the reach set could not be trivially determined, perform a closure
        // operation on the intermediate set to compute its initial value.
        if (reach === null) {
            reach = new ATNConfigSet(fullCtx);
            const closureBusy = new HashSet<ATNConfig>();
            const treatEofAsEpsilon = t === Token.EOF;
            for (const config of intermediate) {
                this.closure(config, reach, closureBusy, false, fullCtx, treatEofAsEpsilon);
            }
        }

        if (t === Token.EOF) {
            // After consuming EOF no additional input is possible, so we are
            // only interested in configurations which reached the end of the
            // decision rule (local context) or end of the start rule (full
            // context). Update reach to contain only these configurations. This
            // handles both explicit EOF transitions in the grammar and implicit
            // EOF transitions following the end of the decision or start rule.
            //
            // When reach==intermediate, no closure operation was performed. In
            // this case, removeAllConfigsNotInRuleStopState needs to check for
            // reachable rule stop states as well as configurations already in
            // a rule stop state.
            //
            // This is handled before the configurations in skippedStopStates,
            // because any configurations potentially added from that list are
            // already guaranteed to meet this condition whether or not it's
            // required.
            //
            reach = this.removeAllConfigsNotInRuleStopState(reach, reach === intermediate);
        }
        // If skippedStopStates!==null, then it contains at least one
        // configuration. For full-context reach operations, these
        // configurations reached the end of the start rule, in which case we
        // only add them back to reach if no configuration during the current
        // closure operation reached such a state. This ensures adaptivePredict
        // chooses an alternative matching the longest overall sequence when
        // multiple alternatives are viable.
        //
        if (skippedStopStates !== null && ((!fullCtx) || (!PredictionMode.hasConfigInRuleStopState(reach)))) {
            for (const config of skippedStopStates) {
                reach.add(config, this.mergeCache);
            }
        }

        if (reach.length === 0) {
            return null;
        } else {
            return reach;
        }
    }

    /**
     * Return a configuration set containing only the configurations from
     * `configs` which are in a {@link RuleStopState}. If all
     * configurations in `configs` are already in a rule stop state, this
     * method simply returns `configs`.
     *
     * When `lookToEndOfRule` is true, this method uses
     * {@link ATN.nextTokens} for each configuration in `configs` which is
     * not already in a rule stop state to see if a rule stop state is reachable
     * from the configuration via epsilon-only transitions.
     *
     * @param configs the configuration set to update
     * @param lookToEndOfRule when true, this method checks for rule stop states
     * reachable by epsilon-only transitions from each configuration in
     * `configs`.
     *
     * @returns `configs` if all configurations in `configs` are in a
     * rule stop state, otherwise return a new configuration set containing only
     * the configurations from `configs` which are in a rule stop state
     */
    protected removeAllConfigsNotInRuleStopState(configs: ATNConfigSet, lookToEndOfRule: boolean): ATNConfigSet {
        if (PredictionMode.allConfigsInRuleStopStates(configs)) {
            return configs;
        }

        const result = new ATNConfigSet(configs.fullCtx);
        for (const config of configs) {
            if (config.state instanceof RuleStopState) {
                result.add(config, this.mergeCache);
                continue;
            }

            if (lookToEndOfRule && config.state.epsilonOnlyTransitions) {
                const nextTokens = this.atn.nextTokens(config.state);
                if (nextTokens.contains(Token.EPSILON)) {
                    const endOfRuleState = this.atn.ruleToStopState[config.state.ruleIndex]!;
                    result.add(ATNConfig.createWithConfig(endOfRuleState, config), this.mergeCache);
                }
            }
        }

        return result;
    }

    protected computeStartState(p: ATNState, ctx: ParserRuleContext, fullCtx: boolean): ATNConfigSet {
        // always at least the implicit call to start rule
        const initialContext = predictionContextFromRuleContext(this.atn, ctx);
        const configs = new ATNConfigSet(fullCtx);

        for (let i = 0; i < p.transitions.length; i++) {
            const target = p.transitions[i].target;
            const c = ATNConfig.createWithContext(target, i + 1, initialContext);
            const closureBusy = new HashSet<ATNConfig>();
            this.closure(c, configs, closureBusy, true, fullCtx, false);
        }

        return configs;
    }

    /**
     * This method transforms the start state computed by
     * {@link computeStartState} to the special start state used by a
     * precedence DFA for a particular precedence value. The transformation
     * process applies the following changes to the start state's configuration
     * set.
     *
     * 1. Evaluate the precedence predicates for each configuration using
     * {@link SemanticContext//evalPrecedence}.
     * 2. Remove all configurations which predict an alternative greater than
     * 1, for which another configuration that predicts alternative 1 is in the
     * same ATN state with the same prediction context. This transformation is
     * valid for the following reasons:
     * 3. The closure block cannot contain any epsilon transitions which bypass
     * the body of the closure, so all states reachable via alternative 1 are
     * part of the precedence alternatives of the transformed left-recursive
     * rule.
     * 4. The "primary" portion of a left recursive rule cannot contain an
     * epsilon transition, so the only way an alternative other than 1 can exist
     * in a state that is also reachable via alternative 1 is by nesting calls
     * to the left-recursive rule, with the outer calls not being at the
     * preferred precedence level.
     *
     *
     * The prediction context must be considered by this filter to address
     * situations like the following.
     *
     * `
     * ```
     * grammar TA;
     * prog: statement* EOF;
     * statement: letterA | statement letterA 'b' ;
     * letterA: 'a';
     * ```
     * `
     *
     * If the above grammar, the ATN state immediately before the token
     * reference `'a'` in `letterA` is reachable from the left edge
     * of both the primary and closure blocks of the left-recursive rule
     * `statement`. The prediction context associated with each of these
     * configurations distinguishes between them, and prevents the alternative
     * which stepped out to `prog` (and then back in to `statement`
     * from being eliminated by the filter.
     *
     * @param configs The configuration set computed by
     * {@link computeStartState} as the start state for the DFA.
     * @returns The transformed configuration set representing the start state
     * for a precedence DFA at a particular precedence level (determined by
     * calling {@link Parser//getPrecedence})
     */
    protected applyPrecedenceFilter(configs: ATNConfigSet): ATNConfigSet {
        const statesFromAlt1 = [];
        const configSet = new ATNConfigSet(configs.fullCtx);
        for (const config of configs) {
            // handle alt 1 first
            if (config.alt !== 1) {
                continue;
            }
            const updatedContext = config.semanticContext.evalPrecedence(this.parser,
                this.predictionState!.outerContext);
            if (updatedContext === null) {
                // the configuration was eliminated
                continue;
            }
            statesFromAlt1[config.state.stateNumber] = config.context;
            if (updatedContext !== config.semanticContext) {
                configSet.add(ATNConfig.duplicate(config, updatedContext), this.mergeCache);
            } else {
                configSet.add(config, this.mergeCache);
            }
        }

        for (const config of configs) {
            if (config.alt === 1) {
                // already handled
                continue;
            }
            // In the future, this elimination step could be updated to also
            // filter the prediction context for alternatives predicting alt>1
            // (basically a graph subtraction algorithm).
            if (!config.precedenceFilterSuppressed) {
                const context = statesFromAlt1[config.state.stateNumber] || null;
                if (context !== null && context.equals(config.context)) {
                    // eliminated
                    continue;
                }
            }
            configSet.add(config, this.mergeCache);
        }

        return configSet;
    }

    protected getReachableTarget(trans: Transition, ttype: number): ATNState | null {
        if (trans.matches(ttype, 0, this.atn.maxTokenType)) {
            return trans.target;
        } else {
            return null;
        }
    }

    protected getPredsForAmbigAlts(ambigAlts: BitSet, configs: ATNConfigSet,
        altCount: number): Array<SemanticContext | null> | null {
        // REACH=[1|1|[]|0:0, 1|2|[]|0:1]
        // altToPred starts as an array of all null contexts. The entry at index i
        // corresponds to alternative i. altToPred[i] may have one of three values:
        //   1. null: no ATNConfig c is found such that c.alt==i
        //   2. SemanticContext.NONE: At least one ATNConfig c exists such that
        //      c.alt==i and c.semanticContext==SemanticContext.NONE. In other words,
        //      alt i has at least one unpredicated config.
        //   3. Non-NONE Semantic Context: There exists at least one, and for all
        //      ATNConfig c such that c.alt==i, c.semanticContext!=SemanticContext.NONE.
        //
        // From this, it is clear that NONE||anything==NONE.
        //
        let altToPred: Array<SemanticContext | null> | null = [];
        for (const c of configs) {
            if (ambigAlts.get(c.alt)) {
                altToPred[c.alt] = SemanticContext.orContext(altToPred[c.alt] ?? null, c.semanticContext);
            }
        }
        let nPredAlts = 0;
        for (let i = 1; i < altCount + 1; i++) {
            const pred = altToPred[i] ?? null;
            if (pred === null) {
                altToPred[i] = SemanticContext.NONE;
            } else if (pred !== SemanticContext.NONE) {
                nPredAlts += 1;
            }
        }

        // non-ambig alts are null in altToPred
        if (nPredAlts === 0) {
            altToPred = null;
        }

        return altToPred;
    }

    protected getPredicatePredictions(ambigAlts: BitSet,
        altToPred: Array<SemanticContext | null>): PredPrediction[] | null {
        const pairs: PredPrediction[] = [];
        let containsPredicate = false;
        for (let i = 1; i < altToPred.length; i++) {
            const pred = altToPred[i]!;
            // un-predicated is indicated by SemanticContext.NONE
            if (ambigAlts.get(i)) {
                pairs.push({ pred, alt: i });
            }

            if (pred !== SemanticContext.NONE) {
                containsPredicate = true;
            }
        }

        if (!containsPredicate) {
            return null;
        }

        return pairs;
    }

    /**
     * This method is used to improve the localization of error messages by
     * choosing an alternative rather than throwing a
     * {@link NoViableAltException} in particular prediction scenarios where the
     * {@link ERROR} state was reached during ATN simulation.
     *
     *
     * The default implementation of this method uses the following
     * algorithm to identify an ATN configuration which successfully parsed the
     * decision entry rule. Choosing such an alternative ensures that the
     * {@link ParserRuleContext} returned by the calling rule will be complete
     * and valid, and the syntax error will be reported later at a more
     * localized location.
     *
     * - If a syntactically valid path or paths reach the end of the decision rule and
     * they are semantically valid if predicated, return the min associated alt.
     * - Else, if a semantically invalid but syntactically valid path exist
     * or paths exist, return the minimum associated alt.
     *
     * - Otherwise, return {@link ATN//INVALID_ALT_NUMBER}.
     *
     *
     * In some scenarios, the algorithm described above could predict an
     * alternative which will result in a {@link FailedPredicateException} in
     * the parser. Specifically, this could occur if the *only* configuration
     * capable of successfully parsing to the end of the decision rule is
     * blocked by a semantic predicate. By choosing this alternative within
     * {@link adaptivePredict} instead of throwing a
     * {@link NoViableAltException}, the resulting
     * {@link FailedPredicateException} in the parser will identify the specific
     * predicate which is preventing the parser from successfully parsing the
     * decision rule, which helps developers identify and correct logic errors
     * in semantic predicates.
     *
     * @param configs The ATN configurations which were valid immediately before
     * the {@link ERROR} state was reached
     * @param outerContext The is the \gamma_0 initial parser context from the paper
     * or the parser stack at the instant before prediction commences.
     *
     * @returns The value to return from {@link adaptivePredict}, or
     * {@link ATN//INVALID_ALT_NUMBER} if a suitable alternative was not
     * identified and {@link adaptivePredict} should report an error instead
     */
    protected getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(configs: ATNConfigSet,
        outerContext: ParserRuleContext): number {
        const splitConfigs = this.splitAccordingToSemanticValidity(configs, outerContext);
        const semValidConfigs = splitConfigs[0];
        const semInvalidConfigs = splitConfigs[1];
        let alt = this.getAltThatFinishedDecisionEntryRule(semValidConfigs);
        if (alt !== ATN.INVALID_ALT_NUMBER) { // semantically/syntactically viable path exists
            return alt;
        }

        // Is there a syntactically valid path with a failed pred?
        if (semInvalidConfigs.length > 0) {
            alt = this.getAltThatFinishedDecisionEntryRule(semInvalidConfigs);
            if (alt !== ATN.INVALID_ALT_NUMBER) { // syntactically viable path exists
                return alt;
            }
        }

        return ATN.INVALID_ALT_NUMBER;
    }

    protected getAltThatFinishedDecisionEntryRule(configs: ATNConfigSet): number {
        const alts = [];
        for (const c of configs) {
            if (c.reachesIntoOuterContext || ((c.state instanceof RuleStopState) && c.context!.hasEmptyPath())) {
                if (alts.indexOf(c.alt) < 0) {
                    alts.push(c.alt);
                }
            }
        }
        if (alts.length === 0) {
            return ATN.INVALID_ALT_NUMBER;
        } else {
            return Math.min(...alts);
        }
    }

    /**
     * Walk the list of configurations and split them according to
     * those that have preds evaluating to true/false.  If no pred, assume
     * true pred and include in succeeded set.  Returns Pair of sets.
     *
     * Create a new set so as not to alter the incoming parameter.
     *
     * Assumption: the input stream has been restored to the starting point
     * prediction, which is where predicates need to evaluate.
     */
    protected splitAccordingToSemanticValidity(configs: ATNConfigSet,
        outerContext: ParserRuleContext): [ATNConfigSet, ATNConfigSet] {
        const succeeded = new ATNConfigSet(configs.fullCtx);
        const failed = new ATNConfigSet(configs.fullCtx);

        for (const c of configs) {
            if (c.semanticContext !== SemanticContext.NONE) {
                const predicateEvaluationResult = c.semanticContext.evaluate(this.parser, outerContext);
                if (predicateEvaluationResult) {
                    succeeded.add(c);
                } else {
                    failed.add(c);
                }
            } else {
                succeeded.add(c);
            }
        }

        return [succeeded, failed];
    }

    /**
     * Look through a list of predicate/alt pairs, returning alts for the
     * pairs that win. A `NONE` predicate indicates an alt containing an
     * unpredicated config which behaves as "always true." If !complete
     * then we stop at the first predicate that evaluates to true. This
     * includes pairs with null predicates.
     */
    protected evalSemanticContext(predPredictions: PredPrediction[], outerContext: ParserRuleContext,
        complete: boolean): BitSet {
        const predictions = new BitSet();

        for (const pair of predPredictions) {
            if (pair.pred === SemanticContext.NONE) {
                predictions.set(pair.alt);
                if (!complete) {
                    break;
                }
                continue;
            }
            const predicateEvaluationResult = pair.pred.evaluate(this.parser, outerContext);

            if (predicateEvaluationResult) {
                predictions.set(pair.alt);
                if (!complete) {
                    break;
                }
            }
        }

        return predictions;
    }

    // TODO: If we are doing predicates, there is no point in pursuing
    //     closure operations if we reach a DFA state that uniquely predicts
    //     alternative. We will not be caching that DFA state and it is a
    //     waste to pursue the closure. Might have to advance when we do
    //     ambig detection thought :(
    //
    protected closure(config: ATNConfig, configs: ATNConfigSet, closureBusy: HashSet<ATNConfig>,
        collectPredicates: boolean, fullCtx: boolean, treatEofAsEpsilon: boolean): void {
        const initialDepth = 0;
        this.closureCheckingStopState(config, configs, closureBusy, collectPredicates,
            fullCtx, initialDepth, treatEofAsEpsilon);
    }

    protected closureCheckingStopState(config: ATNConfig, configs: ATNConfigSet, closureBusy: HashSet<ATNConfig>,
        collectPredicates: boolean, fullCtx: boolean, depth: number, treatEofAsEpsilon: boolean): void {
        if (config.state instanceof RuleStopState) {
            // We hit rule end. If we have context info, use it
            // run thru all possible stack tops in ctx
            if (config.context && !config.context.isEmpty()) {
                for (let i = 0; i < config.context.length; i++) {
                    if (config.context.getReturnState(i) === PredictionContext.EMPTY_RETURN_STATE) {
                        if (fullCtx) {
                            configs.add(ATNConfig.createWithConfig(config.state, config,
                                PredictionContext.EMPTY),
                                this.mergeCache);
                            continue;
                        } else {
                            // we have no context info, just chase follow links (if greedy)
                            this.closure_(config, configs, closureBusy, collectPredicates,
                                fullCtx, depth, treatEofAsEpsilon);
                        }
                        continue;
                    }

                    const returnState = this.atn.states[config.context.getReturnState(i)]!;
                    const newContext = config.context.getParent(i)!; // "pop" return state
                    const c = ATNConfig.createWithContext(returnState, config.alt, newContext, config.semanticContext);

                    // While we have context to pop back from, we may have
                    // gotten that context AFTER having falling off a rule.
                    // Make sure we track that we are now out of context.
                    c.reachesIntoOuterContext = config.reachesIntoOuterContext;
                    this.closureCheckingStopState(c, configs, closureBusy, collectPredicates, fullCtx, depth - 1,
                        treatEofAsEpsilon);
                }

                return;
            } else if (fullCtx) {
                // reached end of start rule
                configs.add(config, this.mergeCache);

                return;
            }
        }
        this.closure_(config, configs, closureBusy, collectPredicates, fullCtx, depth, treatEofAsEpsilon);
    }

    // Do the actual work of walking epsilon edges//
    protected closure_(config: ATNConfig, configs: ATNConfigSet, closureBusy: HashSet<ATNConfig>,
        collectPredicates: boolean, fullCtx: boolean, depth: number, treatEofAsEpsilon: boolean): void {
        const p = config.state;

        // Optimization.
        if (!p.epsilonOnlyTransitions) {
            configs.add(config, this.mergeCache);
            // Make sure to not return here, because EOF transitions can act as
            // both epsilon transitions and non-epsilon transitions.
        }

        for (let i = 0; i < p.transitions.length; i++) {
            if (i === 0 && this.canDropLoopEntryEdgeInLeftRecursiveRule(config)) {
                continue;
            }

            const t = p.transitions[i];
            const continueCollecting = collectPredicates && !(t instanceof ActionTransition);
            const c = this.getEpsilonTarget(config, t, continueCollecting, depth === 0, fullCtx, treatEofAsEpsilon);
            if (c) {
                let newDepth = depth;
                if ((config.state.constructor as typeof ATNState).stateType === ATNState.RULE_STOP) {
                    // target fell off end of rule; mark resulting c as having dipped into outer context
                    // We can't get here if incoming config was rule stop and we had context
                    // track how far we dip into outer context.  Might
                    // come in handy and we avoid evaluating context dependent
                    // preds if this is > 0.
                    if (this.predictionState!.dfa && this.predictionState?.dfa.isPrecedenceDfa) {
                        const outermostPrecedenceReturn = (t as EpsilonTransition).outermostPrecedenceReturn;
                        if (outermostPrecedenceReturn === this.predictionState?.dfa.atnStartState?.ruleIndex) {
                            c.precedenceFilterSuppressed = true;
                        }
                    }

                    c.reachesIntoOuterContext = true;
                    if (closureBusy.getOrAdd(c) !== c) {
                        // Avoid infinite recursion for right-recursive rules.
                        continue;
                    }

                    // TODO: can remove? only care when we add to set per middle of this method
                    configs.dipsIntoOuterContext = true;
                    newDepth -= 1;
                } else {
                    if (!t.isEpsilon && closureBusy.getOrAdd(c) !== c) {
                        // Avoid infinite recursion for EOF* and EOF+.
                        continue;
                    }

                    if (t instanceof RuleTransition) {
                        // Latch when newDepth goes negative - once we step out of the entry context we can't return.
                        if (newDepth >= 0) {
                            newDepth += 1;
                        }
                    }
                }
                this.closureCheckingStopState(c, configs, closureBusy, continueCollecting, fullCtx, newDepth,
                    treatEofAsEpsilon);
            }
        }
    }

    protected canDropLoopEntryEdgeInLeftRecursiveRule(config: ATNConfig): boolean {
        const p = config.state;
        // First check to see if we are in StarLoopEntryState generated during
        // left-recursion elimination. For efficiency, also check if
        // the context has an empty stack case. If so, it would mean
        // global FOLLOW so we can't perform optimization
        // Are we the special loop entry/exit state? or SLL wildcard
        if ((p.constructor as typeof ATNState).stateType !== ATNState.STAR_LOOP_ENTRY || !config.context) {
            return false;
        }

        if (!(p as StarLoopEntryState).precedenceRuleDecision ||
            config.context.isEmpty() || config.context.hasEmptyPath()) {
            return false;
        }

        // Require all return states to return back to the same rule that p is in.
        const numCtxs = config.context.length;
        for (let i = 0; i < numCtxs; i++) { // for each stack context
            const returnState = this.atn.states[config.context.getReturnState(i)];
            if (returnState!.ruleIndex !== p.ruleIndex) {
                return false;
            }
        }

        const decisionStartState = p.transitions[0].target as BlockStartState;
        const blockEndStateNum = decisionStartState.endState!.stateNumber;
        const blockEndState = this.atn.states[blockEndStateNum];

        // Verify that the top of each stack context leads to loop entry/exit
        // state through epsilon edges and w/o leaving rule.
        for (let i = 0; i < numCtxs; i++) { // for each stack context
            const returnStateNumber = config.context.getReturnState(i);
            const returnState = this.atn.states[returnStateNumber]!;
            // all states must have single outgoing epsilon edge
            if (returnState.transitions.length !== 1 || !returnState.transitions[0].isEpsilon) {
                return false;
            }

            // Look for prefix op case like 'not expr', (' type ')' expr
            const returnStateTarget = returnState.transitions[0].target;
            if ((returnState.constructor as typeof ATNState).stateType === ATNState.BLOCK_END
                && returnStateTarget === p) {
                continue;
            }

            // Look for 'expr op expr' or case where expr's return state is block end
            // of (...)* internal block; the block end points to loop back
            // which points to p but we don't need to check that
            if (returnState === blockEndState) {
                continue;
            }

            // Look for ternary expr ? expr : expr. The return state points at block end,
            // which points at loop entry state
            if (returnStateTarget === blockEndState) {
                continue;
            }

            // Look for complex prefix 'between expr and expr' case where 2nd expr's
            // return state points at block end state of (...)* internal block
            if ((returnStateTarget.constructor as typeof ATNState).stateType === ATNState.BLOCK_END
                && returnStateTarget.transitions.length === 1
                && returnStateTarget.transitions[0].isEpsilon && returnStateTarget.transitions[0].target === p) {
                continue;
            }

            // Anything else ain't conforming.
            return false;
        }

        return true;
    }

    protected getEpsilonTarget(config: ATNConfig, t: Transition, collectPredicates: boolean, inContext: boolean,
        fullCtx: boolean, treatEofAsEpsilon: boolean): ATNConfig | null {
        switch (t.transitionType) {
            case Transition.RULE:
                return this.ruleTransition(config, t as RuleTransition);
            case Transition.PRECEDENCE:
                return this.precedenceTransition(config, t as PrecedencePredicateTransition, collectPredicates,
                    inContext, fullCtx);
            case Transition.PREDICATE:
                return this.predTransition(config, t as PredicateTransition, collectPredicates, inContext, fullCtx);
            case Transition.ACTION:
                return ATNConfig.createWithConfig(t.target, config);
            case Transition.EPSILON:
                return ATNConfig.createWithConfig(t.target, config);
            case Transition.ATOM:
            case Transition.RANGE:
            case Transition.SET:
                // EOF transitions act like epsilon transitions after the first EOF
                // transition is traversed
                if (treatEofAsEpsilon) {
                    if (t.matches(Token.EOF, 0, 1)) {
                        return ATNConfig.createWithConfig(t.target, config);
                    }
                }

                return null;
            default:
                return null;
        }
    }

    protected precedenceTransition(config: ATNConfig, pt: PrecedencePredicateTransition, collectPredicates: boolean,
        inContext: boolean, fullCtx: boolean): ATNConfig | null {

        let c = null;
        if (collectPredicates && inContext) {
            if (fullCtx && this.predictionState?.input) {
                // In full context mode, we can evaluate predicates on-the-fly
                // during closure, which dramatically reduces the size of
                // the config sets. It also obviates the need to test predicates
                // later during conflict resolution.
                const currentPosition = this.predictionState.input.index;
                this.predictionState.input.seek(this.predictionState.startIndex);
                const predSucceeds = pt.getPredicate().evaluate(this.parser, this.predictionState.outerContext!);
                this.predictionState.input.seek(currentPosition);
                if (predSucceeds) {
                    c = ATNConfig.createWithConfig(pt.target, config); // no pred context
                }
            } else {
                const newSemCtx = SemanticContext.andContext(config.semanticContext, pt.getPredicate());
                c = ATNConfig.createWithSemanticContext(pt.target, config, newSemCtx);
            }
        } else {
            c = ATNConfig.createWithConfig(pt.target, config);
        }

        return c;
    }

    protected predTransition(config: ATNConfig, pt: PredicateTransition, collectPredicates: boolean, inContext: boolean,
        fullCtx: boolean): ATNConfig | null {

        let c = null;
        if (collectPredicates && ((pt.isCtxDependent && inContext) || !pt.isCtxDependent)) {
            if (fullCtx && this.predictionState?.input) {
                // In full context mode, we can evaluate predicates on-the-fly
                // during closure, which dramatically reduces the size of
                // the config sets. It also obviates the need to test predicates
                // later during conflict resolution.
                const currentPosition = this.predictionState.input.index;
                this.predictionState.input.seek(this.predictionState.startIndex);
                const predSucceeds = pt.getPredicate().evaluate(this.parser, this.predictionState.outerContext!);
                this.predictionState.input.seek(currentPosition);
                if (predSucceeds) {
                    c = ATNConfig.createWithConfig(pt.target, config); // no pred context
                }
            } else {
                const newSemCtx = SemanticContext.andContext(config.semanticContext, pt.getPredicate());
                c = ATNConfig.createWithSemanticContext(pt.target, config, newSemCtx);
            }
        } else {
            c = ATNConfig.createWithConfig(pt.target, config);
        }

        return c;
    }

    protected ruleTransition(config: ATNConfig, t: RuleTransition): ATNConfig {
        const returnState = t.followState;
        const newContext = SingletonPredictionContext.create(config.context ?? undefined, returnState.stateNumber);

        return ATNConfig.createWithConfig(t.target, config, newContext);
    }

    protected getConflictingAlts(configs: ATNConfigSet): BitSet {
        const altSets = PredictionMode.getConflictingAltSubsets(configs);

        return PredictionMode.getAlts(altSets);
    }

    /**
     * Sam pointed out a problem with the previous definition, v3, of
     * ambiguous states. If we have another state associated with conflicting
     * alternatives, we should keep going. For example, the following grammar
     *
     * s : (ID | ID ID?) ';' ;
     *
     * When the ATN simulation reaches the state before ';', it has a DFA
     * state that looks like: [12|1|[], 6|2|[], 12|2|[]]. Naturally
     * 12|1|[] and 12|2|[] conflict, but we cannot stop processing this node
     * because alternative to has another way to continue, via [6|2|[]].
     * The key is that we have a single state that has config's only associated
     * with a single alternative, 2, and crucially the state transitions
     * among the configurations are all non-epsilon transitions. That means
     * we don't consider any conflicts that include alternative 2. So, we
     * ignore the conflict between alts 1 and 2. We ignore a set of
     * conflicting alts when there is an intersection with an alternative
     * associated with a single alt state in the state -> config-list map.
     *
     * It's also the case that we might have two conflicting configurations but
     * also a 3rd nonconflicting configuration for a different alternative:
     * [1|1|[], 1|2|[], 8|3|[]]. This can come about from grammar:
     *
     * a : A | A | A B ;
     *
     * After matching input A, we reach the stop state for rule A, state 1.
     * State 8 is the state right before B. Clearly alternatives 1 and 2
     * conflict and no amount of further lookahead will separate the two.
     * However, alternative 3 will be able to continue and so we do not
     * stop working on this state. In the previous example, we're concerned
     * with states associated with the conflicting alternatives. Here alt
     * 3 is not associated with the conflicting configs, but since we can continue
     * looking for input reasonably, I don't declare the state done. We
     * ignore a set of conflicting alts when we have an alternative
     * that we still need to pursue
     */
    protected getConflictingAltsOrUniqueAlt(configs: ATNConfigSet): BitSet | null {
        let conflictingAlts;
        if (configs.uniqueAlt !== ATN.INVALID_ALT_NUMBER) {
            conflictingAlts = new BitSet();
            conflictingAlts.set(configs.uniqueAlt);
        } else {
            conflictingAlts = configs.conflictingAlts;
        }

        return conflictingAlts;
    }

    protected noViableAlt(input: TokenStream, outerContext: ParserRuleContext, configs: ATNConfigSet,
        startIndex: number): NoViableAltException {
        return new NoViableAltException(this.parser, input, input.get(startIndex), input.LT(1), configs, outerContext);
    }

    /**
     * Add an edge to the DFA, if possible. This method calls
     * {@link addDFAState} to ensure the `to` state is present in the
     * DFA. If `from` is `null`, or if `t` is outside the
     * range of edges that can be represented in the DFA tables, this method
     * returns without adding the edge to the DFA.
     *
     * If `to` is `null`, this method returns `null`.
     * Otherwise, this method returns the {@link DFAState} returned by calling
     * {@link addDFAState} for the `to` state.
     *
     * @param dfa The DFA
     * @param from The source state for the edge
     * @param t The input symbol
     * @param to The target state for the edge
     *
     * @returns If `to` is `null`, this method returns `null`;
     * otherwise this method returns the result of calling {@link addDFAState}
     * on `to`
     */
    protected addDFAEdge(dfa: DFA, from: DFAState, t: number, to: DFAState): DFAState | null {
        to = this.addDFAState(dfa, to); // used existing if possible not incoming
        if (t < -1 || t > this.atn.maxTokenType) {
            return to;
        }

        from.edges[t + 1] = to; // connect

        return to;
    }

    /**
     * Add state `D` to the DFA if it is not already present, and return
     * the actual instance stored in the DFA. If a state equivalent to `D`
     * is already in the DFA, the existing state is returned. Otherwise this
     * method returns `D` after adding it to the DFA.
     *
     * If `D` is {@link ERROR}, this method returns {@link ERROR} and
     * does not change the DFA.
     *
     * @param dfa The dfa
     * @param D The DFA state to add
     * @returns The state stored in the DFA. This will be either the existing
     * state if `D` is already in the DFA, or `D` itself if the
     * state was not already present
     */
    protected addDFAState(dfa: DFA, D: DFAState): DFAState {
        if (D === ATNSimulator.ERROR) {
            return D;
        }
        const existing = dfa.getState(D);
        if (existing !== null) {
            return existing;
        }

        if (!D.configs.readOnly) {
            D.configs.optimizeConfigs(this);
            D.configs.setReadonly(true);
        }

        dfa.addState(D);

        return D;
    }

    protected reportAttemptingFullContext(dfa: DFA, conflictingAlts: BitSet, configs: ATNConfigSet, startIndex: number,
        stopIndex: number): void {
        this.parser.errorListenerDispatch.reportAttemptingFullContext(this.parser, dfa, startIndex, stopIndex,
            conflictingAlts, configs);
    }

    protected reportContextSensitivity(dfa: DFA, prediction: number, configs: ATNConfigSet, startIndex: number,
        stopIndex: number): void {
        this.parser.errorListenerDispatch.reportContextSensitivity(this.parser, dfa, startIndex, stopIndex,
            prediction, configs);
    }

    // If context sensitive parsing, we know it's ambiguity not conflict.
    protected reportAmbiguity(dfa: DFA, D: DFAState, startIndex: number, stopIndex: number,
        exact: boolean, ambigAlts: BitSet | undefined, configs: ATNConfigSet): void {
        this.parser.errorListenerDispatch.reportAmbiguity(this.parser, dfa, startIndex, stopIndex, exact,
            ambigAlts, configs);
    }
}
