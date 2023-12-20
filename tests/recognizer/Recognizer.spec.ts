/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { ATNSimulator, IntStream, Recognizer, Vocabulary, ANTLRErrorListener, ATNConfigSet, BitSet, DFA, Parser, RecognitionException, Token } from "../../src/index.js";

describe("Recognizer", () => {
  it("Recognizer.#listeners test", () => {
    class RecognizerMock extends Recognizer<ATNSimulator> {
      public get grammarFileName(): string {
        throw new Error("Method not implemented.");
      }
      public get ruleNames(): string[] {
        throw new Error("Method not implemented.");
      }
      public get vocabulary(): Vocabulary {
        throw new Error("Method not implemented.");
      }
      public get inputStream(): IntStream {
        throw new Error("Method not implemented.");
      }
      public set inputStream(input: IntStream) {
        throw new Error("Method not implemented.");
      }
    }
    class ListenerMock implements ANTLRErrorListener {
      syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>, offendingSymbol: S | null, line: number, charPositionInLine: number, msg: string, e: RecognitionException | null): void {
        throw new Error("Method not implemented.");
      }
      reportAmbiguity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, exact: boolean, ambigAlts: BitSet | null, configs: ATNConfigSet): void {
        throw new Error("Method not implemented.");
      }
      reportAttemptingFullContext(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, conflictingAlts: BitSet | null, configs: ATNConfigSet): void {
        throw new Error("Method not implemented.");
      }
      reportContextSensitivity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, prediction: number, configs: ATNConfigSet): void {
        throw new Error("Method not implemented.");
      }
    }
    const recog = new RecognizerMock();
    const listener1 = new ListenerMock();
    recog.removeErrorListeners()
    recog.addErrorListener(listener1);
    expect(recog.getErrorListeners().length).toEqual(1);
    const listener2 = new ListenerMock();
    recog.addErrorListener(listener2);
    expect(recog.getErrorListeners().length).toEqual(2);
    recog.removeErrorListener(listener1);
    expect(recog.getErrorListeners().length).toEqual(1);
    recog.removeErrorListeners();
    expect(recog.getErrorListeners().length).toEqual(0);
  });
})