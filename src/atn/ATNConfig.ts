/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import { SemanticContext } from "./SemanticContext.js";
import { ATNState } from "./ATNState.js";
import { PredictionContext } from "./PredictionContext.js";
import { Recognizer } from "../Recognizer.js";
import { ATNSimulator } from "./ATNSimulator.js";
import { MurmurHash } from "../utils/MurmurHash.js";

export class ATNConfig {
    /** The ATN state associated with this configuration */
    public readonly state: ATNState;

    /** What alt (or lexer rule) is predicted by this configuration */
    public readonly alt: number;

    /**
     * We cannot execute predicates dependent upon local context unless
     * we know for sure we are in the correct context. Because there is
     * no way to do this efficiently, we simply cannot evaluate
     * dependent predicates unless we are in the rule that initially
     * invokes the ATN simulator.
     *
     * closure() tracks the depth of how far we dip into the outer context:
     * depth > 0.
     */
    public reachesIntoOuterContext: boolean = false; // Not used in hash code.

    public precedenceFilterSuppressed = false; // Not used in hash code.

    public get semanticContext(): SemanticContext {
        return this.#semanticContext;
    }

    protected cachedHashCode: number | undefined; // Shared with LexerATNConfig.

    /**
     * The syntactic context is a graph-structured stack node whose
     * path(s) to the root is the rule invocation(s)
     * chain used to arrive at the state.  The semantic context is
     * the tree of semantic predicates encountered before reaching
     * an ATN state
     */
    #context: PredictionContext | null = null;

    #semanticContext: SemanticContext;

    /** Never create config classes directly. Use the factory methods below. */
    protected constructor(c: Partial<ATNConfig>, state: ATNState, context: PredictionContext | null,
        semanticContext?: SemanticContext | null) {
        this.state = state;
        this.alt = c.alt!;
        this.context = context;
        this.#semanticContext = semanticContext ?? SemanticContext.NONE;
        this.reachesIntoOuterContext = c.reachesIntoOuterContext!;

        if (c.precedenceFilterSuppressed !== undefined) {
            this.precedenceFilterSuppressed = c.precedenceFilterSuppressed;
        }
    }

    public static duplicate(old: ATNConfig, semanticContext?: SemanticContext): ATNConfig {
        return new ATNConfig(old, old.state, old.context, semanticContext ?? old.semanticContext);
    }

    public static createWithContext(state: ATNState, alt: number, context: PredictionContext | null,
        semanticContext?: SemanticContext): ATNConfig {
        return new ATNConfig({ alt }, state, context, semanticContext);
    }

    public static createWithConfig(state: ATNState, config: ATNConfig, context?: PredictionContext): ATNConfig {
        return new ATNConfig(config, state, context ?? config.context, config.semanticContext);
    }

    public static createWithSemanticContext(state: ATNState, c: ATNConfig,
        semanticContext?: SemanticContext | null): ATNConfig {
        return new ATNConfig(c, state ?? c.state, c.context, semanticContext);
    }

    public hashCode(): number {
        if (this.cachedHashCode === undefined) {
            let hashCode = MurmurHash.initialize(7);
            hashCode = MurmurHash.update(hashCode, this.state.stateNumber);
            hashCode = MurmurHash.update(hashCode, this.alt);
            hashCode = MurmurHash.updateFromComparable(hashCode, this.#context);
            hashCode = MurmurHash.updateFromComparable(hashCode, this.semanticContext);
            hashCode = MurmurHash.finish(hashCode, 4);
            this.cachedHashCode = hashCode;
        }

        return this.cachedHashCode;
    }

    /**
     * The stack of invoking states leading to the rule/states associated
     * with this config.  We track only those contexts pushed during
     * execution of the ATN simulator.
     */
    public get context(): PredictionContext | null {
        return this.#context;
    }

    public set context(context: PredictionContext | null) {
        this.#context = context;
        this.cachedHashCode = undefined;
    }

    /**
     * An ATN configuration is equal to another if both have
     * the same state, they predict the same alternative, and
     * syntactic/semantic contexts are the same.
     */
    public equals(other: ATNConfig): boolean {
        if (this === other) {
            return true;
        }

        return (this.state.stateNumber === other.state.stateNumber) &&
            (this.alt === other.alt) &&
            (this.context === null ? other.context === null : this.context.equals(other.context)) &&
            this.semanticContext.equals(other.semanticContext) &&
            this.precedenceFilterSuppressed === other.precedenceFilterSuppressed;
    }

    public toString(_recog?: Recognizer<ATNSimulator> | null, showAlt = true): string {
        let alt = "";
        if (showAlt) {
            alt = "," + this.alt;
        }

        return "(" + this.state + alt +
            (this.context !== null ? ",[" + this.context.toString() + "]" : "") +
            (this.semanticContext !== SemanticContext.NONE ? ("," + this.semanticContext.toString()) : "") +
            (this.reachesIntoOuterContext ? (",up=" + this.reachesIntoOuterContext) : "") + ")";
    }

}
