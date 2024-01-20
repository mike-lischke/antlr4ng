/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { Vocabulary } from "../Vocabulary.js";
import { ATN } from "../atn/ATN.js";
import { ATNDeserializer } from "../atn/ATNDeserializer.js";

/** The data in an interpreter file. */
export interface IInterpreterData {
    atn: ATN;
    vocabulary: Vocabulary;
    ruleNames: string[];

    /** Only valid for lexer grammars. Lists the defined lexer channels. */
    channels?: string[];

    /** Only valid for lexer grammars. Lists the defined lexer modes. */
    modes?: string[];
}

export class InterpreterDataReader {
    /**
     * The structure of the data file is very simple. Everything is line based with empty lines
     * separating the different parts. For lexers the layout is:
     * token literal names:
     * ...
     *
     * token symbolic names:
     * ...
     *
     * rule names:
     * ...
     *
     * channel names:
     * ...
     *
     * mode names:
     * ...
     *
     * atn:
     * a single line with comma separated int values, enclosed in a pair of squared brackets.
     *
     * Data for a parser does not contain channel and mode names.
     */

    public static parseInterpreterData(source: string): IInterpreterData {
        const ruleNames: string[] = [];
        const channels: string[] = [];
        const modes: string[] = [];

        const literalNames: Array<string | null> = [];
        const symbolicNames: Array<string | null> = [];
        const lines = source.split("\n");
        let index = 0;
        let line = lines[index++];
        if (line !== "token literal names:") {
            throw new Error("Unexpected data entry");
        }

        do {
            line = lines[index++];
            if (line.length === 0) {
                break;
            }
            literalNames.push(line === "null" ? null : line);
        } while (true);

        line = lines[index++];
        if (line !== "token symbolic names:") {
            throw new Error("Unexpected data entry");
        }

        do {
            line = lines[index++];
            if (line.length === 0) {
                break;
            }
            symbolicNames.push(line === "null" ? null : line);
        } while (true);

        line = lines[index++];
        if (line !== "rule names:") {
            throw new Error("Unexpected data entry");
        }

        do {
            line = lines[index++];
            if (line.length === 0) {
                break;
            }
            ruleNames.push(line);
        } while (true);

        line = lines[index++];
        if (line === "channel names:") { // Additional lexer data.
            do {
                line = lines[index++];
                if (line.length === 0) {
                    break;
                }
                channels.push(line);
            } while (true);

            line = lines[index++];
            if (line !== "mode names:") {
                throw new Error("Unexpected data entry");
            }

            do {
                line = lines[index++];
                if (line.length === 0) {
                    break;
                }
                modes.push(line);
            } while (true);
        }

        line = lines[index++];
        if (line !== "atn:") {
            throw new Error("Unexpected data entry");
        }

        line = lines[index++];
        const elements = line.split(",");
        let value;

        const serializedATN: number[] = [];
        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i];
            if (element.startsWith("[")) {
                value = Number(element.substring(1).trim());
            } else if (element.endsWith("]")) {
                value = Number(element.substring(0, element.length - 1).trim());
            } else {
                value = Number(element.trim());
            }
            serializedATN[i] = value;
        }

        const deserializer = new ATNDeserializer();

        return {
            atn: deserializer.deserialize(serializedATN),
            vocabulary: new Vocabulary(literalNames, symbolicNames, []),
            ruleNames,
            channels: channels.length > 0 ? channels : undefined,
            modes: modes.length > 0 ? modes : undefined,
        };
    }
}
