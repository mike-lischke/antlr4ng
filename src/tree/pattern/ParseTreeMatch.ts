/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { MultiMap } from "../../misc/MultiMap.js";
import type { ParseTree } from "../ParseTree.js";
import type { ParseTreePattern } from "./ParseTreePattern.js";

/**
 * Represents the result of matching a {@link ParseTree} against a tree pattern.
 */
export class ParseTreeMatch {
    /**
     * This is the backing field for {@link #getTree()}.
     */
    private readonly tree: ParseTree;

    /**
     * This is the backing field for {@link #getPattern()}.
     */
    private readonly pattern: ParseTreePattern;

    /**
     * This is the backing field for {@link #getLabels()}.
     */
    private readonly labels: MultiMap<string, ParseTree>;

    /**
     * This is the backing field for {@link #getMismatchedNode()}.
     */
    private readonly mismatchedNode?: ParseTree;

    /**
     * Constructs a new instance of {@link ParseTreeMatch} from the specified
     * parse tree and pattern.
     *
     * @param tree The parse tree to match against the pattern.
     * @param pattern The parse tree pattern.
     * @param labels A mapping from label names to collections of
     * {@link ParseTree} objects located by the tree pattern matching process.
     * @param mismatchedNode The first node which failed to match the tree
     * pattern during the matching process.
     */
    public constructor(tree: ParseTree, pattern: ParseTreePattern, labels: MultiMap<string, ParseTree>,
        mismatchedNode?: ParseTree) {

        this.tree = tree;
        this.pattern = pattern;
        this.labels = labels;
        this.mismatchedNode = mismatchedNode;
    }

    /**
     * Get the last node associated with a specific `label`.
     *
     * For example, for pattern `<id:ID>`, `get("id")` returns the
     * node matched for that `ID`. If more than one node
     * matched the specified label, only the last is returned. If there is
     * no node associated with the label, this returns `null`.
     *
     * Pattern tags like `<ID>` and `<expr>` without labels are
     * considered to be labeled with `ID` and `expr`, respectively.
     *
     * @param label The label to check.
     *
     * @returns The last {@link ParseTree} to match a tag with the specified
     * label, or `null` if no parse tree matched a tag with the label.
     */

    public get(label: string): ParseTree | null {
        const parseTrees = this.labels.get(label);
        if (!parseTrees || parseTrees.length === 0) {
            return null;
        }

        return parseTrees[parseTrees.length - 1]; // return last if multiple
    }

    /**
     * Return all nodes matching a rule or token tag with the specified label.
     *
     * If the `label` is the name of a parser rule or token in the
     * grammar, the resulting list will contain both the parse trees matching
     * rule or tags explicitly labeled with the label and the complete set of
     * parse trees matching the labeled and unlabeled tags in the pattern for
     * the parser rule or token. For example, if `label` is `"foo"`,
     * the result will contain *all* of the following.
     *
     * - Parse tree nodes matching tags of the form `<foo:anyRuleName>` and
     * `<foo:AnyTokenName>`.
     * - Parse tree nodes matching tags of the form `<anyLabel:foo>`.
     * - Parse tree nodes matching tags of the form `<foo>`.
     *
     * @param label The label.
     *
     * @returns A collection of all {@link ParseTree} nodes matching tags with
     * the specified `label`. If no nodes matched the label, an empty list
     * is returned.
     */

    public getAll(label: string): ParseTree[] {
        const nodes = this.labels.get(label);

        return nodes ?? [];
    }

    /**
     * Return a mapping from label -> [list of nodes].
     *
     * The map includes special entries corresponding to the names of rules and
     * tokens referenced in tags in the original pattern. For additional
     * information, see the description of {@link getAll(String)}.
     *
     * @returns A mapping from labels to parse tree nodes. If the parse tree
     * pattern did not contain any rule or token tags, this map will be empty.
     */

    public getLabels(): MultiMap<string, ParseTree> {
        return this.labels;
    }

    /**
     * Get the node at which we first detected a mismatch.
     *
     * @returns the node at which we first detected a mismatch, or `null`
     * if the match was successful.
     */

    public getMismatchedNode(): ParseTree | undefined {
        return this.mismatchedNode;
    }

    /**
     * Gets a value indicating whether the match operation succeeded.
     *
     * @returns `true` if the match operation succeeded; otherwise, `false`.
     */
    public succeeded(): boolean {
        return !this.mismatchedNode;
    }

    /**
     * Get the tree pattern we are matching against.
     *
     * @returns The tree pattern we are matching against.
     */

    public getPattern(): ParseTreePattern {
        return this.pattern;
    }

    /**
     * Get the parse tree we are trying to match to a pattern.
     *
     * @returns The {@link ParseTree} we are trying to match to a pattern.
     */

    public getTree(): ParseTree {
        return this.tree;
    }

    public toString(): string {
        return `Match ${this.succeeded() ? "succeeded" : "failed"}; found ${this.getLabels().size} labels`;
    }
}
