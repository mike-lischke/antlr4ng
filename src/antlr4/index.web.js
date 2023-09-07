/* Copyright (c) 2012-2022 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { default as atn } from './atn/index.js';
import { default as dfa } from './dfa/index.js';
import { default as context } from './context/index.js';
import { default as misc } from './misc/index.js';
import { default as tree } from './tree/index.js';
import { default as error } from './error/index.js';
import { default as CharStreams } from './CharStreams.js';
import { default as Utils } from './utils/index.js';
import { default as transition } from './transition/index.js';

import Token from './Token.js';
import TokenFactory from "./TokenFactory.js";
import CommonToken from './CommonToken.js';
import InputStream from './InputStream.js';
import CharStream from './InputStream.js';
import CommonTokenStream from './CommonTokenStream.js';
import Lexer from './Lexer.js';
import Parser from './Parser.js';
import TokenStream from './TokenStream.js';
import TokenStreamRewriter from './TokenStreamRewriter.js';
import Vocabulary from "./Vocabulary.js";

import { RuleContext } from './context/RuleContext.js';
import ParserRuleContext from './context/ParserRuleContext.js';
import ATN from './atn/ATN.js';
import ATNState from "./state/ATNState.js";
import ATNConfig from "./atn/ATNConfig.js";
import ATNConfigSet from "./atn/ATNConfigSet.js";
import PredictionMode from './atn/PredictionMode.js';
import LL1Analyzer from './atn/LL1Analyzer.js';
import ATNDeserializer from './atn/ATNDeserializer.js';
import ATNSimulator from "./atn/ATNSimulator.js";
import LexerATNSimulator from './atn/LexerATNSimulator.js';
import ParserATNSimulator from './atn/ParserATNSimulator.js';
import PredictionContextCache from './atn/PredictionContextCache.js';
import DFA from "./dfa/DFA.js";
import RecognitionException from "./error/RecognitionException.js";
import FailedPredicateException from "./error/FailedPredicateException.js";
import NoViableAltException from "./error/NoViableAltException.js";
import BailErrorStrategy from "./error/BailErrorStrategy.js";
import ParseCancellationException from "./error/ParseCancellationException.js";
import DefaultErrorStrategy from "./error/DefaultErrorStrategy.js";
import Interval from './misc/Interval.js';
import IntervalSet from './misc/IntervalSet.js';
import ParseTreeListener from "./tree/ParseTreeListener.js";
import ParseTreeVisitor from "./tree/ParseTreeVisitor.js";
import ParseTreeWalker from "./tree/ParseTreeWalker.js";
import ErrorListener from "./error/ErrorListener.js";
import DiagnosticErrorListener from "./error/DiagnosticErrorListener.js";
import LexerNoViableAltException from "./error/LexerNoViableAltException.js";
import TerminalNode from "./tree/TerminalNode.js";
import arrayToString from "./utils/arrayToString.js";

import Transition from "./transition/Transition.js";

// This default export is for use as single import (e.g. `import antlr4 from "antlr4";`).
// You can then access the individual exports on the antlr4 object.
// This export does *not* correspond to the type definitions used with TypeScript and does not include all
// available types from the runtime.
export default {
    atn, dfa, context, misc, tree, error, Token, CommonToken, CharStreams, CharStream, InputStream, CommonTokenStream,
    Lexer, Parser, ParserRuleContext, Interval, IntervalSet, LL1Analyzer, Utils,
    transition, Vocabulary
};

// These exports correspond to the type definitions and (will) completely cover the runtime.
// All classes can directly be imported using named imports e.g. `import { Parser } from "antlr4";`.
export {
    Token, CommonToken, CharStreams, CharStream, InputStream, CommonTokenStream, Lexer, Parser,
    TerminalNode, ParseTreeWalker, RuleContext, ParserRuleContext, Interval, IntervalSet,
    PredictionMode, LL1Analyzer, ParseTreeListener, ParseTreeVisitor, ATN, ATNState, ATNConfig, ATNConfigSet,
    ATNDeserializer,
    PredictionContextCache, LexerATNSimulator, ParserATNSimulator, DFA, RecognitionException, NoViableAltException,
    FailedPredicateException, ErrorListener, DiagnosticErrorListener, BailErrorStrategy, DefaultErrorStrategy, LexerNoViableAltException,
    ParseCancellationException, arrayToString, TokenStream, TokenStreamRewriter, Vocabulary, Transition, TokenFactory,
    ATNSimulator
};
