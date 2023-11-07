/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param */

import { ATN } from "./ATN.js";
import { SemanticContext } from "./SemanticContext.js";
import { merge } from "./PredictionContextUtils.js";
import { HashSet } from "../misc/HashSet.js";
import { HashCode } from "../misc/HashCode.js";

import { equalArrays, arrayToString } from "../utils/helpers.js";
import { ATNConfig } from "./ATNConfig.js";
import { BitSet } from "../misc/BitSet.js";
import { DoubleDict } from "../utils/DoubleDict.js";
import { PredictionContext } from "./PredictionContext.js";
import { ATNState } from "./ATNState.js";
import { ATNSimulator } from "./ATNSimulator.js";

const hashATNConfig = (c: ATNConfig) => {
    return c.hashCodeForConfigSet();
};

const equalATNConfigs = (a: ATNConfig, b: ATNConfig): boolean => {
    if (a === b) {
        return true;
    } else if (a === null || b === null) {
        return false;
    } else { return a.equalsForConfigSet(b); }
};

/**
 * Specialized {@link Set}{@code <}{@link ATNConfig}{@code >} that can track
 * info about the set, with support for combining similar configurations using a
 * graph-structured stack
 */
export class ATNConfigSet {
    // Track the elements as they are added to the set; supports get(i)///
    public configs: ATNConfig[] = [];

    /**
     * Used in parser and lexer. In lexer, it indicates we hit a pred
     * while computing a closure operation. Don't make a DFA state from this
     */
    public hasSemanticContext = false;
    public dipsIntoOuterContext = false;

    /**
     * Indicates that this configuration set is part of a full context
     * LL prediction. It will be used to determine how to merge $. With SLL
     * it's a wildcard whereas it is not for LL context merge
     */
    public readonly fullCtx: boolean;

    public uniqueAlt = 0;

    /**
     * The reason that we need this is because we don't want the hash map to use
     * the standard hash code and equals. We need all configurations with the
     * same
     * {@code (s,i,_,semctx)} to be equal. Unfortunately, this key effectively
     * doubles
     * the number of objects associated with ATNConfigs. The other solution is
     * to
     * use a hash table that lets us specify the equals/hashCode operation.
     * All configs but hashed by (s, i, _, pi) not including context. Wiped out
     * when we go readonly as this set becomes a DFA state
     */
    public configLookup = new HashSet<ATNConfig>(hashATNConfig, equalATNConfigs);

    public conflictingAlts: BitSet | null = null;

    /**
     * Indicates that the set of configurations is read-only. Do not
     * allow any code to manipulate the set; DFA states will point at
     * the sets and they must not change. This does not protect the other
     * fields; in particular, conflictingAlts is set after
     * we've made this readonly
     */
    public readOnly = false;

    private cachedHashCode = -1;

    // TODO: add iterator for configs.
    public constructor(fullCtx?: boolean) {
        this.fullCtx = fullCtx ?? true;
    }

    /**
     * Adding a new config means merging contexts with existing configs for
     * {@code (s, i, pi, _)}, where {@code s} is the
     * {@link ATNConfig//state}, {@code i} is the {@link ATNConfig//alt}, and
     * {@code pi} is the {@link ATNConfig//semanticContext}. We use
     * {@code (s,i,pi)} as key.
     *
     * <p>This method updates {@link dipsIntoOuterContext} and
     * {@link hasSemanticContext} when necessary.</p>
     */
    public add(config: ATNConfig,
        mergeCache?: DoubleDict<PredictionContext, PredictionContext, PredictionContext> | null): boolean {
        if (mergeCache === undefined) {
            mergeCache = null;
        }

        if (this.readOnly) {
            throw new Error("This set is readonly");
        }
        if (config.semanticContext !== SemanticContext.NONE) {
            this.hasSemanticContext = true;
        }
        if (config.reachesIntoOuterContext > 0) {
            this.dipsIntoOuterContext = true;
        }
        const existing = this.configLookup.add(config);
        if (existing === config) {
            this.cachedHashCode = -1;
            this.configs.push(config); // track order here

            return true;
        }
        // a previous (s,i,pi,_), merge with it and save result
        const rootIsWildcard = !this.fullCtx;
        const merged = merge(existing.context!, config.context!, rootIsWildcard, mergeCache);
        /**
         * no need to check for existing.context, config.context in cache
         * since only way to create new graphs is "call rule" and here. We
         * cache at both places
         */
        existing.reachesIntoOuterContext = Math.max(existing.reachesIntoOuterContext, config.reachesIntoOuterContext);
        // make sure to preserve the precedence filter suppression during the merge
        if (config.precedenceFilterSuppressed) {
            existing.precedenceFilterSuppressed = true;
        }
        existing.context = merged; // replace context; no need to alt mapping

        return true;
    }

    public getStates(): HashSet<ATNState> {
        const states = new HashSet<ATNState>();
        for (const config of this.configs) {
            states.add(config.state);
        }

        return states;
    }

    public getPredicates(): SemanticContext[] {
        const preds = [];
        for (const config of this.configs) {
            if (config.semanticContext !== SemanticContext.NONE) {
                preds.push(config.semanticContext);
            }
        }

        return preds;
    }

    public optimizeConfigs(interpreter: ATNSimulator): void {
        if (this.readOnly) {
            throw new Error("This set is readonly");
        }

        if (this.configLookup.length === 0) {
            return;
        }

        for (const config of this.configs) {
            config.context = interpreter.getCachedContext(config.context!);
        }
    }

    public addAll(coll: ATNConfig[]): boolean {
        for (const config of coll) {
            this.add(config, null);
        }

        return false;
    }

    public equals(other: unknown): boolean {
        return this === other ||
            (other instanceof ATNConfigSet &&
                equalArrays(this.configs, other.configs) &&
                this.fullCtx === other.fullCtx &&
                this.uniqueAlt === other.uniqueAlt &&
                this.conflictingAlts === other.conflictingAlts &&
                this.hasSemanticContext === other.hasSemanticContext &&
                this.dipsIntoOuterContext === other.dipsIntoOuterContext);
    }

    public hashCode(): number {
        const hash = new HashCode();
        hash.update(this.configs);

        return hash.finish();
    }

    public updateHashCode(hash: HashCode): void {
        if (this.readOnly) {
            if (this.cachedHashCode === -1) {
                this.cachedHashCode = this.hashCode();
            }
            hash.update(this.cachedHashCode);
        } else {
            hash.update(this.hashCode());
        }
    }

    public isEmpty(): boolean {
        return this.configs.length === 0;
    }

    public contains(item: ATNConfig): boolean {
        if (this.configLookup === null) {
            throw new Error("This method is not implemented for readonly sets.");
        }

        return this.configLookup.has(item);
    }

    public containsFast(item: ATNConfig): boolean {
        if (this.configLookup === null) {
            throw new Error("This method is not implemented for readonly sets.");
        }

        return this.configLookup.has(item);
    }

    public clear(): void {
        if (this.readOnly) {
            throw new Error("This set is readonly");
        }
        this.configs = [];
        this.cachedHashCode = -1;
        this.configLookup = new HashSet();
    }

    public setReadonly(readOnly: boolean): void {
        this.readOnly = readOnly;
        if (readOnly) {
            this.configLookup = new HashSet(); // can't mod, no need for lookup cache
        }
    }

    public toString(): string {
        return arrayToString(this.configs) +
            (this.hasSemanticContext ? ",hasSemanticContext=" + this.hasSemanticContext : "") +
            (this.uniqueAlt !== ATN.INVALID_ALT_NUMBER ? ",uniqueAlt=" + this.uniqueAlt : "") +
            (this.conflictingAlts !== null ? ",conflictingAlts=" + this.conflictingAlts : "") +
            (this.dipsIntoOuterContext ? ",dipsIntoOuterContext" : "");
    }

    public get items(): ATNConfig[] {
        return this.configs;
    }

    public get length(): number {
        return this.configs.length;
    }
}
