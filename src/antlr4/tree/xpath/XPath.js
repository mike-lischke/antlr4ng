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
import { ParserRuleContext } from "../../atn/ParserRuleContext.js";
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
    static WILDCARD = "*"; // word not operator/separator
    static NOT = "!"; 	   // word for invert operator

    constructor(parser, path) {
        this.parser = parser;
        this.path = path;
        this.elements = this.split(path);
        // console.log(this.elements.toString());
    }

    // TODO: check for invalid token/rule names, bad syntax

    split(path) {
        let lexer = new class extends XPathLexer {
            constructor(stream) {
                super(stream);
            }

            recover(e) { throw e; }
        }(CharStreams.fromString(path));

        lexer.removeErrorListeners();
        lexer.addErrorListener(new XPathLexerErrorListener());
        let tokenStream = new CommonTokenStream(lexer);
        try {
            tokenStream.fill();
        }
        catch (e) {
            if (e instanceof LexerNoViableAltException) {
                let pos = lexer.column;
                let msg = "Invalid tokens or characters at index " + pos + " in path '" + path + "' -- " + e.message;
                throw new RangeError(msg);
            }
            throw e;
        }

        let tokens = tokenStream.getTokens();
        // console.log("path=" + path + "=>" + tokens);
        let elements = [];
        let n = tokens.length;
        let i = 0;

        loop:
        while (i < n) {
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

                case Token.EOF: {
                    break loop;
                }

                default: {
                    throw new Error("Unknown path element " + el);
                }
            }
        }
        return elements;
    }

    /**
     * Convert word like `*` or `ID` or `expr` to a path
     * element. `anywhere` is `true` if `//` precedes the
     * word.
     */
    getXPathElement(wordToken, anywhere) {
        if (wordToken.type === Token.EOF) {
            throw new Error("Missing path element at end of path");
        }

        let word = wordToken.text;
        if (word == null) {
            throw new Error("Expected wordToken to have text content.");
        }

        let ttype = this.parser.getTokenType(word);
        let ruleIndex = this.parser.getRuleIndex(word);
        switch (wordToken.type) {
            case XPathLexer.WILDCARD:
                return anywhere ?
                    new XPathWildcardAnywhereElement() :
                    new XPathWildcardElement();
            case XPathLexer.TOKEN_REF:
            case XPathLexer.STRING:
                if (ttype === Token.INVALID_TYPE) {
                    throw new Error(word + " at index " +
                        wordToken.start +
                        " isn't a valid token name");
                }
                return anywhere ?
                    new XPathTokenAnywhereElement(word, ttype) :
                    new XPathTokenElement(word, ttype);
            default:
                if (ruleIndex === -1) {
                    throw new Error(word + " at index " +
                        wordToken.start +
                        " isn't a valid rule name");
                }
                return anywhere ?
                    new XPathRuleAnywhereElement(word, ruleIndex) :
                    new XPathRuleElement(word, ruleIndex);
        }
    }

    static findAll(tree, xpath, parser) {
        let p = new XPath(parser, xpath);
        return p.evaluate(tree);
    }

    /**
     * Return a list of all nodes starting at `t` as root that satisfy the
     * path. The root `/` is relative to the node passed to {@link evaluate}.
     */
    evaluate(t) {
        let dummyRoot = new ParserRuleContext();
        dummyRoot.addChild(t);

        let work = new Set([dummyRoot]);

        let i = 0;
        while (i < this.elements.length) {
            let next = new Set();
            for (let node of work) {
                if (node.getChildCount() > 0) {
                    // only try to match next element if it has children
                    // e.g., //func/*/stat might have a token node for which
                    // we can't go looking for stat nodes.
                    let matching = this.elements[i].evaluate(node);
                    matching.forEach(next.add, next);
                }
            }
            i++;
            work = next;
        }

        return work;
    }
}
