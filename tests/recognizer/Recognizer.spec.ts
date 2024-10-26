/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */
import { describe, it, expect } from "vitest";

import { ATNSimulator, IntStream, Recognizer, Vocabulary, BaseErrorListener } from "../../src/index.js";

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

        const recog = new RecognizerMock();
        const listener1 = new BaseErrorListener();
        recog.removeErrorListeners();
        recog.addErrorListener(listener1);
        expect(recog.getErrorListeners().length).toEqual(1);
        const listener2 = new BaseErrorListener();
        recog.addErrorListener(listener2);
        expect(recog.getErrorListeners().length).toEqual(2);
        recog.removeErrorListener(listener1);
        expect(recog.getErrorListeners().length).toEqual(1);
        recog.removeErrorListeners();
        expect(recog.getErrorListeners().length).toEqual(0);
    });
});
