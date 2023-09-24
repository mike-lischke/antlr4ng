/* eslint-disable jsdoc/require-jsdoc, jsdoc/require-param, jsdoc/require-returns, jsdoc/check-tag-names, jsdoc/check-types, jsdoc/valid-types, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line max-classes-per-file, @typescript-eslint/quotes
import { Token } from '../Token.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { Lexer } from './../Lexer.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ATN } from './ATN.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { ATNSimulator } from './ATNSimulator.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { DFAState } from '../dfa/DFAState.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { OrderedATNConfigSet } from './OrderedATNConfigSet.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { PredictionContext } from './PredictionContext.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { SingletonPredictionContext } from './SingletonPredictionContext.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { RuleStopState } from './RuleStopState.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { LexerATNConfig } from './LexerATNConfig.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { LexerActionExecutor } from './LexerActionExecutor.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { LexerNoViableAltException } from '../LexerNoViableAltException.js';
import { TransitionType } from "./TransitionType.js";

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function resetSimState(sim: any) {
    sim.index = -1;
    sim.line = 0;
    sim.column = -1;
    sim.dfaState = null;
}

class SimState {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor() {
        resetSimState(this);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    reset() {
        resetSimState(this);
    }
}

export class LexerATNSimulator extends ATNSimulator {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    column: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    decisionToDFA: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    line: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    mode: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    prevAccept: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    recog: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    startIndex: any;
    /**
     * When we hit an accept state in either the DFA or the ATN, we
     * have to notify the character stream to start buffering characters
     * via {@link IntStream//mark} and record the current state. The current sim state
     * includes the current index into the input, the current line,
     * and current character position in that line. Note that the Lexer is
     * tracking the starting line and characterization of the token. These
     * variables track the "state" of the simulator when it hits an accept state.
     *
     * <p>We track these variables separately for the DFA and ATN simulation
     * because the DFA simulation often has to fail over to the ATN
     * simulation. If the ATN simulation fails, we need the DFA to fall
     * back to its previously accepted state, if any. If the ATN succeeds,
     * then the ATN does the accept and the DFA simulator that invoked it
     * can simply return the predicted token type.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(recog: any, atn: any, decisionToDFA: any, sharedContextCache: any) {
        super(atn, sharedContextCache);
        this.decisionToDFA = decisionToDFA;
        this.recog = recog;
        /**
         * The current token's starting index into the character stream.
         * Shared across DFA to ATN simulation in case the ATN fails and the
         * DFA did not have a previous accept state. In this case, we use the
         * ATN-generated exception object
         */
        this.startIndex = -1;
        // line number 1..n within the input///
        this.line = 1;
        /**
         * The index of the character relative to the beginning of the line
         * 0..n-1
         */
        this.column = 0;
        // @ts-expect-error TS(2339): Property 'DEFAULT_MODE' does not exist on type 'ty... Remove this comment to see the full error message
        this.mode = Lexer.DEFAULT_MODE;
        /**
         * Used during DFA/ATN exec to record the most recent accept configuration
         * info
         */
        this.prevAccept = new SimState();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    copyState(simulator: any) {
        this.column = simulator.column;
        this.line = simulator.line;
        this.mode = simulator.mode;
        this.startIndex = simulator.startIndex;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    match(input: any, mode: any) {
        this.mode = mode;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const mark = input.mark();
        try {
            this.startIndex = input.index;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.prevAccept.reset();
            const dfa = this.decisionToDFA[mode];
            if (dfa.s0 === null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return this.matchATN(input);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return this.execATN(input, dfa.s0);
            }
        } finally {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            input.release(mark);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    reset() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.prevAccept.reset();
        this.startIndex = -1;
        this.line = 1;
        this.column = 0;
        // @ts-expect-error TS(2339): Property 'DEFAULT_MODE' does not exist on type 'ty... Remove this comment to see the full error message
        this.mode = Lexer.DEFAULT_MODE;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    matchATN(input: any) {
        const startState = this.atn.modeToStartState[this.mode];

        // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
        if (LexerATNSimulator.debug) {
            console.log("matchATN mode " + this.mode + " start: " + startState);
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const old_mode = this.mode;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const s0_closure = this.computeStartState(input, startState);
        const suppressEdge = s0_closure.hasSemanticContext;
        s0_closure.hasSemanticContext = false;

        const next = this.addDFAState(s0_closure);
        if (!suppressEdge) {
            this.decisionToDFA[this.mode].s0 = next;
        }

        const predict = this.execATN(input, next);

        // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
        if (LexerATNSimulator.debug) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            console.log("DFA after matchATN: " + this.decisionToDFA[old_mode].toLexerString());
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return predict;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    execATN(input: any, ds0: any) {
        // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
        if (LexerATNSimulator.debug) {
            console.log("start state closure=" + ds0.configs);
        }
        if (ds0.isAcceptState) {
            // allow zero-length tokens
            this.captureSimState(this.prevAccept, input, ds0);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        let t = input.LA(1);
        let s = ds0; // s is current/from DFA state

        for (; ;) { // while more work
            // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
            if (LexerATNSimulator.debug) {
                console.log("execATN loop starting closure: " + s.configs);
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
             * print("Target for:" + str(s) + " and:" + str(t))
             */
            let target = this.getExistingTargetState(s, t);
            // print("Existing:" + str(target))
            if (target === null) {
                target = this.computeTargetState(input, s, t);
                // print("Computed:" + str(target))
            }
            // @ts-expect-error TS(2339): Property 'ERROR' does not exist on type 'typeof AT... Remove this comment to see the full error message
            if (target === ATNSimulator.ERROR) {
                break;
            }
            // If this is a consumable input element, make sure to consume before
            // capturing the accept state so the input index, line, and char
            // position accurately reflect the state of the interpreter at the
            // end of the token.
            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            if (t !== Token.EOF) {
                this.consume(input);
            }
            if (target.isAcceptState) {
                this.captureSimState(this.prevAccept, input, target);
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                if (t === Token.EOF) {
                    break;
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            t = input.LA(1);
            s = target; // flip; current DFA target becomes new src/from state
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return this.failOrAccept(this.prevAccept, input, s.configs, t);
    }

    /**
     * Get an existing target state for an edge in the DFA. If the target state
     * for the edge has not yet been computed or is otherwise not available,
     * this method returns {@code null}.
     *
     * @param s The current DFA state
     * @param t The next input symbol
     * @return The existing target DFA state for the given input symbol
     * {@code t}, or {@code null} if the target state for this edge is not
     * already cached
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getExistingTargetState(s: any, t: any) {
        // @ts-expect-error TS(2339): Property 'MIN_DFA_EDGE' does not exist on type 'ty... Remove this comment to see the full error message
        if (s.edges === null || t < LexerATNSimulator.MIN_DFA_EDGE || t > LexerATNSimulator.MAX_DFA_EDGE) {
            return null;
        }

        // @ts-expect-error TS(2339): Property 'MIN_DFA_EDGE' does not exist on type 'ty... Remove this comment to see the full error message
        let target = s.edges[t - LexerATNSimulator.MIN_DFA_EDGE];
        if (target === undefined) {
            target = null;
        }
        // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
        if (LexerATNSimulator.debug && target !== null) {
            console.log("reuse state " + s.stateNumber + " edge to " + target.stateNumber);
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return target;
    }

    /**
     * Compute a target state for an edge in the DFA, and attempt to add the
     * computed state and corresponding edge to the DFA.
     *
     * @param input The input stream
     * @param s The current DFA state
     * @param t The next input symbol
     *
     * @return The computed target DFA state for the given input symbol
     * {@code t}. If {@code t} does not lead to a valid DFA state, this method
     * returns {@link //ERROR}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    computeTargetState(input: any, s: any, t: any) {
        const reach = new OrderedATNConfigSet();
        // if we don't find an existing DFA state
        // Fill reach starting from closure, following t transitions
        this.getReachableConfigSet(input, s.configs, reach, t);

        if (reach.items.length === 0) { // we got nowhere on t from s
            if (!reach.hasSemanticContext) {
                // we got nowhere on t, don't throw out this knowledge; it'd
                // cause a failover from DFA later.
                // @ts-expect-error TS(2554): Expected 4 arguments, but got 3.
                this.addDFAEdge(s, t, ATNSimulator.ERROR);
            }
            // stop when we can't match any more char
            // @ts-expect-error TS(2339): Property 'ERROR' does not exist on type 'typeof AT... Remove this comment to see the full error message
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return ATNSimulator.ERROR;
        }
        // Add an edge from s to target DFA found/created for reach
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return this.addDFAEdge(s, t, null, reach);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    failOrAccept(prevAccept: any, input: any, reach: any, t: any) {
        if (this.prevAccept.dfaState !== null) {
            const lexerActionExecutor = prevAccept.dfaState.lexerActionExecutor;
            this.accept(input, lexerActionExecutor, this.startIndex,
                prevAccept.index, prevAccept.line, prevAccept.column);
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return prevAccept.dfaState.prediction;
        } else {
            // if no accept and EOF is first char, return EOF
            // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
            if (t === Token.EOF && input.index === this.startIndex) {
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return Token.EOF;
            }
            throw new LexerNoViableAltException(this.recog, input, this.startIndex, reach);
        }
    }

    /**
     * Given a starting configuration set, figure out all ATN configurations
     * we can reach upon input {@code t}. Parameter {@code reach} is a return
     * parameter.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getReachableConfigSet(input: any, closure: any, reach: any, t: any) {
        // this is used to skip processing for configs which have a lower priority
        // than a config that already reached an accept state for the same rule
        // @ts-expect-error TS(2339): Property 'INVALID_ALT_NUMBER' does not exist on ty... Remove this comment to see the full error message
        let skipAlt = ATN.INVALID_ALT_NUMBER;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < closure.items.length; i++) {
            const cfg = closure.items[i];
            const currentAltReachedAcceptState = (cfg.alt === skipAlt);
            if (currentAltReachedAcceptState && cfg.passedThroughNonGreedyDecision) {
                continue;
            }
            // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
            if (LexerATNSimulator.debug) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                console.log("testing %s at %s\n", this.getTokenName(t), cfg
                    .toString(this.recog, true));
            }
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < cfg.state.transitions.length; j++) {
                const trans = cfg.state.transitions[j]; // for each transition
                const target = this.getReachableTarget(trans, t);
                if (target !== null) {
                    let lexerActionExecutor = cfg.lexerActionExecutor;
                    if (lexerActionExecutor !== null) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        lexerActionExecutor = lexerActionExecutor.fixOffsetBeforeMatch(input.index - this.startIndex);
                    }
                    // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                    const treatEofAsEpsilon = (t === Token.EOF);
                    // eslint-disable-next-line object-shorthand
                    const config = new LexerATNConfig({ state: target, lexerActionExecutor: lexerActionExecutor }, cfg);
                    if (this.closure(input, config, reach,
                        currentAltReachedAcceptState, true, treatEofAsEpsilon)) {
                        // any remaining configs for this alt have a lower priority
                        // than the one that just reached an accept state.
                        skipAlt = cfg.alt;
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    accept(input: any, lexerActionExecutor: any, startIndex: any, index: any, line: any, charPos: any) {
        // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
        if (LexerATNSimulator.debug) {
            console.log("ACTION %s\n", lexerActionExecutor);
        }
        // seek to after last char in token
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        input.seek(index);
        this.line = line;
        this.column = charPos;
        if (lexerActionExecutor !== null && this.recog !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            lexerActionExecutor.execute(this.recog, input, startIndex);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getReachableTarget(trans: any, t: any) {
        // @ts-expect-error TS(2339): Property 'MAX_CHAR_VALUE' does not exist on type '... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (trans.matches(t, 0, Lexer.MAX_CHAR_VALUE)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return trans.target;
        } else {
            return null;
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    computeStartState(input: any, p: any) {
        // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
        const initialContext = PredictionContext.EMPTY;
        const configs = new OrderedATNConfigSet();
        for (let i = 0; i < p.transitions.length; i++) {
            const target = p.transitions[i].target;
            const cfg = new LexerATNConfig({ state: target, alt: i + 1, context: initialContext }, null);
            this.closure(input, cfg, configs, false, false, false);
        }
        // eslint-disable-next-line padding-line-between-statements
        return configs;
    }

    /**
     * Since the alternatives within any lexer decision are ordered by
     * preference, this method stops pursuing the closure as soon as an accept
     * state is reached. After the first accept state is reached by depth-first
     * search from {@code config}, all other (potentially reachable) states for
     * this rule would have a lower priority.
     *
     * @return {Boolean} {@code true} if an accept state is reached, otherwise
     * {@code false}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    closure(input: any, config: any, configs: any,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        currentAltReachedAcceptState: any, speculative: any, treatEofAsEpsilon: any) {
        let cfg = null;
        // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
        if (LexerATNSimulator.debug) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            console.log("closure(" + config.toString(this.recog, true) + ")");
        }
        if (config.state instanceof RuleStopState) {
            // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
            if (LexerATNSimulator.debug) {
                if (this.recog !== null) {
                    console.log("closure at %s rule stop %s\n", this.recog.ruleNames[config.state.ruleIndex], config);
                } else {
                    console.log("closure at rule stop %s\n", config);
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (config.context === null || config.context.hasEmptyPath()) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (config.context === null || config.context.isEmpty()) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    configs.add(config);
                    // eslint-disable-next-line padding-line-between-statements
                    return true;
                } else {
                    // @ts-expect-error TS(2339): Property 'EMPTY' does not exist on type 'typeof Pr... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    configs.add(new LexerATNConfig({ state: config.state, context: PredictionContext.EMPTY }, config));
                    currentAltReachedAcceptState = true;
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (config.context !== null && !config.context.isEmpty()) {
                for (let i = 0; i < config.context.length; i++) {
                    // @ts-expect-error TS(2339): Property 'EMPTY_RETURN_STATE' does not exist on ty... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    if (config.context.getReturnState(i) !== PredictionContext.EMPTY_RETURN_STATE) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        const newContext = config.context.getParent(i); // "pop" return state
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        const returnState = this.atn.states[config.context.getReturnState(i)];
                        cfg = new LexerATNConfig({ state: returnState, context: newContext }, config);
                        currentAltReachedAcceptState = this.closure(input, cfg,
                            configs, currentAltReachedAcceptState, speculative,
                            treatEofAsEpsilon);
                    }
                }
            }
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
            return currentAltReachedAcceptState;
        }
        // optimization
        if (!config.state.epsilonOnlyTransitions) {
            if (!currentAltReachedAcceptState || !config.passedThroughNonGreedyDecision) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                configs.add(config);
            }
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let j = 0; j < config.state.transitions.length; j++) {
            const trans = config.state.transitions[j];
            cfg = this.getEpsilonTarget(input, config, trans, configs, speculative, treatEofAsEpsilon);
            if (cfg !== null) {
                currentAltReachedAcceptState = this.closure(input, cfg, configs,
                    currentAltReachedAcceptState, speculative, treatEofAsEpsilon);
            }
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return currentAltReachedAcceptState;
    }

    // side-effect: can alter configs.hasSemanticContext
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getEpsilonTarget(input: any, config: any, trans: any,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        configs: any, speculative: any, treatEofAsEpsilon: any) {
        let cfg = null;
        if (trans.serializationType === TransitionType.RULE) {
            const newContext = SingletonPredictionContext.create(config.context, trans.followState.stateNumber);
            cfg = new LexerATNConfig({ state: trans.target, context: newContext }, config);
        } else if (trans.serializationType === TransitionType.PRECEDENCE) {
            // eslint-disable-next-line no-throw-literal
            throw "Precedence predicates are not supported in lexers.";
        } else if (trans.serializationType === TransitionType.PREDICATE) {
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

            // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
            if (LexerATNSimulator.debug) {
                console.log("EVAL rule " + trans.ruleIndex + ":" + trans.predIndex);
            }
            configs.hasSemanticContext = true;
            if (this.evaluatePredicate(input, trans.ruleIndex, trans.predIndex, speculative)) {
                cfg = new LexerATNConfig({ state: trans.target }, config);
            }
        } else if (trans.serializationType === TransitionType.ACTION) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
                    this.atn.lexerActions[trans.actionIndex]);
                // eslint-disable-next-line object-shorthand
                cfg = new LexerATNConfig({ state: trans.target, lexerActionExecutor: lexerActionExecutor }, config);
            } else {
                // ignore actions in referenced rules
                cfg = new LexerATNConfig({ state: trans.target }, config);
            }
        } else if (trans.serializationType === TransitionType.EPSILON) {
            cfg = new LexerATNConfig({ state: trans.target }, config);
        } else if (trans.serializationType === TransitionType.ATOM ||
            trans.serializationType === TransitionType.RANGE ||
            trans.serializationType === TransitionType.SET) {
            if (treatEofAsEpsilon) {
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                if (trans.matches(Token.EOF, 0, Lexer.MAX_CHAR_VALUE)) {
                    cfg = new LexerATNConfig({ state: trans.target }, config);
                }
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return cfg;
    }

    /**
     * Evaluate a predicate specified in the lexer.
     *
     * <p>If {@code speculative} is {@code true}, this method was called before
     * {@link //consume} for the matched character. This method should call
     * {@link //consume} before evaluating the predicate to ensure position
     * sensitive values, including {@link Lexer//getText}, {@link Lexer//getLine},
     * and {@link Lexer}, properly reflect the current
     * lexer state. This method should restore {@code input} and the simulator
     * to the original state before returning (i.e. undo the actions made by the
     * call to {@link //consume}.</p>
     *
     * @param input The input stream.
     * @param ruleIndex The rule containing the predicate.
     * @param predIndex The index of the predicate within the rule.
     * @param speculative {@code true} if the current index in {@code input} is
     * one character before the predicate's location.
     *
     * @return {@code true} if the specified predicate evaluates to
     * {@code true}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluatePredicate(input: any, ruleIndex: any,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        predIndex: any, speculative: any) {
        // assume true if no recognizer was provided
        if (this.recog === null) {
            return true;
        }
        if (!speculative) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return this.recog.sempred(null, ruleIndex, predIndex);
        }
        const savedColumn = this.column;
        const savedLine = this.line;
        const index = input.index;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const marker = input.mark();
        try {
            this.consume(input);
            // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return this.recog.sempred(null, ruleIndex, predIndex);
        } finally {
            this.column = savedColumn;
            this.line = savedLine;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            input.seek(index);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            input.release(marker);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    captureSimState(settings: any, input: any, dfaState: any) {
        settings.index = input.index;
        settings.line = this.line;
        settings.column = this.column;
        settings.dfaState = dfaState;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
    addDFAEdge(from_: any, tk: any, to: any, configs: any) {
        if (to === undefined) {
            to = null;
        }

        if (configs === undefined) {
            configs = null;
        }

        if (to === null && configs !== null) {
            // leading to this call, ATNConfigSet.hasSemanticContext is used as a
            // marker indicating dynamic predicate evaluation makes this edge
            // dependent on the specific input sequence, so the static edge in the
            // DFA should be omitted. The target DFAState is still created since
            // execATN has the ability to resynchronize with the DFA state cache
            // following the predicate evaluation step.
            //
            // TJP notes: next time through the DFA, we see a pred again and eval.
            // If that gets us to a previously created (but dangling) DFA
            // state, we can continue in pure DFA mode from there.
            // /
            const suppressEdge = configs.hasSemanticContext;
            configs.hasSemanticContext = false;

            to = this.addDFAState(configs);

            if (suppressEdge) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return to;
            }
        }
        // add the edge
        // @ts-expect-error TS(2339): Property 'MIN_DFA_EDGE' does not exist on type 'ty... Remove this comment to see the full error message
        if (tk < LexerATNSimulator.MIN_DFA_EDGE || tk > LexerATNSimulator.MAX_DFA_EDGE) {
            // Only track edges within the DFA bounds
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return to;
        }
        // @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
        if (LexerATNSimulator.debug) {
            console.log("EDGE " + from_ + " -> " + to + " upon " + tk);
        }
        if (from_.edges === null) {
            // make room for tokens 1..n and -1 masquerading as index 0
            from_.edges = [];
        }
        // @ts-expect-error TS(2339): Property 'MIN_DFA_EDGE' does not exist on type 'ty... Remove this comment to see the full error message
        from_.edges[tk - LexerATNSimulator.MIN_DFA_EDGE] = to; // connect

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return to;
    }

    /**
     * Add a new DFA state if there isn't one with this set of
     * configurations already. This method also detects the first
     * configuration containing an ATN rule stop state. Later, when
     * traversing the DFA, we will know which rule to accept.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addDFAState(configs: any) {
        const proposed = new DFAState(null, configs);
        let firstConfigWithRuleStopState = null;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < configs.items.length; i++) {
            const cfg = configs.items[i];
            if (cfg.state instanceof RuleStopState) {
                firstConfigWithRuleStopState = cfg;
                break;
            }
        }
        if (firstConfigWithRuleStopState !== null) {
            proposed.isAcceptState = true;
            proposed.lexerActionExecutor = firstConfigWithRuleStopState.lexerActionExecutor;
            proposed.prediction = this.atn.ruleToTokenType[firstConfigWithRuleStopState.state.ruleIndex];
        }
        const dfa = this.decisionToDFA[this.mode];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const existing = dfa.states.get(proposed);
        if (existing !== null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return existing;
        }
        const newState = proposed;
        newState.stateNumber = dfa.states.length;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        configs.setReadonly(true);
        newState.configs = configs;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        dfa.states.add(newState);
        // eslint-disable-next-line padding-line-between-statements
        return newState;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getDFA(mode: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.decisionToDFA[mode];
    }

    // Get the text matched so far for the current token.
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getText(input: any) {
        // index is first lookahead char, don't include.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return input.getText(this.startIndex, input.index - 1);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    consume(input: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const curChar = input.LA(1);
        if (curChar === "\n".charCodeAt(0)) {
            this.line += 1;
            this.column = 0;
        } else {
            this.column += 1;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        input.consume();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getTokenName(tt: any) {
        if (tt === -1) {
            return "EOF";
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return "'" + String.fromCharCode(tt) + "'";
        }
    }
}

// @ts-expect-error TS(2339): Property 'debug' does not exist on type 'typeof Le... Remove this comment to see the full error message
LexerATNSimulator.debug = false;
// @ts-expect-error TS(2339): Property 'dfa_debug' does not exist on type 'typeo... Remove this comment to see the full error message
LexerATNSimulator.dfa_debug = false;

// @ts-expect-error TS(2339): Property 'MIN_DFA_EDGE' does not exist on type 'ty... Remove this comment to see the full error message
LexerATNSimulator.MIN_DFA_EDGE = 0;
// @ts-expect-error TS(2339): Property 'MAX_DFA_EDGE' does not exist on type 'ty... Remove this comment to see the full error message
LexerATNSimulator.MAX_DFA_EDGE = 127; // forces unicode to stay in ATN
