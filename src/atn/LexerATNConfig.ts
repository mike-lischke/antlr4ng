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

    #cachedHashCode: number | undefined;

    public constructor(params: ILexerATNConfigParameters, config: LexerATNConfig | null) {
        super(params, config);

        this.lexerActionExecutor = params.lexerActionExecutor ?? config?.lexerActionExecutor ?? null;
        this.passedThroughNonGreedyDecision = config !== null
            ? LexerATNConfig.checkNonGreedyDecision(config, this.state)
            : false;

        return this;
    }

    private static checkNonGreedyDecision(source: LexerATNConfig, target: ATNState): boolean {
        return source.passedThroughNonGreedyDecision ||
            ((target instanceof DecisionState) && target.nonGreedy);
    }

    public override hashCode(): number {
        if (this.#cachedHashCode === undefined) {
            let hashCode = MurmurHash.initialize(7);
            hashCode = MurmurHash.update(hashCode, this.state.stateNumber);
            hashCode = MurmurHash.update(hashCode, this.alt);
            hashCode = MurmurHash.update(hashCode, this.context);
            hashCode = MurmurHash.update(hashCode, this.semanticContext);
            hashCode = MurmurHash.update(hashCode, this.passedThroughNonGreedyDecision ? 1 : 0);
            hashCode = MurmurHash.update(hashCode, this.lexerActionExecutor);
            hashCode = MurmurHash.finish(hashCode, 6);
            this.#cachedHashCode = hashCode;

        }

        return this.#cachedHashCode;
    }

    public override equals(other: LexerATNConfig): boolean {
        if (this === other) {
            return true;
        }

        return this.passedThroughNonGreedyDecision === other.passedThroughNonGreedyDecision &&
            (this.lexerActionExecutor
                ? this.lexerActionExecutor.equals(other.lexerActionExecutor)
                : !other.lexerActionExecutor
            ) && super.equals(other);

    }

    public override hashCodeForConfigSet(): number {
        return this.hashCode();
    }

    public override equalsForConfigSet(other: LexerATNConfig): boolean {
        return this.equals(other);
    }
}
