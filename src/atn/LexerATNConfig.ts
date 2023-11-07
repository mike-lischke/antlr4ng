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
import { HashCode } from "../misc/HashCode.js";

export interface ILexerATNConfigParameters {
    state: ATNState | null,
    alt?: number | null,
    context?: PredictionContext | null,
    lexerActionExecutor?: LexerActionExecutor | null,
};

export class LexerATNConfig extends ATNConfig {
    /**
     * This is the backing field for {@link #getLexerActionExecutor}.
     */
    public readonly lexerActionExecutor: LexerActionExecutor | null;

    public readonly passedThroughNonGreedyDecision: boolean;

    public constructor(params: ILexerATNConfigParameters, config: LexerATNConfig | null) {
        super(params, config);

        // This is the backing field for {@link getLexerActionExecutor}.
        this.lexerActionExecutor = params.lexerActionExecutor ?? config?.lexerActionExecutor ?? null;
        this.passedThroughNonGreedyDecision = config !== null ? this.checkNonGreedyDecision(config, this.state) : false;

        return this;
    }

    public override updateHashCode(hash: HashCode): void {
        hash.update(this.state.stateNumber, this.alt, this.context, this.semanticContext,
            this.passedThroughNonGreedyDecision, this.lexerActionExecutor);
    }

    public override equals(other: unknown): boolean {
        return this === other ||
            (other instanceof LexerATNConfig &&
                this.passedThroughNonGreedyDecision === other.passedThroughNonGreedyDecision &&
                (this.lexerActionExecutor
                    ? this.lexerActionExecutor.equals(other.lexerActionExecutor)
                    : !other.lexerActionExecutor
                ) && super.equals(other)
            );
    }

    public override hashCodeForConfigSet(): number {
        return this.hashCode();
    }

    public override equalsForConfigSet(other: unknown): boolean {
        return this.equals(other);
    }

    public checkNonGreedyDecision(source: LexerATNConfig, target: ATNState): boolean {
        return source.passedThroughNonGreedyDecision ||
            ((target instanceof DecisionState) && target.nonGreedy);
    }
}
