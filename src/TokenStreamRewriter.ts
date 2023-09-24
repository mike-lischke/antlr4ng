/* eslint-disable jsdoc/require-returns-description, jsdoc/tag-lines, jsdoc/require-param-description, jsdoc/require-returns, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// eslint-disable-next-line max-classes-per-file
import { Token } from "./Token.js";
import { Interval } from "./misc/Interval.js";

/**
 * @typedef {import("./CommonTokenStream").default} CommonTokenStream
 * @typedef {Array<RewriteOperation | undefined>} Rewrites
 * @typedef {unknown} Text
 */

export class TokenStreamRewriter {
    // eslint-disable-next-line no-undef, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention
    static DEFAULT_PROGRAM_NAME = "default";

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    programs: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokens: any;

    /**
     * @param {CommonTokenStream} tokens The token stream to modify
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(tokens: any) {
        this.tokens = tokens;
        /** @type {Map<string, Rewrites>} */
        this.programs = new Map();
    }

    /**
     * @returns {CommonTokenStream}
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    getTokenStream() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.tokens;
    }

    /**
     * Insert the supplied text after the specified token (or token index)
     * @param {Token | number} tokenOrIndex
     * @param {Text} text
     * @param {string} [programName]
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    insertAfter(tokenOrIndex: any, text: any, programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME) {
        /** @type {number} */
        let index;
        if (typeof tokenOrIndex === "number") {
            index = tokenOrIndex;
        } else {
            index = tokenOrIndex.tokenIndex;
        }

        // to insert after, just insert before next index (even if past end)
        // eslint-disable-next-line prefer-const
        let rewrites = this.getProgram(programName);
        // eslint-disable-next-line prefer-const, @typescript-eslint/no-use-before-define
        let op = new InsertAfterOp(this.tokens, index, rewrites.length, text);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        rewrites.push(op);
    }

    /**
     * Insert the supplied text before the specified token (or token index)
     * @param {Token | number} tokenOrIndex
     * @param {Text} text
     * @param {string} [programName]
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    insertBefore(tokenOrIndex: any, text: any, programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME) {
        /** @type {number} */
        let index;
        if (typeof tokenOrIndex === "number") {
            index = tokenOrIndex;
        } else {
            index = tokenOrIndex.tokenIndex;
        }

        const rewrites = this.getProgram(programName);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const op = new InsertBeforeOp(this.tokens, index, rewrites.length, text);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        rewrites.push(op);
    }

    /**
     * Replace the specified token with the supplied text
     * @param {Token | number} tokenOrIndex
     * @param {Text} text
     * @param {string} [programName]
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    replaceSingle(tokenOrIndex: any, text: any, programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME) {
        this.replace(tokenOrIndex, tokenOrIndex, text, programName);
    }

    /**
     * Replace the specified range of tokens with the supplied text
     * @param {Token | number} from
     * @param {Token | number} to
     * @param {Text} text
     * @param {string} [programName]
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    replace(from: any, to: any, text: any, programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME) {
        if (typeof from !== "number") {
            from = from.tokenIndex;
        }
        if (typeof to !== "number") {
            to = to.tokenIndex;
        }
        if (from > to || from < 0 || to < 0 || to >= this.tokens.size) {
            throw new RangeError(`replace: range invalid: ${from}..${to}(size=${this.tokens.size})`);
        }
        // eslint-disable-next-line prefer-const
        let rewrites = this.getProgram(programName);
        // eslint-disable-next-line prefer-const, @typescript-eslint/no-use-before-define
        let op = new ReplaceOp(this.tokens, from, to, rewrites.length, text);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        rewrites.push(op);
    }

    /**
     * Delete the specified range of tokens
     * @param {number | Token} from
     * @param {number | Token} to
     * @param {string} [programName]
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    delete(from: any, to: any, programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME) {
        if (typeof to === "undefined") {
            to = from;
        }
        this.replace(from, to, null, programName);
    }

    /**
     * @param {string} name
     * @returns {Rewrites}
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getProgram(name: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        let is = this.programs.get(name);
        if (is == null) {
            is = this.initializeProgram(name);
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return is;
    }

    /**
     * @param {string} name
     * @returns {Rewrites}
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    initializeProgram(name: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const is: any = [];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.programs.set(name, is);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return is;
    }

    /**
     * Return the text from the original tokens altered per the instructions given to this rewriter
     * @param {Interval | string} [intervalOrProgram]
     * @param {string} [programName]
     * @returns {string}
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getText(intervalOrProgram: any, programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME) {
        let interval;
        if (intervalOrProgram instanceof Interval) {
            interval = intervalOrProgram;
        } else {
            interval = new Interval(0, this.tokens.size - 1);
        }

        if (typeof intervalOrProgram === "string") {
            programName = intervalOrProgram;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const rewrites = this.programs.get(programName);
        let start = interval.start;
        let stop = interval.stop;

        // ensure start/end are in range
        if (stop > this.tokens.size - 1) {
            stop = this.tokens.size - 1;
        }
        if (start < 0) {
            start = 0;
        }

        if (rewrites == null || rewrites.length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            return this.tokens.getText(new Interval(start, stop)); // no instructions to execute
        }

        // eslint-disable-next-line prefer-const
        let buf = [];

        // First, optimize instruction stream
        // eslint-disable-next-line prefer-const
        let indexToOp = this.reduceToSingleOperationPerIndex(rewrites);

        // Walk buffer, executing instructions and emitting tokens
        let i = start;
        while (i <= stop && i < this.tokens.size) {
            // eslint-disable-next-line prefer-const
            let op = indexToOp.get(i);
            indexToOp.delete(i); // remove so any left have index size-1
            // eslint-disable-next-line prefer-const, @typescript-eslint/no-unsafe-call
            let t = this.tokens.get(i);
            if (op == null) {
                // no operation at that index, just dump token
                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                if (t.type !== Token.EOF) {
                    buf.push(String(t.text));
                }
                i++; // move to next token
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                i = op.execute(buf); // execute operation and skip
            }
        }

        // include stuff after end if it's last index in buffer
        // So, if they did an insertAfter(lastValidIndex, "foo"), include
        // foo if end==lastValidIndex.
        if (stop === this.tokens.size - 1) {
            // Scan any remaining operations after last token
            // should be included (they will be inserts).
            for (const op of indexToOp.values()) {
                if (op.index >= this.tokens.size - 1) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    buf.push(op.text.toString());
                }
            }
        }

        return buf.join("");
    }

    /**
     * @param {Rewrites} rewrites
     * @returns {Map<number, RewriteOperation>} a map from token index to operation
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    reduceToSingleOperationPerIndex(rewrites: any) {
        // WALK REPLACES
        for (let i = 0; i < rewrites.length; i++) {
            // eslint-disable-next-line prefer-const
            let op = rewrites[i];
            if (op == null) {
                continue;
            }
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            if (!(op instanceof ReplaceOp)) {
                continue;
            }
            // eslint-disable-next-line prefer-const
            let rop = op;
            // Wipe prior inserts within range
            // eslint-disable-next-line prefer-const, @typescript-eslint/no-use-before-define
            let inserts = this.getKindOfOps(rewrites, InsertBeforeOp, i);
            // eslint-disable-next-line prefer-const
            for (let iop of inserts) {
                if (iop.index === rop.index) {
                    // E.g., insert before 2, delete 2..2; update replace
                    // text to include insert before, kill insert
                    rewrites[iop.instructionIndex] = undefined;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    rop.text = iop.text.toString() + (rop.text != null ? rop.text.toString() : "");
                }
                else if (iop.index > rop.index && iop.index <= rop.lastIndex) {
                    // delete insert as it's a no-op.
                    rewrites[iop.instructionIndex] = undefined;
                }
            }
            // Drop any prior replaces contained within
            // eslint-disable-next-line prefer-const, @typescript-eslint/no-use-before-define
            let prevReplaces = this.getKindOfOps(rewrites, ReplaceOp, i);
            // eslint-disable-next-line prefer-const
            for (let prevRop of prevReplaces) {
                if (prevRop.index >= rop.index && prevRop.lastIndex <= rop.lastIndex) {
                    // delete replace as it's a no-op.
                    rewrites[prevRop.instructionIndex] = undefined;
                    continue;
                }
                // throw exception unless disjoint or identical
                // eslint-disable-next-line prefer-const
                let disjoint =
                    prevRop.lastIndex < rop.index || prevRop.index > rop.lastIndex;
                // Delete special case of replace (text==null):
                // D.i-j.u D.x-y.v	| boundaries overlap	combine to max(min)..max(right)
                if (prevRop.text == null && rop.text == null && !disjoint) {
                    rewrites[prevRop.instructionIndex] = undefined; // kill first delete
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    rop.index = Math.min(prevRop.index, rop.index);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    rop.lastIndex = Math.max(prevRop.lastIndex, rop.lastIndex);
                }
                else if (!disjoint) {
                    throw new Error(`replace op boundaries of ${rop} overlap with previous ${prevRop}`);
                }
            }
        }

        // WALK INSERTS
        for (let i = 0; i < rewrites.length; i++) {
            // eslint-disable-next-line prefer-const
            let op = rewrites[i];
            if (op == null) {
                continue;
            }
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            if (!(op instanceof InsertBeforeOp)) {
                continue;
            }
            // eslint-disable-next-line prefer-const
            let iop = op;
            // combine current insert with prior if any at same index
            // eslint-disable-next-line prefer-const, @typescript-eslint/no-use-before-define
            let prevInserts = this.getKindOfOps(rewrites, InsertBeforeOp, i);
            // eslint-disable-next-line prefer-const
            for (let prevIop of prevInserts) {
                if (prevIop.index === iop.index) {
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    if (prevIop instanceof InsertAfterOp) {
                        iop.text = this.catOpText(prevIop.text, iop.text);
                        rewrites[prevIop.instructionIndex] = undefined;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    else if (prevIop instanceof InsertBeforeOp) { // combine objects
                        // convert to strings...we're in process of toString'ing
                        // whole token buffer so no lazy eval issue with any templates
                        iop.text = this.catOpText(iop.text, prevIop.text);
                        // delete redundant prior insert
                        rewrites[prevIop.instructionIndex] = undefined;
                    }
                }
            }
            // look for replaces where iop.index is in range; error
            // eslint-disable-next-line prefer-const, @typescript-eslint/no-use-before-define
            let prevReplaces = this.getKindOfOps(rewrites, ReplaceOp, i);
            // eslint-disable-next-line prefer-const
            for (let rop of prevReplaces) {
                if (iop.index === rop.index) {
                    rop.text = this.catOpText(iop.text, rop.text);
                    rewrites[i] = undefined;	// delete current insert
                    continue;
                }
                if (iop.index >= rop.index && iop.index <= rop.lastIndex) {
                    throw new Error(`insert op ${iop} within boundaries of previous ${rop}`);
                }
            }
        }

        /** @type {Map<number, RewriteOperation>} */
        // eslint-disable-next-line prefer-const
        let m = new Map();
        // eslint-disable-next-line prefer-const
        for (let op of rewrites) {
            if (op == null) {
                // ignore deleted ops
                continue;
            }
            if (m.get(op.index) != null) {
                throw new Error("should only be one op per index");
            }
            m.set(op.index, op);
        }
        // eslint-disable-next-line padding-line-between-statements
        return m;
    }

    /**
     * @param {Text} a
     * @param {Text} b
     * @returns {string}
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    catOpText(a: any, b: any) {
        let x = "";
        let y = "";
        if (a != null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            x = a.toString();
        }
        if (b != null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            y = b.toString();
        }
        // eslint-disable-next-line padding-line-between-statements
        return x + y;
    }

    /**
     * Get all operations before an index of a particular kind
     * @param {Rewrites} rewrites
     * @param {any} kind
     * @param {number} before
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getKindOfOps(rewrites: any, kind: any, before: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, arrow-body-style
        return rewrites.slice(0, before).filter((op: any) => op && op instanceof kind);
    }
}

class RewriteOperation {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    index: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    instructionIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    text: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokens: any;
    /**
     * @param {CommonTokenStream} tokens
     * @param {number} index
     * @param {number} instructionIndex
     * @param {Text} text
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    constructor(tokens: any, index: any, instructionIndex: any, text: any) {
        this.tokens = tokens;
        this.instructionIndex = instructionIndex;
        this.index = index;
        this.text = text === undefined ? "" : text;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    toString() {
        let opName = this.constructor.name;
        const $index = opName.indexOf("$");
        opName = opName.substring($index + 1, opName.length);
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-call
        return "<" + opName + "@" + this.tokens.get(this.index) +
            ":\"" + this.text + "\">";
    }
}

class InsertBeforeOp extends RewriteOperation {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    index: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    text: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokens: any;
    /**
     * @param {CommonTokenStream} tokens
     * @param {number} index
     * @param {number} instructionIndex
     * @param {Text} text
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    constructor(tokens: any, index: any, instructionIndex: any, text: any) {
        super(tokens, index, instructionIndex, text);
    }

    /**
     * @param {string[]} buf
     * @returns {number} the index of the next token to operate on
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    execute(buf: any) {
        if (this.text) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            buf.push(this.text.toString());
        }

        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (this.tokens.get(this.index).type !== Token.EOF) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            buf.push(String(this.tokens.get(this.index).text));
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return this.index + 1;
    }
}

class InsertAfterOp extends InsertBeforeOp {
    /**
     * @param {CommonTokenStream} tokens
     * @param {number} index
     * @param {number} instructionIndex
     * @param {Text} text
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    constructor(tokens: any, index: any, instructionIndex: any, text: any) {
        super(tokens, index + 1, instructionIndex, text); // insert after is insert before index+1
    }
}

class ReplaceOp extends RewriteOperation {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    index: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    lastIndex: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    text: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    tokens: any;
    /**
     * @param {CommonTokenStream} tokens
     * @param {number} from
     * @param {number} to
     * @param {number} instructionIndex
     * @param {Text} text
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    constructor(tokens: any, from: any, to: any, instructionIndex: any, text: any) {
        super(tokens, from, instructionIndex, text);
        this.lastIndex = to;
    }

    /**
     * @param {string[]} buf
     * @returns {number} the index of the next token to operate on
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    execute(buf: any) {
        if (this.text) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            buf.push(this.text.toString());
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-return
        return this.lastIndex + 1;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    toString() {
        if (this.text == null) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            return "<DeleteOp@" + this.tokens.get(this.index) +
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                ".." + this.tokens.get(this.lastIndex) + ">";
        }
        // eslint-disable-next-line padding-line-between-statements, @typescript-eslint/no-unsafe-call
        return "<ReplaceOp@" + this.tokens.get(this.index) +
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            ".." + this.tokens.get(this.lastIndex) + ":\"" + this.text + "\">";
    }
}
