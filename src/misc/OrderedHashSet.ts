/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { IComparable } from "../utils/helpers.js";
import { HashSet } from "./HashSet.js";

export class OrderedHashSet<T extends IComparable> extends HashSet<T> {
    #elements: T[] = [];

    public override getOrAdd(o: T): T {
        const oldSize = this.size;
        const result = super.getOrAdd(o);
        if (this.size > oldSize) {
            this.#elements.push(o);
        }

        return result;
    }

    public override equals(o: unknown): boolean {
        if (!(o instanceof OrderedHashSet)) {
            return false;
        }

        return super.equals(o);
    }

    public override clear(): void {
        super.clear();
        this.#elements = [];
    }

    public override *[Symbol.iterator](): IterableIterator<T> {
        yield* this.#elements;
    }

    public override toArray(): T[] {
        return this.#elements.slice(0);
    }
}
