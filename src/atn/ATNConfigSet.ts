/* eslint-disable jsdoc/require-jsdoc, jsdoc/no-undefined-types, jsdoc/require-param, jsdoc/require-returns, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line @typescript-eslint/quotes
import { ATN } from './ATN.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { SemanticContext } from './SemanticContext.js';
// eslint-disable-next-line @typescript-eslint/quotes
import { merge } from './PredictionContextUtils.js';
import { arrayToString } from "../utils/arrayToString.js";
import { HashSet } from "../misc/HashSet.js";
import { equalArrays } from "../utils/equalArrays.js";
import { HashCode } from "../misc/HashCode.js";

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function hashATNConfig(c: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return c.hashCodeForConfigSet();
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-explicit-any
function equalATNConfigs(a: any, b: any) {
    if (a === b) {
        return true;
    } else if (a === null || b === null) {
        return false;
    } else
        // eslint-disable-next-line curly, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return a.equalsForConfigSet(b);
}

/**
 * Specialized {@link Set}{@code <}{@link ATNConfig}{@code >} that can track
 * info about the set, with support for combining similar configurations using a
 * graph-structured stack
 */
export class ATNConfigSet {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    cachedHashCode: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    configLookup: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    configs: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    conflictingAlts: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    dipsIntoOuterContext: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    fullCtx: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    hasSemanticContext: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    readOnly: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    uniqueAlt: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(fullCtx: any) {
        /**
         * The reason that we need this is because we don't want the hash map to use
         * the standard hash code and equals. We need all configurations with the
         * same
         * {@code (s,i,_,semctx)} to be equal. Unfortunately, this key effectively
         * doubles
         * the number of objects associated with ATNConfigs. The other solution is
         * to
         * use a hash table that lets us specify the equals/hashcode operation.
         * All configs but hashed by (s, i, _, pi) not including context. Wiped out
         * when we go readonly as this set becomes a DFA state
         */
        this.configLookup = new HashSet(hashATNConfig, equalATNConfigs);
        /**
         * Indicates that this configuration set is part of a full context
         * LL prediction. It will be used to determine how to merge $. With SLL
         * it's a wildcard whereas it is not for LL context merge
         */
        this.fullCtx = fullCtx === undefined ? true : fullCtx;
        /**
         * Indicates that the set of configurations is read-only. Do not
         * allow any code to manipulate the set; DFA states will point at
         * the sets and they must not change. This does not protect the other
         * fields; in particular, conflictingAlts is set after
         * we've made this readonly
         */
        this.readOnly = false;
        // Track the elements as they are added to the set; supports get(i)///
        this.configs = [];

        // TODO: these fields make me pretty uncomfortable but nice to pack up info
        // together, saves recomputation
        // TODO: can we track conflicts as they are added to save scanning configs
        // later?
        this.uniqueAlt = 0;
        this.conflictingAlts = null;

        /**
         * Used in parser and lexer. In lexer, it indicates we hit a pred
         * while computing a closure operation. Don't make a DFA state from this
         */
        this.hasSemanticContext = false;
        this.dipsIntoOuterContext = false;

        this.cachedHashCode = -1;
    }

    /**
     * Adding a new config means merging contexts with existing configs for
     * {@code (s, i, pi, _)}, where {@code s} is the
     * {@link ATNConfig//state}, {@code i} is the {@link ATNConfig//alt}, and
     * {@code pi} is the {@link ATNConfig//semanticContext}. We use
     * {@code (s,i,pi)} as key.
     *
     * <p>This method updates {@link //dipsIntoOuterContext} and
     * {@link //hasSemanticContext} when necessary.</p>
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    add(config: any, mergeCache: any) {
        if (mergeCache === undefined) {
            mergeCache = null;
        }
        if (this.readOnly) {
            // eslint-disable-next-line no-throw-literal
            throw "This set is readonly";
        }
        // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
        if (config.semanticContext !== SemanticContext.NONE) {
            this.hasSemanticContext = true;
        }
        if (config.reachesIntoOuterContext > 0) {
            this.dipsIntoOuterContext = true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const existing = this.configLookup.add(config);
        if (existing === config) {
            this.cachedHashCode = -1;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.configs.push(config); // track order here
            // eslint-disable-next-line padding-line-between-statements
            return true;
        }
        // a previous (s,i,pi,_), merge with it and save result
        const rootIsWildcard = !this.fullCtx;
        const merged = merge(existing.context, config.context, rootIsWildcard, mergeCache);
        /**
         * no need to check for existing.context, config.context in cache
         * since only way to create new graphs is "call rule" and here. We
         * cache at both places
         */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        existing.reachesIntoOuterContext = Math.max(existing.reachesIntoOuterContext, config.reachesIntoOuterContext);
        // make sure to preserve the precedence filter suppression during the merge
        if (config.precedenceFilterSuppressed) {
            existing.precedenceFilterSuppressed = true;
        }
        existing.context = merged; // replace context; no need to alt mapping
        // eslint-disable-next-line padding-line-between-statements
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getStates() {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        const states = new HashSet();
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.configs.length; i++) {
            states.add(this.configs[i].state);
        }
        // eslint-disable-next-line padding-line-between-statements
        return states;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getPredicates() {
        const preds = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.configs.length; i++) {
            const c = this.configs[i].semanticContext;
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            if (c !== SemanticContext.NONE) {
                preds.push(c.semanticContext);
            }
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return preds;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    optimizeConfigs(interpreter: any) {
        if (this.readOnly) {
            // eslint-disable-next-line no-throw-literal
            throw "This set is readonly";
        }
        if (this.configLookup.length === 0) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.configs.length; i++) {
            const config = this.configs[i];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            config.context = interpreter.getCachedContext(config.context);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    addAll(coll: any) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < coll.length; i++) {
            // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
            this.add(coll[i]);
        }
        // eslint-disable-next-line padding-line-between-statements
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    equals(other: any) {
        return this === other ||
            (other instanceof ATNConfigSet &&
                equalArrays(this.configs, other.configs) &&
                this.fullCtx === other.fullCtx &&
                this.uniqueAlt === other.uniqueAlt &&
                this.conflictingAlts === other.conflictingAlts &&
                this.hasSemanticContext === other.hasSemanticContext &&
                this.dipsIntoOuterContext === other.dipsIntoOuterContext);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    hashCode() {
        const hash = new HashCode();
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        hash.update(this.configs);
        // eslint-disable-next-line padding-line-between-statements
        return hash.finish();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    updateHashCode(hash: any) {
        if (this.readOnly) {
            if (this.cachedHashCode === -1) {
                this.cachedHashCode = this.hashCode();
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            hash.update(this.cachedHashCode);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            hash.update(this.hashCode());
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    isEmpty() {
        return this.configs.length === 0;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    contains(item: any) {
        if (this.configLookup === null) {
            // eslint-disable-next-line no-throw-literal
            throw "This method is not implemented for readonly sets.";
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return this.configLookup.contains(item);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    containsFast(item: any) {
        if (this.configLookup === null) {
            // eslint-disable-next-line no-throw-literal
            throw "This method is not implemented for readonly sets.";
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return this.configLookup.containsFast(item);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    clear() {
        if (this.readOnly) {
            // eslint-disable-next-line no-throw-literal
            throw "This set is readonly";
        }
        this.configs = [];
        this.cachedHashCode = -1;
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        this.configLookup = new HashSet();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    setReadonly(readOnly: any) {
        this.readOnly = readOnly;
        if (readOnly) {
            this.configLookup = null; // can't mod, no need for lookup cache
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    toString() {
        return arrayToString(this.configs) +
            (this.hasSemanticContext ? ",hasSemanticContext=" + this.hasSemanticContext : "") +
            // @ts-expect-error TS(2339): Property 'INVALID_ALT_NUMBER' does not exist on ty... Remove this comment to see the full error message
            (this.uniqueAlt !== ATN.INVALID_ALT_NUMBER ? ",uniqueAlt=" + this.uniqueAlt : "") +
            (this.conflictingAlts !== null ? ",conflictingAlts=" + this.conflictingAlts : "") +
            (this.dipsIntoOuterContext ? ",dipsIntoOuterContext" : "");
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get items() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.configs;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    get length() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.configs.length;
    }
}
