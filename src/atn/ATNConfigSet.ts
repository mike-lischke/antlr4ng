/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-returns, jsdoc/require-param, max-classes-per-file */

import { ATN } from "./ATN.js";
import { SemanticContext } from "./SemanticContext.js";
import { merge } from "./PredictionContextUtils.js";

import { equalArrays, arrayToString } from "../utils/helpers.js";
import { ATNConfig } from "./ATNConfig.js";
import { BitSet } from "../misc/BitSet.js";
import { DoubleDict } from "../utils/DoubleDict.js";
import { PredictionContext } from "./PredictionContext.js";
import { ATNState } from "./ATNState.js";
import { ATNSimulator } from "./ATNSimulator.js";
import { MurmurHash } from "../utils/MurmurHash.js";
import { HashSet } from "../misc/HashSet.js";
import type { EqualityComparator } from "../misc/EqualityComparator.js";

class KeyTypeEqualityComparer implements EqualityComparator<ATNConfig> {
    public static readonly instance = new KeyTypeEqualityComparer();

    public hashCode(config: ATNConfig) {
        let hashCode = 7;
        hashCode = 31 * hashCode + config.state.stateNumber;
        hashCode = 31 * hashCode + config.alt;
        hashCode = 31 * hashCode + config.semanticContext.hashCode();

        return hashCode;
    }

    public equals(a: ATNConfig, b: ATNConfig) {
        if (a === b) {
            return true;
        }

        return a.state.stateNumber === b.state.stateNumber &&
            a.alt === b.alt &&
            a.semanticContext.equals(b.semanticContext);
    }
}

/**
 * Specialized {@link HashSet}`<`{@link ATNConfig}`>` that can track
 * info about the set, with support for combining similar configurations using a
 * graph-structured stack
 */
export class ATNConfigSet {
    /**
     * The reason that we need this is because we don't want the hash map to use
     * the standard hash code and equals. We need all configurations with the
     * same
     * `(s,i,_,semctx)` to be equal. Unfortunately, this key effectively
     * doubles
     * the number of objects associated with ATNConfigs. The other solution is
     * to
     * use a hash table that lets us specify the equals/hashCode operation.
     * All configs but hashed by (s, i, _, pi) not including context. Wiped out
     * when we go readonly as this set becomes a DFA state
     */
    public configLookup: HashSet<ATNConfig> | null =
        new HashSet<ATNConfig>(KeyTypeEqualityComparer.instance);

    // Track the elements as they are added to the set; supports get(i).
    public configs: ATNConfig[] = [];

    public uniqueAlt = 0;

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
    public readonly fullCtx: boolean = false;

    /**
     * Indicates that the set of configurations is read-only. Do not
     * allow any code to manipulate the set; DFA states will point at
     * the sets and they must not change. This does not protect the other
     * fields; in particular, conflictingAlts is set after
     * we've made this readonly
     */
    public readOnly = false;

    public conflictingAlts: BitSet | null = null;

    /**
     * Tracks the first config that has a rule stop state. Avoids frequent linear search for that, when adding
     * a DFA state in the lexer ATN simulator.
     */
    public firstStopState?: ATNConfig;

    #cachedHashCode = -1;

    public constructor(fullCtxOrOldSet?: boolean | ATNConfigSet) {
        if (fullCtxOrOldSet !== undefined) {
            if (typeof fullCtxOrOldSet === "boolean") {
                this.fullCtx = fullCtxOrOldSet ?? true;
            } else {
                const old = fullCtxOrOldSet;

                this.addAll(old.configs);
                this.uniqueAlt = old.uniqueAlt;
                this.conflictingAlts = old.conflictingAlts;
                this.hasSemanticContext = old.hasSemanticContext;
                this.dipsIntoOuterContext = old.dipsIntoOuterContext;
            }
        }
    }

    public [Symbol.iterator](): IterableIterator<ATNConfig> {
        return this.configs[Symbol.iterator]();
    }

    /**
     * Adding a new config means merging contexts with existing configs for
     * `(s, i, pi, _)`, where `s` is the {@link ATNConfig.state}, `i` is the {@link ATNConfig.alt}, and
     * `pi` is the {@link ATNConfig.semanticContext}. We use `(s,i,pi)` as key.
     *
     * This method updates {@link dipsIntoOuterContext} and
     * {@link hasSemanticContext} when necessary.
     */
    public add(config: ATNConfig,
        mergeCache: DoubleDict<PredictionContext, PredictionContext, PredictionContext> | null = null): void {
        if (this.readOnly) {
            throw new Error("This set is readonly");
        }

        if (!this.firstStopState && (config.state.constructor as typeof ATNState).stateType === ATNState.RULE_STOP) {
            this.firstStopState = config;
        }

        this.hasSemanticContext ||= config.semanticContext !== SemanticContext.NONE;
        this.dipsIntoOuterContext ||= config.reachesIntoOuterContext;

        const existing = this.configLookup!.getOrAdd(config);
        if (existing === config) {
            this.#cachedHashCode = -1;
            this.configs.push(config); // track order here

            return;
        }

        // a previous (s,i,pi,_), merge with it and save result
        const rootIsWildcard = !this.fullCtx;
        const merged = merge(existing.context!, config.context!, rootIsWildcard, mergeCache);

        /**
         * no need to check for existing.context, config.context in cache
         * since only way to create new graphs is "call rule" and here. We
         * cache at both places
         */
        existing.reachesIntoOuterContext ||= config.reachesIntoOuterContext;

        // make sure to preserve the precedence filter suppression during the merge
        existing.precedenceFilterSuppressed ||= config.precedenceFilterSuppressed;

        existing.context = merged; // replace context; no need to alt mapping
    }

    /** Return a List holding list of configs */
    public get elements(): ATNConfig[] {
        return this.configs;
    }

    /**
     * Gets the complete set of represented alternatives for the configuration set.
     *
     * @returns the set of represented alternatives in this configuration set
     */
    public getAlts(): BitSet {
        const alts = new BitSet();
        for (const config of this.configs) {
            alts.set(config.alt);
        }

        return alts;
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

    public getStates(): HashSet<ATNState> {
        const states = new HashSet<ATNState>();
        for (const config of this.configs) {
            states.add(config.state);
        }

        return states;
    }

    public optimizeConfigs(interpreter: ATNSimulator): void {
        if (this.readOnly) {
            throw new Error("This set is readonly");
        }

        if (this.configLookup!.size === 0) {
            return;
        }

        for (const config of this.configs) {
            config.context = interpreter.getCachedContext(config.context!);
        }
    }

    public addAll(coll: ATNConfig[]): boolean {
        for (const config of coll) {
            this.add(config);
        }

        return false;
    }

    public equals(other: ATNConfigSet): boolean {
        if (this === other) {
            return true;
        }

        if (this.fullCtx === other.fullCtx &&
            this.uniqueAlt === other.uniqueAlt &&
            this.conflictingAlts === other.conflictingAlts &&
            this.hasSemanticContext === other.hasSemanticContext &&
            this.dipsIntoOuterContext === other.dipsIntoOuterContext &&
            equalArrays(this.configs, other.configs)) {

            return true;
        }

        return false;
    }

    public hashCode(): number {
        if (this.#cachedHashCode === -1) {
            this.#cachedHashCode = this.computeHashCode();
        }

        return this.#cachedHashCode;
    }

    public get length(): number {
        return this.configs.length;
    }

    public isEmpty(): boolean {
        return this.configs.length === 0;
    }

    public contains(item: ATNConfig): boolean {
        if (this.configLookup === null) {
            throw new Error("This method is not implemented for readonly sets.");
        }

        return this.configLookup.contains(item);
    }

    public containsFast(item: ATNConfig): boolean {
        if (this.configLookup === null) {
            throw new Error("This method is not implemented for readonly sets.");
        }

        return this.configLookup.contains(item);
    }

    public clear(): void {
        if (this.readOnly) {
            throw new Error("This set is readonly");
        }
        this.configs = [];
        this.#cachedHashCode = -1;
        this.configLookup = new HashSet(KeyTypeEqualityComparer.instance);
    }

    public setReadonly(readOnly: boolean): void {
        this.readOnly = readOnly;
        if (readOnly) {
            this.configLookup = null; // can't mod, no need for lookup cache
        }
    }

    public toString(): string {
        return arrayToString(this.configs) +
            (this.hasSemanticContext ? ",hasSemanticContext=" + this.hasSemanticContext : "") +
            (this.uniqueAlt !== ATN.INVALID_ALT_NUMBER ? ",uniqueAlt=" + this.uniqueAlt : "") +
            (this.conflictingAlts !== null ? ",conflictingAlts=" + this.conflictingAlts : "") +
            (this.dipsIntoOuterContext ? ",dipsIntoOuterContext" : "");
    }

    private computeHashCode(): number {
        let hash = MurmurHash.initialize();
        this.configs.forEach((config) => {
            hash = MurmurHash.update(hash, config.hashCode());
        });
        hash = MurmurHash.finish(hash, this.configs.length);

        return hash;
    }
}
