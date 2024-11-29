/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import { Token } from "../Token.js";
import { Lexer, type LexerOptions } from "../Lexer.js";
import { ATN } from "./ATN.js";
import { ATNSimulator } from "./ATNSimulator.js";
import { DFAState } from "../dfa/DFAState.js";
import { OrderedATNConfigSet } from "./OrderedATNConfigSet.js";
import { PredictionContext } from "./PredictionContext.js";
import { SingletonPredictionContext } from "./SingletonPredictionContext.js";
import { LexerATNConfig } from "./LexerATNConfig.js";
import { LexerActionExecutor } from "./LexerActionExecutor.js";
import { LexerNoViableAltException } from "../LexerNoViableAltException.js";
import { DFA } from "../dfa/DFA.js";
import { PredictionContextCache } from "./PredictionContextCache.js";
import { CharStream } from "../CharStream.js";
import { ATNConfigSet } from "./ATNConfigSet.js";
import { Transition } from "./Transition.js";
import { ATNState } from "./ATNState.js";
import { RuleTransition } from "./RuleTransition.js";
import { PredicateTransition } from "./PredicateTransition.js";
import { ActionTransition } from "./ActionTransition.js";

/**
 * When we hit an accept state in either the DFA or the ATN, we
 * have to notify the character stream to start buffering characters
 * via {@link IntStream.mark} and record the current state. The current sim state
 * includes the current index into the input, the current line,
 * and current character position in that line. Note that the Lexer is
 * tracking the starting line and characterization of the token. These
 * variables track the "state" of the simulator when it hits an accept state.
 *
 * We track these variables separately for the DFA and ATN simulation
 * because the DFA simulation often has to fail over to the ATN
 * simulation. If the ATN simulation fails, we need the DFA to fall
 * back to its previously accepted state, if any. If the ATN succeeds,
 * then the ATN does the accept and the DFA simulator that invoked it
 * can simply return the predicted token type.
 */
interface SimState {
    index: number;
    line: number;
    column: number;
    dfaState: DFAState | null;
}

export class LexerATNSimulator extends ATNSimulator {
    public static debug = false;

    public readonly decisionToDFA: DFA[];

    public readonly recognizer: Lexer | null = null;

    /**
     * The current token's starting index into the character stream.
     *  Shared across DFA to ATN simulation in case the ATN fails and the
     *  DFA did not have a previous accept state. In this case, we use the
     *  ATN-generated exception object.
     */
    public startIndex = -1;

    /** line number 1..n within the input */
    public line = 1;

    /** The index of the character relative to the beginning of the line 0..n-1 */
    public column = 0;

    public mode: number = Lexer.DEFAULT_MODE;

    /** Used during DFA/ATN exec to record the most recent accept configuration info */
    #prevAccept: SimState | undefined;

    #options: LexerOptions;

    /** Lookup table for lexer ATN config creation. */
    #lexerATNConfigFactory: Array<(input: CharStream, config: LexerATNConfig, trans: Transition, configs: ATNConfigSet,
        speculative: boolean, treatEofAsEpsilon: boolean) => LexerATNConfig | null>;

    /**
     * When we hit an accept state in either the DFA or the ATN, we
     * have to notify the character stream to start buffering characters
     * via {@link IntStream//mark} and record the current state. The current sim state
     * includes the current index into the input, the current line,
     * and current character position in that line. Note that the Lexer is
     * tracking the starting line and characterization of the token. These
     * variables track the "state" of the simulator when it hits an accept state.
     *
     * We track these variables separately for the DFA and ATN simulation
     * because the DFA simulation often has to fail over to the ATN
     * simulation. If the ATN simulation fails, we need the DFA to fall
     * back to its previously accepted state, if any. If the ATN succeeds,
     * then the ATN does the accept and the DFA simulator that invoked it
     * can simply return the predicted token type.
     */
    public constructor(recog: Lexer | null, atn: ATN, decisionToDFA: DFA[],
        sharedContextCache?: PredictionContextCache) {
        super(atn, sharedContextCache);
        this.decisionToDFA = decisionToDFA;
        this.recognizer = recog;

        if (recog) {
            this.#options = recog.options;
        } else {
            this.#options = {
                minDFAEdge: 0,
                maxDFAEdge: 256,
                minCodePoint: 0,
                maxCodePoint: 0x10FFFF,
            };
        }
    }

    public match(input: CharStream, mode: number): number {
        this.mode = mode;
        const mark = input.mark();
        try {
            this.startIndex = input.index;
            this.#prevAccept = undefined;
            const dfa = this.decisionToDFA[mode];

            if (!dfa.s0) {
                return this.matchATN(input);
            }

            return this.execATN(input, dfa.s0);
        } finally {
            input.release(mark);
        }
    }

    public reset(): void {
        this.#prevAccept = undefined;
        this.startIndex = -1;
        this.line = 1;
        this.column = 0;
        this.mode = Lexer.DEFAULT_MODE;
    }

    public override clearDFA(): void {
        for (let d = 0; d < this.decisionToDFA.length; d++) {
            this.decisionToDFA[d] = new DFA(this.atn.getDecisionState(d), d);
        }
    }

    public getDFA(mode: number): DFA {
        return this.decisionToDFA[mode];
    }

    /** @returns the text matched so far for the current token. */
    public getText(input: CharStream): string {
        // Index is first lookahead char, don't include.
        return input.getTextFromRange(this.startIndex, input.index - 1);
    }

    public consume(input: CharStream): void {
        const curChar = input.LA(1);
        if (curChar === "\n".charCodeAt(0)) {
            this.line += 1;
            this.column = 0;
        } else {
            this.column += 1;
        }
        input.consume();
    }

    public getTokenName(tt: number): string {
        if (tt === Token.EOF) {
            return "EOF";
        } else {
            return "'" + String.fromCharCode(tt) + "'";
        }
    }

    private matchATN(input: CharStream): number {
        const startState = this.atn.modeToStartState[this.mode];

        if (LexerATNSimulator.debug) {
            console.log("matchATN mode " + this.mode + " start: " + startState);
        }

        const oldMode = this.mode;
        const s0Closure = this.computeStartState(input, startState!);
        const suppressEdge = s0Closure.hasSemanticContext;
        s0Closure.hasSemanticContext = false;

        const next = this.addDFAState(s0Closure);
        if (!suppressEdge) {
            this.decisionToDFA[this.mode].s0 = next;
        }

        const predict = this.execATN(input, next);
        if (LexerATNSimulator.debug) {
            console.log("DFA after matchATN: " + this.decisionToDFA[oldMode].toLexerString());
        }

        return predict;
    }

    private execATN(input: CharStream, state: DFAState): number {
        if (LexerATNSimulator.debug) {
            console.log("start state closure=" + state.configs);
        }

        if (state.isAcceptState) {
            // Allow zero-length tokens.s
            this.captureSimState(input, state);
        }

        let t = input.LA(1);

        while (true) {
            if (LexerATNSimulator.debug) {
                console.log("execATN loop starting closure: " + state.configs);
            }

            /**
             * As we move src->trg, src->trg, we keep track of the previous trg to
             * avoid looking up the DFA state again, which is expensive.
             * If the previous target was already part of the DFA, we might
             * be able to avoid doing a reach operation upon t. If s!=null,
             * it means that semantic predicates didn't prevent us from
             * creating a DFA state. Once we know s!=null, we check to see if
             * the DFA state has an edge already for t. If so, we can just reuse
             * it's configuration set; there's no point in re-computing it.
             * This is kind of like doing DFA simulation within the ATN
             * simulation because DFA simulation is really just a way to avoid
             * computing reach/closure sets. Technically, once we know that
             * we have a previously added DFA state, we could jump over to
             * the DFA simulator. But, that would mean popping back and forth
             * a lot and making things more complicated algorithmically.
             * This optimization makes a lot of sense for loops within DFA.
             * A character will take us back to an existing DFA state
             * that already has lots of edges out of it. e.g., .* in comments.
             */
            let target = this.getExistingTargetState(state, t);
            if (!target) {
                target = this.computeTargetState(input, state, t);
            }

            if (target === ATNSimulator.ERROR) {
                break;
            }

            // If this is a consumable input element, make sure to consume before
            // capturing the accept state so the input index, line, and char
            // position accurately reflect the state of the interpreter at the
            // end of the token.
            if (t !== Token.EOF) {
                this.consume(input);
            }

            if (target.isAcceptState) {
                this.captureSimState(input, target);
                if (t === Token.EOF) {
                    break;
                }
            }

            t = input.LA(1);
            state = target; // flip; current DFA target becomes new src/from state
        }

        return this.failOrAccept(input, state.configs, t);
    }

    /**
     * Get an existing target state for an edge in the DFA. If the target state
     * for the edge has not yet been computed or is otherwise not available,
     * this method returns `null`.
     *
     * @param s The current DFA state.
     * @param t The next input symbol.
     *
     * @returns The existing target DFA state for the given input symbol
     * `t`, or `null` if the target state for this edge is not already cached
     */
    private getExistingTargetState(s: DFAState, t: number): DFAState | undefined {
        if (t >= this.#options.minDFAEdge && t <= this.#options.maxDFAEdge) {
            const target = s.edges[t - this.#options.minDFAEdge];

            if (LexerATNSimulator.debug && target) {
                console.log("reuse state " + s.stateNumber + " edge to " + target.stateNumber);
            }

            return target;
        }

        return undefined;
    }

    /**
     * Compute a target state for an edge in the DFA, and attempt to add the computed state and corresponding
     * edge to the DFA.
     *
     * @param input The input stream
     * @param s The current DFA state
     * @param t The next input symbol
     *
     * @returns The computed target DFA state for the given input symbol `t`.
     *          If `t` does not lead to a valid DFA state, this method returns `ERROR`.
     */
    private computeTargetState(input: CharStream, s: DFAState, t: number): DFAState {
        const reach = new OrderedATNConfigSet();

        // If we don't find an existing DFA state,
        // fill reach starting from closure, following t transitions.
        this.getReachableConfigSet(input, s.configs, reach, t);

        if (reach.length === 0) { // we got nowhere on t from s
            if (!reach.hasSemanticContext) {
                // We got nowhere on t. Don't throw out this knowledge, it'd
                // cause a failover from DFA later.
                this.addDFAEdge(s, t, ATNSimulator.ERROR);
            }

            // Stop when we can't match any more char.
            return ATNSimulator.ERROR;
        }

        // Add an edge from s to target DFA found/created for reach.
        return this.addDFAEdge(s, t, null, reach);
    }

    private failOrAccept(input: CharStream, reach: ATNConfigSet, t: number): number {
        if (this.#prevAccept?.dfaState) {
            const { dfaState, index, line, column } = this.#prevAccept;

            this.accept(input, dfaState.lexerActionExecutor, this.startIndex, index, line, column);

            return dfaState.prediction;
        }

        // If no accept and EOF is first char, return EOF.
        if (t === Token.EOF && input.index === this.startIndex) {
            return Token.EOF;
        }

        throw new LexerNoViableAltException(this.recognizer, input, this.startIndex, reach);
    }

    /**
     * Given a starting configuration set, figure out all ATN configurations we can reach upon input `t`.
     * Parameter `reach` is a return parameter.
     */
    private getReachableConfigSet(input: CharStream, closure: ATNConfigSet, reach: ATNConfigSet, t: number): void {
        // This is used to skip processing for configs which have a lower priority
        // than a config that already reached an accept state for the same rule.
        let skipAlt = ATN.INVALID_ALT_NUMBER;
        for (const cfg of closure) {
            const currentAltReachedAcceptState = (cfg.alt === skipAlt);
            if (currentAltReachedAcceptState && (cfg as LexerATNConfig).passedThroughNonGreedyDecision) {
                continue;
            }

            if (LexerATNSimulator.debug) {
                console.log("testing %s at %s\n", this.getTokenName(t), cfg.toString(this.recognizer, true));
            }

            for (const trans of cfg.state.transitions) {
                const target = this.getReachableTarget(trans, t);
                if (target) {
                    let lexerActionExecutor = (cfg as LexerATNConfig).lexerActionExecutor;
                    if (lexerActionExecutor) {
                        lexerActionExecutor = lexerActionExecutor.fixOffsetBeforeMatch(input.index - this.startIndex);
                    }
                    const treatEofAsEpsilon = (t === Token.EOF);
                    const config = LexerATNConfig.createWithExecutor(cfg as LexerATNConfig, target,
                        lexerActionExecutor);
                    if (this.closure(input, config, reach, currentAltReachedAcceptState, true, treatEofAsEpsilon)) {
                        // Any remaining configs for this alt have a lower priority
                        // than the one that just reached an accept state.
                        skipAlt = cfg.alt;
                    }
                }
            }
        }
    }

    private accept(input: CharStream, lexerActionExecutor: LexerActionExecutor | null, startIndex: number,
        index: number, line: number, charPos: number): void {
        if (LexerATNSimulator.debug) {
            console.log("ACTION %s\n", lexerActionExecutor);
        }

        // Seek to after last char in token.
        input.seek(index);
        this.line = line;
        this.column = charPos;
        if (lexerActionExecutor && this.recognizer) {
            lexerActionExecutor.execute(this.recognizer, input, startIndex);
        }
    }

    private getReachableTarget(trans: Transition, t: number): ATNState | undefined {
        if (trans.matches(t, this.#options.minCodePoint, this.#options.maxCodePoint)) {
            return trans.target;
        } else {
            return undefined;
        }
    }

    private computeStartState(input: CharStream, p: ATNState): ATNConfigSet {
        const initialContext = PredictionContext.EMPTY;
        const configs = new OrderedATNConfigSet();
        for (let i = 0; i < p.transitions.length; i++) {
            const target = p.transitions[i].target;
            const cfg = LexerATNConfig.createWithContext(target, i + 1, initialContext);
            this.closure(input, cfg, configs, false, false, false);
        }

        return configs;
    }

    /**
     * Since the alternatives within any lexer decision are ordered by
     * preference, this method stops pursuing the closure as soon as an accept
     * state is reached. After the first accept state is reached by depth-first
     * search from `config`, all other (potentially reachable) states for
     * this rule would have a lower priority.
     *
     * @returns {boolean} `true` if an accept state is reached, otherwise `false`.
     */
    private closure(input: CharStream, config: LexerATNConfig, configs: ATNConfigSet,
        currentAltReachedAcceptState: boolean, speculative: boolean, treatEofAsEpsilon: boolean): boolean {
        let cfg = null;

        if (LexerATNSimulator.debug) {
            console.log("closure(" + config.toString(this.recognizer, true) + ")");
        }

        if ((config.state.constructor as typeof ATNState).stateType === ATNState.RULE_STOP) {
            if (LexerATNSimulator.debug) {
                if (this.recognizer !== null) {
                    console.log("closure at %s rule stop %s\n", this.recognizer.ruleNames[config.state.ruleIndex],
                        config);
                } else {
                    console.log("closure at rule stop %s\n", config);
                }
            }

            if (!config.context || config.context.hasEmptyPath()) {
                if (!config.context || config.context.isEmpty()) {
                    configs.add(config);

                    return true;
                } else {
                    configs.add(LexerATNConfig.createWithConfig(config.state, config, PredictionContext.EMPTY));
                    currentAltReachedAcceptState = true;
                }
            }

            if (config.context && !config.context.isEmpty()) {
                for (let i = 0; i < config.context.length; i++) {
                    if (config.context.getReturnState(i) !== PredictionContext.EMPTY_RETURN_STATE) {
                        const newContext = config.context.getParent(i)!; // "pop" return state
                        const returnState = this.atn.states[config.context.getReturnState(i)]!;
                        cfg = LexerATNConfig.createWithConfig(returnState, config, newContext);
                        currentAltReachedAcceptState = this.closure(input, cfg,
                            configs, currentAltReachedAcceptState, speculative,
                            treatEofAsEpsilon);
                    }
                }
            }

            return currentAltReachedAcceptState;
        }

        // optimization
        if (!config.state.epsilonOnlyTransitions) {
            if (!currentAltReachedAcceptState || !config.passedThroughNonGreedyDecision) {
                configs.add(config);
            }
        }

        for (const trans of config.state.transitions) {
            cfg = this.getEpsilonTarget(input, config, trans, configs, speculative, treatEofAsEpsilon);
            if (cfg) {
                currentAltReachedAcceptState = this.closure(input, cfg, configs, currentAltReachedAcceptState,
                    speculative, treatEofAsEpsilon);
            }
        }

        return currentAltReachedAcceptState;
    }

    // side-effect: can alter configs.hasSemanticContext
    private getEpsilonTarget(input: CharStream, config: LexerATNConfig, trans: Transition, configs: ATNConfigSet,
        speculative: boolean, treatEofAsEpsilon: boolean): LexerATNConfig | null {
        if (!this.#lexerATNConfigFactory) {
            this.setupATNFactoryLookup();
        }
        const factory = this.#lexerATNConfigFactory[trans.transitionType];
        if (!factory) {
            return null;
        }

        return factory(input, config, trans, configs, speculative, treatEofAsEpsilon);
    };

    /**
     * Fills the lookup table for creating lexer ATN configs. This helps to avoid frequent checks of the transition
     * type, which determines the configuration of the created config.
     */
    private setupATNFactoryLookup(): void {
        this.#lexerATNConfigFactory = [];

        this.#lexerATNConfigFactory[Transition.RULE] = (input: CharStream, config: LexerATNConfig,
            trans: Transition) => {
            const newContext = SingletonPredictionContext.create(config.context ?? undefined,
                (trans as RuleTransition).followState.stateNumber);

            return LexerATNConfig.createWithConfig(trans.target, config, newContext);
        };

        this.#lexerATNConfigFactory[Transition.PRECEDENCE] = () => {
            throw new Error("Precedence predicates are not supported in lexers.");
        };

        this.#lexerATNConfigFactory[Transition.PREDICATE] = (input: CharStream, config: LexerATNConfig,
            trans: Transition, configs: ATNConfigSet, speculative: boolean) => {
            // Track traversing semantic predicates. If we traverse,
            // we cannot add a DFA state for this "reach" computation
            // because the DFA would not test the predicate again in the
            // future. Rather than creating collections of semantic predicates
            // like v3 and testing them on prediction, v4 will test them on the
            // fly all the time using the ATN not the DFA. This is slower but
            // semantically it's not used that often. One of the key elements to
            // this predicate mechanism is not adding DFA states that see
            // predicates immediately afterwards in the ATN. For example,

            // a : ID {p1}? | ID {p2}? ;

            // should create the start state for rule 'a' (to save start state
            // competition), but should not create target of ID state. The
            // collection of ATN states the following ID references includes
            // states reached by traversing predicates. Since this is when we
            // test them, we cannot cash the DFA state target of ID.

            const pt = trans as PredicateTransition;

            if (LexerATNSimulator.debug) {
                console.log("EVAL rule " + pt.ruleIndex + ":" + pt.predIndex);
            }

            configs.hasSemanticContext = true;
            if (this.evaluatePredicate(input, pt.ruleIndex, pt.predIndex, speculative)) {
                return LexerATNConfig.createWithConfig(trans.target, config);
            }

            return null;
        };

        this.#lexerATNConfigFactory[Transition.ACTION] = (input: CharStream, config: LexerATNConfig,
            trans: Transition) => {
            if (config.context === null || config.context.hasEmptyPath()) {
                // execute actions anywhere in the start rule for a token.
                //
                // TODO: if the entry rule is invoked recursively, some
                // actions may be executed during the recursive call. The
                // problem can appear when hasEmptyPath() is true but
                // isEmpty() is false. In this case, the config needs to be
                // split into two contexts - one with just the empty path
                // and another with everything but the empty path.
                // Unfortunately, the current algorithm does not allow
                // getEpsilonTarget to return two configurations, so
                // additional modifications are needed before we can support
                // the split operation.
                const lexerActionExecutor = LexerActionExecutor.append(config.lexerActionExecutor,
                    this.atn.lexerActions[(trans as ActionTransition).actionIndex]);

                return LexerATNConfig.createWithExecutor(config, trans.target, lexerActionExecutor);
            } else {
                // ignore actions in referenced rules
                return LexerATNConfig.createWithConfig(trans.target, config);
            }
        };

        this.#lexerATNConfigFactory[Transition.EPSILON] = (input: CharStream, config: LexerATNConfig,
            trans: Transition) => {
            return LexerATNConfig.createWithConfig(trans.target, config);
        };

        const simple = (input: CharStream, config: LexerATNConfig,
            trans: Transition, configs: ATNConfigSet,
            speculative: boolean, treatEofAsEpsilon: boolean) => {
            if (treatEofAsEpsilon) {
                if (trans.matches(Token.EOF, this.#options.minCodePoint, this.#options.maxCodePoint)) {
                    return LexerATNConfig.createWithConfig(trans.target, config);
                }
            }

            return null;
        };

        this.#lexerATNConfigFactory[Transition.ATOM] = simple;
        this.#lexerATNConfigFactory[Transition.RANGE] = simple;
        this.#lexerATNConfigFactory[Transition.SET] = simple;
    }

    /**
     * Evaluate a predicate specified in the lexer.
     *
     * If `speculative` is `true`, this method was called before
     * {@link consume} for the matched character. This method should call
     * {@link consume} before evaluating the predicate to ensure position
     * sensitive values, including {@link Lexer//getText}, {@link Lexer//getLine},
     * and {@link Lexer}, properly reflect the current
     * lexer state. This method should restore `input` and the simulator
     * to the original state before returning (i.e. undo the actions made by the
     * call to {@link consume}.
     *
     * @param input The input stream.
     * @param ruleIndex The rule containing the predicate.
     * @param predIndex The index of the predicate within the rule.
     * @param speculative `true` if the current index in `input` is
     * one character before the predicate's location.
     *
     * @returns `true` if the specified predicate evaluates to
     * `true`.
     */
    private evaluatePredicate(input: CharStream, ruleIndex: number, predIndex: number,
        speculative: boolean): boolean {
        // Assume true if no recognizer was provided.
        if (!this.recognizer) {
            return true;
        }

        if (!speculative) {
            return this.recognizer.sempred(null, ruleIndex, predIndex);
        }

        const savedColumn = this.column;
        const savedLine = this.line;
        const index = input.index;
        const marker = input.mark();
        try {
            this.consume(input);

            return this.recognizer.sempred(null, ruleIndex, predIndex);
        } finally {
            this.column = savedColumn;
            this.line = savedLine;
            input.seek(index);
            input.release(marker);
        }
    }

    private captureSimState(input: CharStream, dfaState: DFAState | null): void {
        this.#prevAccept = {
            index: input.index,
            line: this.line,
            column: this.column,
            dfaState,
        };
    }

    private addDFAEdge(from: DFAState, tk: number, to: DFAState | null, configs?: ATNConfigSet): DFAState {
        if (!to && configs) {
            // Leading to this call, ATNConfigSet.hasSemanticContext is used as a
            // marker indicating dynamic predicate evaluation makes this edge
            // dependent on the specific input sequence, so the static edge in the
            // DFA should be omitted. The target DFAState is still created since
            // execATN has the ability to resynchronize with the DFA state cache
            // following the predicate evaluation step.
            //
            // TJP notes: next time through the DFA, we see a pred again and eval.
            // If that gets us to a previously created (but dangling) DFA
            // state, we can continue in pure DFA mode from there.
            const suppressEdge = configs.hasSemanticContext;
            configs.hasSemanticContext = false;

            to = this.addDFAState(configs);

            if (suppressEdge) {
                return to;
            }
        }

        // Add the edge.
        if (tk < this.#options.minDFAEdge || tk > this.#options.maxDFAEdge) {
            // Only track edges within the DFA bounds
            return to!;
        }

        if (LexerATNSimulator.debug) {
            console.log("EDGE " + from + " -> " + to + " upon " + tk);
        }

        from.edges[tk - this.#options.minDFAEdge] = to!; // connect

        return to!;
    }

    /**
     * Add a new DFA state if there isn't one with this set of configurations already. This method also detects
     * the first configuration containing an ATN rule stop state. Later, when traversing the DFA, we will know
     * which rule to accept.
     */
    private addDFAState(configs: ATNConfigSet): DFAState {
        // See if we have a state with this set of configurations already.
        const dfa = this.decisionToDFA[this.mode];
        const existing = dfa.getStateForConfigs(configs);
        if (existing) {
            return existing;
        }

        const proposed = DFAState.fromConfigs(configs);
        const firstConfigWithRuleStopState = configs.firstStopState;
        if (firstConfigWithRuleStopState) {
            proposed.isAcceptState = true;
            proposed.lexerActionExecutor = (firstConfigWithRuleStopState as LexerATNConfig).lexerActionExecutor;
            proposed.prediction = this.atn.ruleToTokenType[firstConfigWithRuleStopState.state.ruleIndex];
        }

        configs.setReadonly(true);
        dfa.addState(proposed);

        return proposed;
    }
}
