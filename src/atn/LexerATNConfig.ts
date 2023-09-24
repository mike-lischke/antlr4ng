/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DecisionState } from "./DecisionState.js";
import { ATNConfig } from "./ATNConfig.js";

export class LexerATNConfig extends ATNConfig {
    lexerActionExecutor: any;
    passedThroughNonGreedyDecision: any;
    constructor(params: any, config: any) {
        super(params, config);

        // This is the backing field for {@link //getLexerActionExecutor}.
        const lexerActionExecutor = params.lexerActionExecutor || null;
        this.lexerActionExecutor = lexerActionExecutor || (config !== null ? config.lexerActionExecutor : null);
        this.passedThroughNonGreedyDecision = config !== null ? this.checkNonGreedyDecision(config, this.state) : false;
        this.hashCodeForConfigSet = LexerATNConfig.prototype.hashCode;
        this.equalsForConfigSet = LexerATNConfig.prototype.equals;
        return this;
    }

    updateHashCode(hash: any) {
        hash.update(this.state.stateNumber, this.alt, this.context, this.semanticContext, this.passedThroughNonGreedyDecision, this.lexerActionExecutor);
    }

    equals(other: any) {
        return this === other ||
            (other instanceof LexerATNConfig &&
                this.passedThroughNonGreedyDecision === other.passedThroughNonGreedyDecision &&
                (this.lexerActionExecutor ? this.lexerActionExecutor.equals(other.lexerActionExecutor) : !other.lexerActionExecutor) &&
                super.equals(other));
    }

    checkNonGreedyDecision(source: any, target: any) {
        return source.passedThroughNonGreedyDecision ||
            (target instanceof DecisionState) && target.nonGreedy;
    }
}
