/* eslint-disable @typescript-eslint/naming-convention */

import * as antlr4 from "../../../src/index.js";

const serializedATN = [4, 0, 7, 38, 6, -1, 2, 0, 7, 0, 2, 1, 7, 1, 2, 2, 7, 2, 2, 3, 7, 3, 2, 4,
    7, 4, 2, 5, 7, 5, 2, 6, 7, 6, 1, 0, 4, 0, 17, 8, 0, 11, 0, 12, 0, 18, 1, 1, 4, 1, 22, 8, 1, 11, 1, 12, 1,
    23, 1, 2, 1, 2, 1, 3, 1, 3, 1, 4, 1, 4, 1, 5, 1, 5, 1, 6, 4, 6, 35, 8, 6, 11, 6, 12, 6, 36, 0, 0, 7, 1, 1,
    3, 2, 5, 3, 7, 4, 9, 5, 11, 6, 13, 7, 1, 0, 0, 40, 0, 1, 1, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0,
    7, 1, 0, 0, 0, 0, 9, 1, 0, 0, 0, 0, 11, 1, 0, 0, 0, 0, 13, 1, 0, 0, 0, 1, 16, 1, 0, 0, 0, 3, 21, 1, 0, 0,
    0, 5, 25, 1, 0, 0, 0, 7, 27, 1, 0, 0, 0, 9, 29, 1, 0, 0, 0, 11, 31, 1, 0, 0, 0, 13, 34, 1, 0, 0, 0, 15,
    17, 2, 97, 122, 0, 16, 15, 1, 0, 0, 0, 17, 18, 1, 0, 0, 0, 18, 16, 1, 0, 0, 0, 18, 19, 1, 0, 0, 0, 19,
    2, 1, 0, 0, 0, 20, 22, 2, 48, 57, 0, 21, 20, 1, 0, 0, 0, 22, 23, 1, 0, 0, 0, 23, 21, 1, 0, 0, 0, 23, 24,
    1, 0, 0, 0, 24, 4, 1, 0, 0, 0, 25, 26, 5, 59, 0, 0, 26, 6, 1, 0, 0, 0, 27, 28, 5, 43, 0, 0, 28, 8, 1, 0,
    0, 0, 29, 30, 5, 42, 0, 0, 30, 10, 1, 0, 0, 0, 31, 32, 5, 61, 0, 0, 32, 12, 1, 0, 0, 0, 33, 35, 5, 32,
    0, 0, 34, 33, 1, 0, 0, 0, 35, 36, 1, 0, 0, 0, 36, 34, 1, 0, 0, 0, 36, 37, 1, 0, 0, 0, 37, 14, 1, 0, 0,
    0, 4, 0, 18, 23, 36, 0];

const atn = new antlr4.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map((ds, index) => { return new antlr4.DFA(ds, index); });

export class Calc extends antlr4.Lexer {
    public static readonly ID = 1;
    public static readonly INT = 2;
    public static readonly SEMI = 3;
    public static readonly PLUS = 4;
    public static readonly MUL = 5;
    public static readonly ASSIGN = 6;
    public static readonly WS = 7;

    public override get grammarFileName(): string { return "calc.g4"; }
    public get channelNames(): Array<null | string> { return ["DEFAULT_TOKEN_CHANNEL", "HIDDEN"]; }
    public get modeNames(): Array<null | string> { return ["DEFAULT_MODE"]; }
    public get literalNames(): Array<null | string> { return [null, null, null, "';'", "'+'", "'*'", "'='"]; }
    public get symbolicNames(): Array<null | string> {
        return [null, "ID", "INT", "SEMI", "PLUS", "MUL", "ASSIGN", "WS"];
    }
    public get ruleNames(): string[] { return ["ID", "INT", "SEMI", "PLUS", "MUL", "ASSIGN", "WS"]; }

    public constructor(input: antlr4.CharStream) {
        super(input);
        this.interpreter = new antlr4.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    }

    public override get vocabulary(): antlr4.Vocabulary {
        return antlr4.Vocabulary.EMPTY_VOCABULARY;
    }
}
