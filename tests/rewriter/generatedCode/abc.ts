/* eslint-disable @typescript-eslint/naming-convention */

import * as antlr4 from "../../../src/index.js";

const serializedATN = [4, 0, 3, 13, 6, -1, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 1, 0, 1, 0, 1, 1,
    1, 1, 1, 2, 1, 2, 0, 0, 3, 1, 1, 3, 2, 5, 3, 1, 0, 0, 12, 0, 1, 1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 5, 1, 0, 0,
    0, 1, 7, 1, 0, 0, 0, 3, 9, 1, 0, 0, 0, 5, 11, 1, 0, 0, 0, 7, 8, 5, 97, 0, 0, 8, 2, 1, 0, 0, 0, 9, 10, 5, 98,
    0, 0, 10, 4, 1, 0, 0, 0, 11, 12, 5, 99, 0, 0, 12, 6, 1, 0, 0, 0, 1, 0, 0];

const atn = new antlr4.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map((ds, index) => { return new antlr4.DFA(ds, index); });

export class ABC extends antlr4.Lexer {
    public static readonly EOF = antlr4.Token.EOF;
    public static readonly A = 1;
    public static readonly B = 2;
    public static readonly C = 3;

    public override get grammarFileName(): string { return "abc.g4"; };

    public get channelNames(): string[] { return ["DEFAULT_TOKEN_CHANNEL", "HIDDEN"]; }

    public get modeNames(): string[] { return ["DEFAULT_MODE"]; }
    public get literalNames(): Array<string | null> { return [null, "'a'", "'b'", "'c'"]; }
    public get symbolicNames(): Array<string | null> { return [null, "A", "B", "C"]; }
    public get ruleNames(): string[] { return ["A", "B", "C"]; }

    public constructor(input: antlr4.CharStream) {
        super(input);
        this.interpreter = new antlr4.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    }

    public override get vocabulary(): antlr4.Vocabulary {
        return antlr4.Vocabulary.EMPTY_VOCABULARY;
    }
}
