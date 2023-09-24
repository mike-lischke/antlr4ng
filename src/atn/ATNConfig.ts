/* eslint-disable jsdoc/require-jsdoc, jsdoc/require-param, jsdoc/check-types, jsdoc/require-returns */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { SemanticContext } from './SemanticContext.js';
import { HashCode } from "../misc/HashCode.js";

function checkParams(params: any, isCfg: any) {
    if (params === null) {
        const result = { state: null, alt: null, context: null, semanticContext: null };
        if (isCfg) {
            // @ts-expect-error TS(2339): Property 'reachesIntoOuterContext' does not exist ... Remove this comment to see the full error message
            result.reachesIntoOuterContext = 0;
        }
        return result;
    } else {
        const props = {};
        // @ts-expect-error TS(2339): Property 'state' does not exist on type '{}'.
        props.state = params.state || null;
        // @ts-expect-error TS(2339): Property 'alt' does not exist on type '{}'.
        props.alt = (params.alt === undefined) ? null : params.alt;
        // @ts-expect-error TS(2339): Property 'context' does not exist on type '{}'.
        props.context = params.context || null;
        // @ts-expect-error TS(2339): Property 'semanticContext' does not exist on type ... Remove this comment to see the full error message
        props.semanticContext = params.semanticContext || null;
        if (isCfg) {
            // @ts-expect-error TS(2339): Property 'reachesIntoOuterContext' does not exist ... Remove this comment to see the full error message
            props.reachesIntoOuterContext = params.reachesIntoOuterContext || 0;
            // @ts-expect-error TS(2339): Property 'precedenceFilterSuppressed' does not exi... Remove this comment to see the full error message
            props.precedenceFilterSuppressed = params.precedenceFilterSuppressed || false;
        }
        return props;
    }
}

export class ATNConfig {
    alt: any;
    context: any;
    precedenceFilterSuppressed: any;
    reachesIntoOuterContext: any;
    semanticContext: any;
    state: any;
    /**
     * @param {Object} params A tuple: (ATN state, predicted alt, syntactic, semantic context).
     * The syntactic context is a graph-structured stack node whose
     * path(s) to the root is the rule invocation(s)
     * chain used to arrive at the state.  The semantic context is
     * the tree of semantic predicates encountered before reaching
     * an ATN state
     */
    constructor(params: any, config: any) {
        this.checkContext(params, config);
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        params = checkParams(params);
        config = checkParams(config, true);
        // The ATN state associated with this configuration///
        this.state = params.state !== null ? params.state : config.state;
        // What alt (or lexer rule) is predicted by this configuration///
        this.alt = params.alt !== null ? params.alt : config.alt;
        /**
         * The stack of invoking states leading to the rule/states associated
         * with this config.  We track only those contexts pushed during
         * execution of the ATN simulator
         */
        this.context = params.context !== null ? params.context : config.context;
        this.semanticContext = params.semanticContext !== null ? params.semanticContext :
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            (config.semanticContext !== null ? config.semanticContext : SemanticContext.NONE);
        // TODO: make it a boolean then
        /**
         * We cannot execute predicates dependent upon local context unless
         * we know for sure we are in the correct context. Because there is
         * no way to do this efficiently, we simply cannot evaluate
         * dependent predicates unless we are in the rule that initially
         * invokes the ATN simulator.
         * closure() tracks the depth of how far we dip into the
         * outer context: depth &gt; 0.  Note that it may not be totally
         * accurate depth since I don't ever decrement
         */
        this.reachesIntoOuterContext = config.reachesIntoOuterContext;
        this.precedenceFilterSuppressed = config.precedenceFilterSuppressed;
    }

    checkContext(params: any, config: any) {
        if ((params.context === null || params.context === undefined) &&
            (config === null || config.context === null || config.context === undefined)) {
            this.context = null;
        }
    }

    hashCode() {
        const hash = new HashCode();
        this.updateHashCode(hash);
        return hash.finish();
    }

    updateHashCode(hash: any) {
        hash.update(this.state.stateNumber, this.alt, this.context, this.semanticContext);
    }

    /**
     * An ATN configuration is equal to another if both have
     * the same state, they predict the same alternative, and
     * syntactic/semantic contexts are the same
     */
    equals(other: any) {
        if (this === other) {
            return true;
        } else if (!(other instanceof ATNConfig)) {
            return false;
        } else {
            return this.state.stateNumber === other.state.stateNumber &&
                this.alt === other.alt &&
                (this.context === null ? other.context === null : this.context.equals(other.context)) &&
                this.semanticContext.equals(other.semanticContext) &&
                this.precedenceFilterSuppressed === other.precedenceFilterSuppressed;
        }
    }

    hashCodeForConfigSet() {
        const hash = new HashCode();
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 3.
        hash.update(this.state.stateNumber, this.alt, this.semanticContext);
        return hash.finish();
    }

    equalsForConfigSet(other: any) {
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

    toString() {
        return "(" + this.state + "," + this.alt +
            (this.context !== null ? ",[" + this.context.toString() + "]" : "") +
            // @ts-expect-error TS(2339): Property 'NONE' does not exist on type 'typeof Sem... Remove this comment to see the full error message
            (this.semanticContext !== SemanticContext.NONE ?
                ("," + this.semanticContext.toString())
                : "") +
            (this.reachesIntoOuterContext > 0 ?
                (",up=" + this.reachesIntoOuterContext)
                : "") + ")";
    }
}
