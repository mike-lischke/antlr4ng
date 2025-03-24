/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { type Interval } from "../misc/Interval.js";
import { type Parser } from "../Parser.js";
import { type ParseTreeVisitor } from "./ParseTreeVisitor.js";

/**
 * The basic notion of a tree has a parent, a payload, and a list of children.
 *  It is the most abstract interface for all the trees used by antlr-ng.
 *
 * Note: this interface is a combination of 3 Java interfaces: ParseTree, SyntaxTree and Tree.
 */
export interface ParseTree {
    /**
     * The parent of this node. If the return value is null, then this
     *  node is the root of the tree.
     */
    parent: ParseTree | null;

    /**
     * This method returns whatever object represents the data at this node. For
     * example, for parse trees, the payload can be a {@link Token} representing
     * a leaf node or a {@link RuleContext} object representing a rule
     * invocation. For abstract syntax trees (ASTs), this is a {@link Token}
     * object.
     */
    getPayload(): unknown;

    /** If there are children, get the `i`th value indexed from 0. */
    getChild(i: number): ParseTree | null;

    /** The {@link ParseTreeVisitor} needs a double dispatch method. */
    accept<T>(visitor: ParseTreeVisitor<T>): T | null;

    /**
     * How many children are there? If there is none, then this
     *  node represents a leaf node.
     */
    getChildCount(): number;

    /**
     * Return the combined text of all leaf nodes. Does not get any
     *  off-channel tokens (if any) so won't return whitespace and
     *  comments if they are sent to parser on hidden channel.
     */
    getText(): string;

    /**
     * Print out a whole tree, not just a node, in LISP format
     *  `(root child1 .. childN)`. Print just a node if this is a leaf.
     */
    toStringTree(recog?: Parser): string;

    /**
     * Return an {@link Interval} indicating the index in the
     * {@link TokenStream} of the first and last token associated with this
     * subtree. If this node is a leaf, then the interval represents a single
     * token and has interval i..i for token index i.
     *
     * An interval of i..i-1 indicates an empty interval at position
     * i in the input stream, where 0 <= i <= the size of the input
     * token stream.  Currently, the code base can only have i=0..n-1 but
     * in concept one could have an empty interval after EOF.
     *
     * If source interval is unknown, this returns {@link Interval.INVALID}.
     *
     * As a weird special case, the source interval for rules matched after
     * EOF is unspecified.
     */
    getSourceInterval(): Interval;
}
