/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable max-classes-per-file, jsdoc/require-param, @typescript-eslint/naming-convention */
/* eslint-disable jsdoc/require-returns */

import { Token } from "./Token.js";
import { TokenStream } from "./TokenStream.js";
import { Interval } from "./misc/Interval.js";

/**
 * Useful for rewriting out a buffered input token stream after doing some
 * augmentation or other manipulations on it.
 *
 * <p>
 * You can insert stuff, replace, and delete chunks. Note that the operations
 * are done lazily--only if you convert the buffer to a {@link String} with
 * {@link TokenStream#getText()}. This is very efficient because you are not
 * moving data around all the time. As the buffer of tokens is converted to
 * strings, the {@link #getText()} method(s) scan the input token stream and
 * check to see if there is an operation at the current index. If so, the
 * operation is done and then normal {@link String} rendering continues on the
 * buffer. This is like having multiple Turing machine instruction streams
 * (programs) operating on a single input tape. :)</p>
 *
 * <p>
 * This rewriter makes no modifications to the token stream. It does not ask the
 * stream to fill itself up nor does it advance the input cursor. The token
 * stream {@link TokenStream#index()} will return the same value before and
 * after any {@link #getText()} call.</p>
 *
 * <p>
 * The rewriter only works on tokens that you have in the buffer and ignores the
 * current input cursor. If you are buffering tokens on-demand, calling
 * {@link #getText()} halfway through the input will only do rewrites for those
 * tokens in the first half of the file.</p>
 *
 * <p>
 * Since the operations are done lazily at {@link #getText}-time, operations do
 * not screw up the token index values. That is, an insert operation at token
 * index {@code i} does not change the index values for tokens
 * {@code i}+1..n-1.</p>
 *
 * <p>
 * Because operations never actually alter the buffer, you may always get the
 * original token stream back without undoing anything. Since the instructions
 * are queued up, you can easily simulate transactions and roll back any changes
 * if there is an error just by removing instructions. For example,</p>
 *
 * <pre>
 * CharStream input = new ANTLRFileStream("input");
 * TLexer lex = new TLexer(input);
 * CommonTokenStream tokens = new CommonTokenStream(lex);
 * T parser = new T(tokens);
 * TokenStreamRewriter rewriter = new TokenStreamRewriter(tokens);
 * parser.startRule();
 * </pre>
 *
 * <p>
 * Then in the rules, you can execute (assuming rewriter is visible):</p>
 *
 * <pre>
 * Token t,u;
 * ...
 * rewriter.insertAfter(t, "text to put after t");}
 * rewriter.insertAfter(u, "text after u");}
 * System.out.println(rewriter.getText());
 * </pre>
 *
 * <p>
 * You can also have multiple "instruction streams" and get multiple rewrites
 * from a single pass over the input. Just name the instruction streams and use
 * that name again when printing the buffer. This could be useful for generating
 * a C file and also its header file--all from the same buffer:</p>
 *
 * <pre>
 * rewriter.insertAfter("pass1", t, "text to put after t");}
 * rewriter.insertAfter("pass2", u, "text after u");}
 * System.out.println(rewriter.getText("pass1"));
 * System.out.println(rewriter.getText("pass2"));
 * </pre>
 *
 * <p>
 * If you don't use named rewrite streams, a "default" stream is used as the
 * first example shows.</p>
 */
export class TokenStreamRewriter {
    public static readonly DEFAULT_PROGRAM_NAME = "default";
    public static readonly PROGRAM_INIT_SIZE = 100;
    public static readonly MIN_TOKEN_INDEX = 0;

    /** Our source stream */
    protected readonly tokens: TokenStream;

    /**
     * You may have multiple, named streams of rewrite operations.
     *  I'm calling these things "programs."
     *  Maps String (name) -> rewrite (List)
     */
    protected readonly programs = new Map<string, RewriteOperation[]>();

    /** Map String (program name) -> Integer index */
    protected readonly lastRewriteTokenIndexes: Map<string, number>;

    /**
     * @param tokens The token stream to modify
     */
    public constructor(tokens: TokenStream) {
        this.tokens = tokens;
    }

    public getTokenStream(): TokenStream {
        return this.tokens;
    }

    /**
     * Insert the supplied text after the specified token (or token index)
     */
    public insertAfter(tokenOrIndex: Token | number, text: string,
        programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME): void {
        let index;
        if (typeof tokenOrIndex === "number") {
            index = tokenOrIndex;
        } else {
            index = tokenOrIndex.tokenIndex;
        }

        // to insert after, just insert before next index (even if past end)
        const rewrites = this.getProgram(programName);
        const op = new InsertAfterOp(this.tokens, index, rewrites.length, text);
        rewrites.push(op);
    }

    /**
     * Insert the supplied text before the specified token (or token index)
     */
    public insertBefore(tokenOrIndex: Token | number, text: unknown,
        programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME): void {
        let index;
        if (typeof tokenOrIndex === "number") {
            index = tokenOrIndex;
        } else {
            index = tokenOrIndex.tokenIndex;
        }

        const rewrites = this.getProgram(programName);
        const op = new InsertBeforeOp(this.tokens, index, rewrites.length, text);
        rewrites.push(op);
    }

    /**
     * Replace the specified token with the supplied text
     */
    public replaceSingle(tokenOrIndex: Token | number, text: string,
        programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME): void {
        this.replace(tokenOrIndex, tokenOrIndex, text, programName);
    }

    /**
     * Replace the specified range of tokens with the supplied text.
     */
    public replace(from: Token | number, to: Token | number, text: string | null,
        programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME): void {
        if (typeof from !== "number") {
            from = from.tokenIndex;
        }
        if (typeof to !== "number") {
            to = to.tokenIndex;
        }
        if (from > to || from < 0 || to < 0 || to >= this.tokens.size) {
            throw new RangeError(`replace: range invalid: ${from}..${to}(size=${this.tokens.size})`);
        }
        const rewrites = this.getProgram(programName);
        const op = new ReplaceOp(this.tokens, from, to, rewrites.length, text);
        rewrites.push(op);
    }

    /**
     * Delete the specified range of tokens
     */
    public delete(from: Token | number, to?: Token | number | null,
        programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME): void {
        if (to == null) {
            to = from;
        }
        this.replace(from, to, null, programName);
    }

    public getProgram(name: string): RewriteOperation[] {
        let is = this.programs.get(name);
        if (is == null) {
            is = this.initializeProgram(name);
        }

        return is;
    }

    public initializeProgram(name: string): RewriteOperation[] {
        const is: RewriteOperation[] = [];
        this.programs.set(name, is);

        return is;
    }

    /**
     * @returns the text from the original tokens altered per the instructions given to this rewriter
     */
    public getText(intervalOrProgram?: Interval | string,
        programName = TokenStreamRewriter.DEFAULT_PROGRAM_NAME): string {
        let interval;
        if (intervalOrProgram instanceof Interval) {
            interval = intervalOrProgram;
        } else {
            interval = new Interval(0, this.tokens.size - 1);
        }

        if (typeof intervalOrProgram === "string") {
            programName = intervalOrProgram;
        }

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
            return this.tokens.getText(new Interval(start, stop)); // no instructions to execute
        }

        const buf = [];

        // First, optimize instruction stream
        const indexToOp = this.reduceToSingleOperationPerIndex(rewrites);

        // Walk buffer, executing instructions and emitting tokens
        let i = start;
        while (i <= stop && i < this.tokens.size) {
            const op = indexToOp.get(i);
            indexToOp.delete(i); // remove so any left have index size-1
            const t = this.tokens.get(i);
            if (op == null) {
                // no operation at that index, just dump token
                if (t.type !== Token.EOF) {
                    buf.push(String(t.text));
                }
                i++; // move to next token
            }
            else {
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
                if (op && op.index >= this.tokens.size - 1) {
                    buf.push(String(op.text));
                }
            }
        }

        return buf.join("");
    }

    /**
     * @returns a map from token index to operation
     */
    protected reduceToSingleOperationPerIndex(
        rewrites: Array<RewriteOperation | null>): Map<number, RewriteOperation | null> {
        // WALK REPLACES
        for (let i = 0; i < rewrites.length; i++) {
            const op = rewrites[i];
            if (op == null) {
                continue;
            }
            if (!(op instanceof ReplaceOp)) {
                continue;
            }
            const rop = op;
            // Wipe prior inserts within range
            const inserts = this.getKindOfOps(rewrites, InsertBeforeOp, i);
            for (const iop of inserts) {
                if (iop.index === rop.index) {
                    // E.g., insert before 2, delete 2..2; update replace
                    // text to include insert before, kill insert
                    rewrites[iop.instructionIndex] = null;
                    rop.text = String(iop.text) + (rop.text != null ? rop.text.toString() : "");
                }
                else if (iop.index > rop.index && iop.index <= rop.lastIndex) {
                    // delete insert as it's a no-op.
                    rewrites[iop.instructionIndex] = null;
                }
            }
            // Drop any prior replaces contained within
            const prevReplaces = this.getKindOfOps(rewrites, ReplaceOp, i);
            for (const prevRop of prevReplaces) {
                if (prevRop.index >= rop.index && (prevRop as ReplaceOp).lastIndex <= rop.lastIndex) {
                    // delete replace as it's a no-op.
                    rewrites[prevRop.instructionIndex] = null;
                    continue;
                }
                // throw exception unless disjoint or identical
                const disjoint = (prevRop as ReplaceOp).lastIndex < rop.index || prevRop.index > rop.lastIndex;
                // Delete special case of replace (text==null):
                // D.i-j.u D.x-y.v	| boundaries overlap	combine to max(min)..max(right)
                if (prevRop.text == null && rop.text == null && !disjoint) {
                    rewrites[prevRop.instructionIndex] = null; // kill first delete
                    rop.index = Math.min(prevRop.index, rop.index);
                    rop.lastIndex = Math.max((prevRop as ReplaceOp).lastIndex, rop.lastIndex);
                }
                else if (!disjoint) {
                    throw new Error(`replace op boundaries of ${rop} overlap with previous ${prevRop}`);
                }
            }
        }

        // WALK INSERTS
        for (let i = 0; i < rewrites.length; i++) {
            const op = rewrites[i];
            if (op == null) {
                continue;
            }
            if (!(op instanceof InsertBeforeOp)) {
                continue;
            }
            const iop = op;
            // combine current insert with prior if any at same index
            const prevInserts = this.getKindOfOps(rewrites, InsertBeforeOp, i);
            for (const prevIop of prevInserts) {
                if (prevIop.index === iop.index) {
                    if (prevIop instanceof InsertAfterOp) {
                        iop.text = this.catOpText(prevIop.text, iop.text);
                        rewrites[prevIop.instructionIndex] = null;
                    }
                    else if (prevIop instanceof InsertBeforeOp) { // combine objects
                        // convert to strings...we're in process of toString'ing
                        // whole token buffer so no lazy eval issue with any templates
                        iop.text = this.catOpText(iop.text, prevIop.text);
                        // delete redundant prior insert
                        rewrites[prevIop.instructionIndex] = null;
                    }
                }
            }
            // look for replaces where iop.index is in range; error
            const prevReplaces = this.getKindOfOps(rewrites, ReplaceOp, i);
            for (const rop of prevReplaces) {
                if (iop.index === rop.index) {
                    rop.text = this.catOpText(iop.text, rop.text);
                    rewrites[i] = null;	// delete current insert
                    continue;
                }
                if (iop.index >= rop.index && iop.index <= (rop as ReplaceOp).lastIndex) {
                    throw new Error(`insert op ${iop} within boundaries of previous ${rop}`);
                }
            }
        }

        const m = new Map<number, RewriteOperation>();
        for (const op of rewrites) {
            if (op == null) {
                // ignore deleted ops
                continue;
            }
            if (m.get(op.index) != null) {
                throw new Error("should only be one op per index");
            }
            m.set(op.index, op);
        }

        return m;
    }

    private catOpText(a: unknown, b: unknown): string {
        let x = "";
        let y = "";
        if (a != null) {
            x = a.toString();
        }
        if (b != null) {
            y = b.toString();
        }

        return x + y;
    }

    /**
     * Get all operations before an index of a particular kind
     */
    private getKindOfOps<T extends RewriteOperation>(rewrites: Array<T | null>,
        kind: new (...args: unknown[]) => T, before: number): T[] {
        return rewrites.slice(0, before).filter((op) => {
            return op && op instanceof kind;
        }) as T[];
    }
}

class RewriteOperation {
    /** What index into rewrites List are we? */
    public instructionIndex: number;
    /** Token buffer index. */
    public index: number;
    public text: unknown;

    public tokens: TokenStream;

    public constructor(tokens: TokenStream, index: number, instructionIndex: number, text: unknown) {
        this.tokens = tokens;
        this.instructionIndex = instructionIndex;
        this.index = index;
        this.text = text === undefined ? "" : text;
    }

    public execute(_buf: string[]): number {
        return this.index;
    }

    public toString() {
        return "<RewriteOperation@" + this.tokens.get(this.index) +
            ":\"" + this.text + "\">";
    }
}

class InsertBeforeOp extends RewriteOperation {
    public constructor(tokens: TokenStream, index: number, instructionIndex: number, text: unknown) {
        super(tokens, index, instructionIndex, text);
    }

    /**
     * @returns the index of the next token to operate on
     */
    public override execute(buf: string[]): number {
        if (this.text) {
            buf.push(this.text.toString());
        }

        if (this.tokens.get(this.index).type !== Token.EOF) {
            buf.push(String(this.tokens.get(this.index).text));
        }

        return this.index + 1;
    }

    public override toString() {
        return "<InsertBeforeOp@" + this.tokens.get(this.index) +
            ":\"" + this.text + "\">";
    }
}

class InsertAfterOp extends InsertBeforeOp {
    public constructor(tokens: TokenStream, index: number, instructionIndex: number, text?: string | null) {
        super(tokens, index + 1, instructionIndex, text); // insert after is insert before index+1
    }

    public override toString() {
        return "<InsertAfterOp@" + this.tokens.get(this.index) +
            ":\"" + this.text + "\">";
    }
}

class ReplaceOp extends RewriteOperation {
    public lastIndex: number;

    public constructor(tokens: TokenStream, from: number, to: number, instructionIndex: number, text?: string | null) {
        super(tokens, from, instructionIndex, text);
        this.lastIndex = to;
    }

    /**
     * @returns the index of the next token to operate on
     */
    public override execute(buf: string[]): number {
        if (this.text) {
            buf.push(this.text.toString());
        }

        return this.lastIndex + 1;
    }

    public override toString(): string {
        if (this.text == null) {
            return "<DeleteOp@" + this.tokens.get(this.index) +
                ".." + this.tokens.get(this.lastIndex) + ">";
        }

        return "<ReplaceOp@" + this.tokens.get(this.index) +
            ".." + this.tokens.get(this.lastIndex) + ":\"" + this.text + "\">";
    }
}
