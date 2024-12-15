/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

/* eslint-disable jsdoc/require-param, jsdoc/require-returns */

import { BailErrorStrategy } from "../../BailErrorStrategy.js";
import { CharStream } from "../../CharStream.js";
import { CommonTokenStream } from "../../CommonTokenStream.js";
import type { Lexer } from "../../Lexer.js";
import { ListTokenSource } from "../../ListTokenSource.js";
import type { Parser } from "../../Parser.js";
import { ParserInterpreter } from "../../ParserInterpreter.js";
import { ParserRuleContext } from "../../ParserRuleContext.js";
import { RecognitionException } from "../../RecognitionException.js";
import { Token } from "../../Token.js";
import { MultiMap } from "../../misc/MultiMap.js";
import { ParseCancellationException } from "../../misc/ParseCancellationException.js";
import type { ParseTree } from "../ParseTree.js";
import { TerminalNode } from "../TerminalNode.js";
import { CannotInvokeStartRuleError } from "./CannotInvokeStartRuleError.js";
import type { Chunk } from "./Chunk.js";
import { ParseTreeMatch } from "./ParseTreeMatch.js";
import { ParseTreePattern } from "./ParseTreePattern.js";
import { RuleTagToken } from "./RuleTagToken.js";
import { StartRuleDoesNotConsumeFullPatternError } from "./StartRuleDoesNotConsumeFullPatternError.js";
import { TagChunk } from "./TagChunk.js";
import { TextChunk } from "./TextChunk.js";
import { TokenTagToken } from "./TokenTagToken.js";

/**
 * A tree pattern matching mechanism for ANTLR {@link ParseTree}s.
 *
 * Patterns are strings of source input text with special tags representing
 * token or rule references such as:
 *
 * `<ID> = <expr>;`
 *
 * Given a pattern start rule such as `statement`, this object constructs
 * a {@link ParseTree} with placeholders for the `ID` and `expr`
 * subtree. Then the {@link #match} routines can compare an actual
 * {@link ParseTree} from a parse with this pattern. Tag `<ID>` matches
 * any `ID` token and tag `<expr>` references the result of the
 * `expr` rule (generally an instance of `ExprContext`.
 *
 * Pattern `x = 0;` is a similar pattern that matches the same pattern
 * except that it requires the identifier to be `x` and the expression to
 * be `0`.
 *
 * The {@link #matches} routines return `true` or `false` based
 * upon a match for the tree rooted at the parameter sent in. The
 * {@link #match} routines return a {@link ParseTreeMatch} object that
 * contains the parse tree, the parse tree pattern, and a map from tag name to
 * matched nodes (more below). A subtree that fails to match, returns with
 * {@link ParseTreeMatch#mismatchedNode} set to the first tree node that did not
 * match.
 *
 * For efficiency, you can compile a tree pattern in string form to a
 * {@link ParseTreePattern} object.
 *
 * See `TestParseTreeMatcher` for lots of examples.
 * {@link ParseTreePattern} has two static helper methods:
 * {@link ParseTreePattern.findAll} and {@link ParseTreePattern#match} that
 * are easy to use but not super efficient because they create new
 * {@link ParseTreePatternMatcher} objects each time and have to compile the
 * pattern in string form before using it.
 *
 * The lexer and parser that you pass into the {@link ParseTreePatternMatcher}
 * constructor are used to parse the pattern in string form. The lexer converts
 * the `<ID> = <expr>;` into a sequence of four tokens (assuming lexer
 * throws out whitespace or puts it on a hidden channel). Be aware that the
 * input stream is reset for the lexer (but not the parser; a
 * {@link ParserInterpreter} is created to parse the input.). Any user-defined
 * fields you have put into the lexer might get changed when this mechanism asks
 * it to scan the pattern string.
 *
 * Normally a parser does not accept token `<expr>` as a valid
 * `expr` but, from the parser passed in, we create a special version of
 * the underlying grammar representation (an {@link ATN}) that allows imaginary
 * tokens representing rules (`<expr>`) to match entire rules. We call
 * these *bypass alternatives*.
 *
 * Delimiters are `<` and `>`, with `\` as the escape string
 * by default, but you can set them to whatever you want using
 * {@link ParseTreePatternMatcher.setDelimiters}. You must escape both start and stop strings
 * `\<` and `\>`.
 */
export class ParseTreePatternMatcher {
    protected start = "<";
    protected stop = ">";
    protected escape = "\\";

    /**
     * This is the backing field for {@link #getLexer()}.
     */
    private readonly lexer: Lexer;

    /**
     * This is the backing field for {@link #getParser()}.
     */
    private readonly parser: Parser; // e.g., \< and \> must escape BOTH!

    /**
     * Constructs a {@link ParseTreePatternMatcher} or from a {@link Lexer} and
     * {@link Parser} object. The lexer input stream is altered for tokenizing
     * the tree patterns. The parser is used as a convenient mechanism to get
     * the grammar name, plus token, rule names.
     */
    public constructor(lexer: Lexer, parser: Parser) {
        this.lexer = lexer;
        this.parser = parser;
    }

    /**
     * Set the delimiters used for marking rule and token tags within concrete
     * syntax used by the tree pattern parser.
     *
     * @param start The start delimiter.
     * @param stop The stop delimiter.
     * @param escapeLeft The escape sequence to use for escaping a start or stop delimiter.
     *
     * @throws Error if `start` is `null` or empty.
     * @throws Error if `stop` is `null` or empty.
     */
    public setDelimiters(start: string, stop: string, escapeLeft: string): void {
        if (start === null || start.length === 0) {
            throw new Error("start cannot be null or empty");
        }

        if (stop === null || stop.length === 0) {
            throw new Error("stop cannot be null or empty");
        }

        this.start = start;
        this.stop = stop;
        this.escape = escapeLeft;
    }

    /**
     * Does `pattern` matched as rule patternRuleIndex match tree? Pass in a
     *  compiled pattern instead of a string representation of a tree pattern.
     */
    public matches(tree: ParseTree, pattern: ParseTreePattern): boolean;
    /** Does `pattern` matched as rule `patternRuleIndex` match `tree`? */
    public matches(tree: ParseTree, pattern: string, patternRuleIndex: number): boolean;
    public matches(...args: unknown[]): boolean {
        switch (args.length) {
            case 2: {
                const [tree, pattern] = args as [ParseTree, ParseTreePattern];

                const labels = new MultiMap<string, ParseTree>();
                const mismatchedNode = this.matchImpl(tree, pattern.getPatternTree(), labels);

                return mismatchedNode === null;
            }

            case 3: {
                const [tree, pattern, patternRuleIndex] = args as [ParseTree, string, number];

                const p = this.compile(pattern, patternRuleIndex);

                return this.matches(tree, p);
            }

            default: {
                throw new Error("Invalid number of arguments");
            }
        }
    }

    /**
     * Compare `pattern` matched against `tree` and return a
     * {@link ParseTreeMatch} object that contains the matched elements, or the
     * node at which the match failed. Pass in a compiled pattern instead of a
     * string representation of a tree pattern.
     */
    public match(tree: ParseTree, pattern: ParseTreePattern): ParseTreeMatch;
    /**
     * Compare `pattern` matched as rule `patternRuleIndex` against
     * `tree` and return a {@link ParseTreeMatch} object that contains the
     * matched elements, or the node at which the match failed.
     */
    public match(tree: ParseTree, pattern: string, patternRuleIndex: number): ParseTreeMatch;
    public match(...args: unknown[]): ParseTreeMatch {
        switch (args.length) {
            case 2: {
                const [tree, pattern] = args as [ParseTree, ParseTreePattern];

                const labels = new MultiMap<string, ParseTree>();
                const mismatchedNode = this.matchImpl(tree, pattern.getPatternTree(), labels);

                return new ParseTreeMatch(tree, pattern, labels, mismatchedNode);
            }

            case 3: {
                const [tree, pattern, patternRuleIndex] = args as [ParseTree, string, number];

                const p = this.compile(pattern, patternRuleIndex);

                return this.match(tree, p);
            }

            default: {
                throw new Error("Invalid number of arguments");
            }
        }
    }

    /**
     * For repeated use of a tree pattern, compile it to a
     * {@link ParseTreePattern} using this method.
     */
    public compile(pattern: string, patternRuleIndex: number): ParseTreePattern {
        const tokenList = this.tokenize(pattern);
        const tokenSrc = new ListTokenSource(tokenList);
        const tokens = new CommonTokenStream(tokenSrc);

        const parserInterp = new ParserInterpreter(this.parser.grammarFileName, this.parser.vocabulary,
            this.parser.ruleNames, this.parser.getATNWithBypassAlts(), tokens);

        let tree = null;
        try {
            parserInterp.errorHandler = new BailErrorStrategy();
            tree = parserInterp.parse(patternRuleIndex);
        } catch (eOrRe) {
            if (eOrRe instanceof ParseCancellationException) {
                const e = eOrRe;
                throw e.cause;
            } else if (eOrRe instanceof RecognitionException) {
                throw eOrRe;
            } else if (eOrRe instanceof Error) {
                throw new CannotInvokeStartRuleError(eOrRe);
            } else {
                throw eOrRe;
            }
        }

        // Make sure tree pattern compilation checks for a complete parse
        if (tokens.LA(1) !== Token.EOF) {
            throw new StartRuleDoesNotConsumeFullPatternError();
        }

        return new ParseTreePattern(this, pattern, patternRuleIndex, tree);
    }

    /**
     * Used to convert the tree pattern string into a series of tokens. The
     * input stream is reset.
     */

    public getLexer(): Lexer {
        return this.lexer;
    }

    /**
     * Used to collect to the grammar file name, token names, rule names for
     * used to parse the pattern into a parse tree.
     */

    public getParser(): Parser {
        return this.parser;
    }

    // ---- SUPPORT CODE ----

    public tokenize(pattern: string): Token[] {
        // split pattern into chunks: sea (raw input) and islands (<ID>, <expr>)
        const chunks = this.split(pattern);

        // create token stream from text and tags
        const tokens = new Array<Token>();
        for (const chunk of chunks) {
            if (chunk instanceof TagChunk) {
                const tagChunk = chunk;
                // add special rule token or conjure up new token from name
                const char = tagChunk.tag[0];
                if (char === char.toUpperCase()) {
                    const ttype = this.parser.getTokenType(tagChunk.tag);
                    if (ttype === Token.INVALID_TYPE) {
                        throw new Error("Unknown token " + tagChunk.tag + " in pattern: " + pattern);
                    }
                    const t = new TokenTagToken(tagChunk.tag, ttype, tagChunk.label);
                    tokens.push(t);
                } else {
                    if (char === char.toLowerCase()) {
                        const ruleIndex = this.parser.getRuleIndex(tagChunk.tag);
                        if (ruleIndex === -1) {
                            throw new Error("Unknown rule " + tagChunk.tag + " in pattern: " + pattern);
                        }
                        const ruleImaginaryTokenType = this.parser.getATNWithBypassAlts().ruleToTokenType[ruleIndex];
                        tokens.push(new RuleTagToken(tagChunk.tag, ruleImaginaryTokenType, tagChunk.label));
                    } else {
                        throw new Error("invalid tag: " + tagChunk.tag + " in pattern: " + pattern);
                    }
                }
            } else {
                const textChunk = chunk as TextChunk;
                const input = CharStream.fromString(textChunk.text);
                this.lexer.inputStream = input;
                let t = this.lexer.nextToken();
                while (t.type !== Token.EOF) {
                    tokens.push(t);
                    t = this.lexer.nextToken();
                }
            }
        }

        return tokens;
    }

    /**
     * Split `<ID> = <e:expr> ;` into 4 chunks for tokenizing by {@link #tokenize}.
     */
    public split(pattern: string): Chunk[] {
        let p = 0;
        const n = pattern.length;
        const chunks = new Array<Chunk>();

        // find all start and stop indexes first, then collect
        const starts = new Array<number>();
        const stops = new Array<number>();
        while (p < n) {
            if (p === pattern.indexOf(this.escape + this.start, p)) {
                p += this.escape.length + this.start.length;
            } else {
                if (p === pattern.indexOf(this.escape + this.stop, p)) {
                    p += this.escape.length + this.stop.length;
                } else {
                    if (p === pattern.indexOf(this.start, p)) {
                        starts.push(p);
                        p += this.start.length;
                    } else {
                        if (p === pattern.indexOf(this.stop, p)) {
                            stops.push(p);
                            p += this.stop.length;
                        } else {
                            p++;
                        }
                    }
                }
            }
        }

        if (starts.length > stops.length) {
            throw new Error("unterminated tag in pattern: " + pattern);
        }

        if (starts.length < stops.length) {
            throw new Error("missing start tag in pattern: " + pattern);
        }

        const tagCount = starts.length;
        for (let i = 0; i < tagCount; i++) {
            if (starts[i] >= stops[i]) {
                throw new Error("tag delimiters out of order in pattern: " + pattern);
            }
        }

        // collect into chunks now
        if (tagCount === 0) {
            const text = pattern.substring(0, n);
            chunks.push(new TextChunk(text));
        }

        if (tagCount > 0 && starts[0] > 0) { // copy text up to first tag into chunks
            const text = pattern.substring(0, starts[0]);
            chunks.push(new TextChunk(text));
        }

        for (let i = 0; i < tagCount; i++) {
            // copy inside of <tag>
            const tag = pattern.substring(starts[i] + this.start.length, stops[i]);
            let ruleOrToken = tag;
            let label;
            const colon = tag.indexOf(":");
            if (colon >= 0) {
                label = tag.substring(0, colon);
                ruleOrToken = tag.substring(colon + 1, tag.length);
            }

            chunks.push(new TagChunk(label, ruleOrToken));
            if (i + 1 < tagCount) {
                // copy from end of <tag> to start of next
                const text = pattern.substring(stops[i] + this.stop.length, starts[i + 1]);
                chunks.push(new TextChunk(text));
            }
        }
        if (tagCount > 0) {
            const afterLastTag = stops[tagCount - 1] + this.stop.length;
            if (afterLastTag < n) { // copy text from end of last tag to end
                const text = pattern.substring(afterLastTag, n);
                chunks.push(new TextChunk(text));
            }
        }

        // strip out the escape sequences from text chunks but not tags
        for (let i = 0; i < chunks.length; i++) {
            const c = chunks[i];
            if (c instanceof TextChunk) {
                const tc = c;
                const unescaped = tc.text.replace(this.escape, ""); // TODO: do we need a copy of tc.text here?
                if (unescaped.length < tc.text.length) {
                    chunks[i] = new TextChunk(unescaped);
                }
            }
        }

        return chunks;
    }

    /**
     * Recursively walk `tree` against `patternTree`, filling
     * `match.`{@link ParseTreeMatch#labels labels}.
     *
     * @returns the first node encountered in `tree` which does not match
     * a corresponding node in `patternTree`, or `null` if the match
     * was successful. The specific node returned depends on the matching
     * algorithm used by the implementation, and may be overridden.
     */

    protected matchImpl(tree: ParseTree, patternTree: ParseTree,
        labels: MultiMap<string, ParseTree>): ParseTree | undefined {
        // x and <ID>, x and y, or x and x; or could be mismatched types
        if (tree instanceof TerminalNode && patternTree instanceof TerminalNode) {
            const t1 = tree;
            const t2 = patternTree;
            let mismatchedNode;
            // both are tokens and they have same type
            if (t1.getSymbol().type === t2.getSymbol().type) {
                if (t2.getSymbol() instanceof TokenTagToken) { // x and <ID>
                    const tokenTagToken = t2.getSymbol() as TokenTagToken;
                    // track label->list-of-nodes for both token name and label (if any)
                    labels.map(tokenTagToken.tokenName, tree);
                    if (tokenTagToken.label !== undefined) {
                        labels.map(tokenTagToken.label, tree);
                    }
                } else {
                    if (t1.getText() === t2.getText()) {
                        // x and x
                    } else {
                        // x and y
                        if (!mismatchedNode) {
                            mismatchedNode = t1;
                        }
                    }
                }
            } else {
                if (!mismatchedNode) {
                    mismatchedNode = t1;
                }
            }

            return mismatchedNode;
        }

        if (tree instanceof ParserRuleContext && patternTree instanceof ParserRuleContext) {
            let mismatchedNode;

            // (expr ...) and <expr>
            const ruleTagToken = this.getRuleTagToken(patternTree);
            if (ruleTagToken) {
                if (tree.ruleIndex === patternTree.ruleIndex) {
                    // track label->list-of-nodes for both rule name and label (if any)
                    labels.map(ruleTagToken.ruleName, tree);
                    if (ruleTagToken.label) {
                        labels.map(ruleTagToken.label, tree);
                    }
                } else {
                    if (!mismatchedNode) {
                        mismatchedNode = tree;
                    }
                }

                return mismatchedNode;
            }

            // (expr ...) and (expr ...)
            if (tree.getChildCount() !== patternTree.getChildCount()) {
                if (!mismatchedNode) {
                    mismatchedNode = tree;
                }

                return mismatchedNode;
            }

            const n = tree.getChildCount();
            for (let i = 0; i < n; i++) {
                const childMatch = this.matchImpl(tree.getChild(i)!, patternTree.getChild(i)!, labels);
                if (childMatch) {
                    return childMatch;
                }
            }

            return mismatchedNode;
        }

        // if nodes aren't both tokens or both rule nodes, can't match
        return tree;
    }

    /**
     * Is `t` `(expr <expr>)` subtree?
     */
    protected getRuleTagToken(t: ParseTree): RuleTagToken | undefined {
        if (t instanceof ParserRuleContext) {
            if (t.getChildCount() === 1 && t.getChild(0) instanceof TerminalNode) {
                const c = t.getChild(0) as TerminalNode;
                if (c.getSymbol() instanceof RuleTagToken) {
                    return c.getSymbol() as RuleTagToken;
                }
            }
        }

        return undefined;
    }
}
