/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionState } from "./DecisionState.js";
import { ATNConfig } from "./ATNConfig.js";
import { LexerActionExecutor } from "./LexerActionExecutor.js";
import { ATNState } from "./ATNState.js";
import { PredictionContext } from "./PredictionContext.js";
import { MurmurHash } from "../utils/MurmurHash.js";
import { SemanticContext } from "./index.js";

export class LexerATNConfig extends ATNConfig {
    /**
     * This is the backing field for {@link #getLexerActionExecutor}.
     */
    public readonly lexerActionExecutor: LexerActionExecutor | null;

    public readonly passedThroughNonGreedyDecision: boolean;

    public constructor(config: Partial<LexerATNConfig>, state: ATNState, context: PredictionContext | null,
        lexerActionExecutor: LexerActionExecutor | null) {
        super(config, state, context ?? config.context!, context ? SemanticContext.NONE : config.semanticContext);

        this.lexerActionExecutor = context ? lexerActionExecutor : config.lexerActionExecutor ?? null;
        this.passedThroughNonGreedyDecision = LexerATNConfig.checkNonGreedyDecision(config, this.state);

        return this;
    }

    public static createWithExecutor(config: LexerATNConfig, state: ATNState,
        lexerActionExecutor: LexerActionExecutor | null): LexerATNConfig {
        return new LexerATNConfig(config, state, config.context, lexerActionExecutor);
    }

    public static override createWithConfig(state: ATNState, config: LexerATNConfig,
        context?: PredictionContext): LexerATNConfig {

        return new LexerATNConfig(config, state, context ?? null, config.lexerActionExecutor);
    }

    public static override createWithContext(state: ATNState, alt: number, context: PredictionContext): LexerATNConfig {
        return new LexerATNConfig({ alt }, state, context, null);
    }

    private static checkNonGreedyDecision(source: Partial<LexerATNConfig>, target: ATNState): boolean {
        return source.passedThroughNonGreedyDecision ||
            (("nonGreedy" in target) && (target as DecisionState).nonGreedy);
    }

    public override hashCode(): number {
        if (this.cachedHashCode === undefined) {
            let hashCode = MurmurHash.initialize(7);
            hashCode = MurmurHash.update(hashCode, this.state.stateNumber);
            hashCode = MurmurHash.update(hashCode, this.alt);
            hashCode = MurmurHash.updateFromComparable(hashCode, this.context);
            hashCode = MurmurHash.updateFromComparable(hashCode, this.semanticContext);
            hashCode = MurmurHash.update(hashCode, this.passedThroughNonGreedyDecision ? 1 : 0);
            hashCode = MurmurHash.updateFromComparable(hashCode, this.lexerActionExecutor);
            hashCode = MurmurHash.finish(hashCode, 6);
            this.cachedHashCode = hashCode;
        }

        return this.cachedHashCode;
    }

    public override equals(other: LexerATNConfig): boolean {
        if (this === other) {
            return true;
        }

        return this.passedThroughNonGreedyDecision === other.passedThroughNonGreedyDecision &&
            (this.lexerActionExecutor && other.lexerActionExecutor
                ? this.lexerActionExecutor.equals(other.lexerActionExecutor)
                : !other.lexerActionExecutor
            ) && super.equals(other);

    }

}
