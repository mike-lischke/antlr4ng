import { ParseTreeListener } from "./ParseTreeListener.js";
import { ParseTree } from "./ParseTree.js";

export declare class ParseTreeWalker {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static DEFAULT: ParseTreeWalker;

    public walk<T extends ParseTreeListener>(listener: T, t: ParseTree): void;
}
