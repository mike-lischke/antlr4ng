/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import { SemanticContext } from "./SemanticContext.js";
import { HashCode } from "../misc/HashCode.js";
import { ATNState } from "./ATNState.js";
import { PredictionContext } from "./PredictionContext.js";
import { Recognizer } from "../Recognizer.js";
import { ATNSimulator } from "./ATNSimulator.js";

export interface IATNConfigParameters {
    state?: ATNState | null,
    alt?: number | null,
    context?: PredictionContext | null,
    semanticContext?: SemanticContext | null,
    reachesIntoOuterContext?: number | null,
    precedenceFilterSuppressed?: number,
};

export interface ICheckedConfigParameters {
    state: ATNState | null,
    alt: number | null,
    context: PredictionContext | null,
    semanticContext: SemanticContext | null,
    reachesIntoOuterContext: number | null,
    precedenceFilterSuppressed?: boolean,
};

const checkParams = (params: IATNConfigParameters | null): ICheckedConfigParameters => {
    if (params === null) {
        return {
            state: null,
            alt: null,
            context: null,
            semanticContext: null,
            reachesIntoOuterContext: null,
        };
    } else {
        return {
            state: params.state ?? null,
            alt: params.alt ?? null,
            context: params.context ?? null,
            semanticContext: params.semanticContext ?? null,
            reachesIntoOuterContext: null,
        };
    }
};

const checkConfig = (params: ATNConfig | null): ICheckedConfigParameters => {
    if (params === null) {
        return {
            state: null,
            alt: null,
            context: null,
            semanticContext: null,
            reachesIntoOuterContext: 0,
        };
    } else {
        const props = {
            state: params.state ?? null,
            alt: params.alt ?? null,
            context: params.context ?? null,
            semanticContext: params.semanticContext ?? null,
            reachesIntoOuterContext: params.reachesIntoOuterContext ?? 0,
            precedenceFilterSuppressed: params.precedenceFilterSuppressed ?? false,
        };

        return props;
    }
};

export class ATNConfig {
    /** The ATN state associated with this configuration */
    public readonly state: ATNState;

    /** What alt (or lexer rule) is predicted by this configuration */
    public readonly alt: number;

    /**
     * The stack of invoking states leading to the rule/states associated
     *  with this config.  We track only those contexts pushed during
     *  execution of the ATN simulator.
     */
    public context: PredictionContext | null;

    /**
     * We cannot execute predicates dependent upon local context unless
     * we know for sure we are in the correct context. Because there is
     * no way to do this efficiently, we simply cannot evaluate
     * dependent predicates unless we are in the rule that initially
     * invokes the ATN simulator.
     *
     * closure() tracks the depth of how far we dip into the outer context:
     * depth &gt; 0.  Note that it may not be totally accurate depth since I
     * don't ever decrement. TODO: make it a boolean then</p>
     */
    public reachesIntoOuterContext: number;

    public precedenceFilterSuppressed = false;

    public readonly semanticContext: SemanticContext;

    /**
     * @param {object} params A tuple: (ATN state, predicted alt, syntactic, semantic context).
     * The syntactic context is a graph-structured stack node whose
     * path(s) to the root is the rule invocation(s)
     * chain used to arrive at the state.  The semantic context is
     * the tree of semantic predicates encountered before reaching
     * an ATN state
     */
    public constructor(params: IATNConfigParameters, config: ATNConfig | null) {
        this.checkContext(params, config);
        const checkedParams = checkParams(params);
        const checkedConfig = checkConfig(config);

        this.state = checkedParams.state ?? checkedConfig.state!;
        this.alt = checkedParams.alt ?? checkedConfig.alt ?? 0;
        this.context = checkedParams.context ?? checkedConfig.context;
        this.semanticContext = checkedParams.semanticContext ?? (checkedConfig.semanticContext ?? SemanticContext.NONE);
        this.reachesIntoOuterContext = checkedConfig.reachesIntoOuterContext ?? 0;
        this.precedenceFilterSuppressed = checkedConfig.precedenceFilterSuppressed ?? false;
    }

    public hashCode(): number {
        const hash = new HashCode();
        this.updateHashCode(hash);

        return hash.finish();
    }

    public updateHashCode(hash: HashCode): void {
        hash.update(this.state.stateNumber, this.alt, this.context, this.semanticContext);
    }

    /**
     * An ATN configuration is equal to another if both have
     * the same state, they predict the same alternative, and
     * syntactic/semantic contexts are the same
     */
    public equals(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof ATNConfig)) {
            return false;
        } else {
            return (this.state.stateNumber === other.state.stateNumber) &&
                (this.alt === other.alt) &&
                (this.context === null ? other.context === null : this.context.equals(other.context)) &&
                this.semanticContext.equals(other.semanticContext) &&
                this.precedenceFilterSuppressed === other.precedenceFilterSuppressed;
        }
    }

    public hashCodeForConfigSet(): number {
        const hash = new HashCode();
        hash.update(this.state.stateNumber, this.alt, this.semanticContext);

        return hash.finish();
    }

    public equalsForConfigSet(other: unknown): boolean {
        if (this === other) {
            return true;
        } else if (!(other instanceof ATNConfig)) {
            return false;
        } else {
            return this.state.stateNumber === other.state.stateNumber &&
                this.alt === other.alt &&
                this.semanticContext.equals(other.semanticContext);
        }
    }

    public toString(_recog?: Recognizer<ATNSimulator> | null, showAlt = true): string {
        let alt = "";
        if (showAlt) {
            alt = "," + this.alt;
        }

        return "(" + this.state + alt +
            (this.context !== null ? ",[" + this.context.toString() + "]" : "") +
            (this.semanticContext !== SemanticContext.NONE ?
                ("," + this.semanticContext.toString())
                : "") +
            (this.reachesIntoOuterContext > 0 ?
                (",up=" + this.reachesIntoOuterContext)
                : "") + ")";
    }

    private checkContext(params: IATNConfigParameters, config: ATNConfig | null) {
        if ((params.context === null || params.context === undefined) &&
            (config === null || config.context === null || config.context === undefined)) {
            this.context = null;
        }
    }

}
