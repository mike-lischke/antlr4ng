/* eslint-disable jsdoc/require-param, jsdoc/require-returns, jsdoc/no-undefined-types, max-len */
/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { CharStreams } from "../../CharStreams.js";
import { CommonTokenStream } from "../../CommonTokenStream.js";
import { Token } from "../../Token.js";
import { XPathLexer } from "./XPathLexer.js";
import { XPathLexerErrorListener } from "./XPathLexerErrorListener.js";
import { XPathRuleAnywhereElement } from "./XPathRuleAnywhereElement.js";
import { XPathRuleElement } from "./XPathRuleElement.js";
import { XPathTokenAnywhereElement } from "./XPathTokenAnywhereElement.js";
import { XPathTokenElement } from "./XPathTokenElement.js";
import { XPathWildcardAnywhereElement } from "./XPathWildcardAnywhereElement.js";
import { XPathWildcardElement } from "./XPathWildcardElement.js";
import { ParserRuleContext } from "../../ParserRuleContext.js";
import { LexerNoViableAltException } from "../../LexerNoViableAltException.js";

/**
 * Represent a subset of XPath XML path syntax for use in identifying nodes in
 * parse trees.
 *
 * Split path into words and separators `/` and `//` via ANTLR
 * itself then walk path elements from left to right. At each separator-word
 * pair, find set of nodes. Next stage uses those as work list.
 *
 * The basic interface is
 * {@link XPath#findAll ParseTree.findAll}`(tree, pathString, parser)`.
 * But that is just shorthand for:
 *
 * ```
 * let p = new XPath(parser, pathString);
 * return p.evaluate(tree);
 * ```
 *
 * See `TestXPath` for descriptions. In short, this
 * allows operators:
 *
 * | | |
 * | --- | --- |
 * | `/` | root |
 * | `//` | anywhere |
 * | `!` | invert; this much appear directly after root or anywhere operator |
 *
 * and path elements:
 *
 * | | |
 * | --- | --- |
 * | `ID` | token name |
 * | `'string'` | any string literal token from the grammar |
 * | `expr` | rule name |
 * | `*` | wildcard matching any node |
 *
 * Whitespace is not allowed.
 */
export class XPath {
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention
    static WILDCARD = "*"; // word not operator/separator
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/naming-convention
    static NOT = "!"; 	   // word for invert operator

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    elements: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    parser: any;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    path: any;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    constructor(parser: any, path: any) {
        this.parser = parser;
        this.path = path;
        this.elements = this.split(path);
        // console.log(this.elements.toString());
    }

    // TODO: check for invalid token/rule names, bad syntax

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    split(path: any) {
        // eslint-disable-next-line prefer-const
        let lexer = new (class extends XPathLexer {
            // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
            constructor(stream: any) {
                super(stream);
            }

            // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
            recover(e: any) { throw e; }
        })(CharStreams.fromString(path));

        lexer.removeErrorListeners();
        lexer.addErrorListener(new XPathLexerErrorListener());
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
        // eslint-disable-next-line prefer-const
        let tokenStream = new CommonTokenStream(lexer);
        try {
            tokenStream.fill();
        }
        catch (e) {
            if (e instanceof LexerNoViableAltException) {
                // eslint-disable-next-line prefer-const
                let pos = lexer.column;
                // eslint-disable-next-line prefer-const
                let msg = "Invalid tokens or characters at index " + pos + " in path '" + path + "' -- " + e.message;
                throw new RangeError(msg);
            }
            throw e;
        }

        // @ts-expect-error TS(2554): Expected 3 arguments, but got 0.
        // eslint-disable-next-line prefer-const
        let tokens = tokenStream.getTokens();
        // console.log("path=" + path + "=>" + tokens);
        // eslint-disable-next-line prefer-const
        let elements = [];
        // eslint-disable-next-line prefer-const
        let n = tokens.length;
        let i = 0;

        loop:
        while (i < n) {
            // eslint-disable-next-line prefer-const
            let el = tokens[i];
            let next;
            switch (el.type) {
                case XPathLexer.ROOT:
                case XPathLexer.ANYWHERE: {
                    const anywhere = (el.type === XPathLexer.ANYWHERE);
                    i++;
                    next = tokens[i];
                    const invert = next.type === XPathLexer.BANG;
                    if (invert) {
                        i++;
                        next = tokens[i];
                    }
                    // eslint-disable-next-line prefer-const
                    let pathElement = this.getXPathElement(next, anywhere);
                    pathElement.invert = invert;
                    elements.push(pathElement);
                    i++;
                    break;
                }

                case XPathLexer.TOKEN_REF:
                case XPathLexer.RULE_REF:
                case XPathLexer.WILDCARD: {
                    elements.push(this.getXPathElement(el, false));
                    i++;
                    break;
                }

                // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
                case Token.EOF: {
                    break loop;
                }

                default: {
                    throw new Error("Unknown path element " + el);
                }
            }
        }
        // eslint-disable-next-line padding-line-between-statements
        return elements;
    }

    /**
     * Convert word like `*` or `ID` or `expr` to a path
     * element. `anywhere` is `true` if `//` precedes the
     * word.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    getXPathElement(wordToken: any, anywhere: any) {
        // @ts-expect-error TS(2339): Property 'EOF' does not exist on type 'typeof Toke... Remove this comment to see the full error message
        if (wordToken.type === Token.EOF) {
            throw new Error("Missing path element at end of path");
        }

        // eslint-disable-next-line prefer-const
        let word = wordToken.text;
        if (word == null) {
            throw new Error("Expected wordToken to have text content.");
        }

        // eslint-disable-next-line prefer-const, @typescript-eslint/no-unsafe-call
        let ttype = this.parser.getTokenType(word);
        // eslint-disable-next-line prefer-const, @typescript-eslint/no-unsafe-call
        let ruleIndex = this.parser.getRuleIndex(word);
        switch (wordToken.type) {
            case XPathLexer.WILDCARD:
                return anywhere ?
                    new XPathWildcardAnywhereElement() :
                    new XPathWildcardElement();
            case XPathLexer.TOKEN_REF:
            case XPathLexer.STRING:
                // @ts-expect-error TS(2339): Property 'INVALID_TYPE' does not exist on type 'ty... Remove this comment to see the full error message
                if (ttype === Token.INVALID_TYPE) {
                    throw new Error(word + " at index " +
                        wordToken.start +
                        " isn't a valid token name");
                }
                // eslint-disable-next-line padding-line-between-statements
                return anywhere ?
                    new XPathTokenAnywhereElement(word, ttype) :
                    new XPathTokenElement(word, ttype);
            default:
                if (ruleIndex === -1) {
                    throw new Error(word + " at index " +
                        wordToken.start +
                        " isn't a valid rule name");
                }
                // eslint-disable-next-line padding-line-between-statements
                return anywhere ?
                    new XPathRuleAnywhereElement(word, ruleIndex) :
                    new XPathRuleElement(word, ruleIndex);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/member-ordering, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    static findAll(tree: any, xpath: any, parser: any) {
        // eslint-disable-next-line prefer-const
        let p = new XPath(parser, xpath);
        // eslint-disable-next-line padding-line-between-statements
        return p.evaluate(tree);
    }

    /**
     * Return a list of all nodes starting at `t` as root that satisfy the
     * path. The root `/` is relative to the node passed to {@link evaluate}.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility, @typescript-eslint/no-explicit-any
    evaluate(t: any) {
        // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
        // eslint-disable-next-line prefer-const
        let dummyRoot = new ParserRuleContext();
        dummyRoot.addChild(t);

        let work = new Set([dummyRoot]);

        let i = 0;
        while (i < this.elements.length) {
            // eslint-disable-next-line prefer-const
            let next = new Set();
            // eslint-disable-next-line prefer-const
            for (let node of work) {
                if (node.getChildCount() > 0) {
                    // only try to match next element if it has children
                    // e.g., //func/*/stat might have a token node for which
                    // we can't go looking for stat nodes.
                    // eslint-disable-next-line prefer-const, @typescript-eslint/no-unsafe-call
                    let matching = this.elements[i].evaluate(node);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/unbound-method
                    matching.forEach(next.add, next);
                }
            }
            i++;
            // @ts-expect-error TS(2322): Type 'Set<unknown>' is not assignable to type 'Set... Remove this comment to see the full error message
            work = next;
        }

        return work;
    }
}
