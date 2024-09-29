/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import type { IComparable } from "../utils/helpers.js";
import { HashMap } from "./HashMap.js";

/**
 * This class extends `HashMap` to maintain the insertion order of the keys.
 */
export class OrderedHashMap<K extends IComparable, V> extends HashMap<K, V> {
    #keys: K[] = [];

    public override clear(): void {
        super.clear();
        this.#keys = [];
    }

    public override get(key: K): V | undefined {
        return super.get(key);
    }

    public override set(key: K, value: V): V | undefined {
        const result = super.set(key, value);
        if (result === undefined) { // The key did not exist yet.
            this.#keys.push(key);
        }

        return result;
    }

    public override setIfAbsent(key: K, value: V): V | undefined {
        const result = super.setIfAbsent(key, value);
        if (result === undefined) { // The key did not exist yet.
            this.#keys.push(key);
        }

        return result;
    }

    /**
     * @returns an iterable of the values in the map, in the order they were inserted.
     */
    public override values(): Iterable<V> {
        return {
            [Symbol.iterator]: () => {
                let index = 0;

                return {
                    next: (): IteratorResult<V> => {
                        if (index < this.#keys.length) {
                            return {
                                done: false,
                                value: super.get(this.#keys[index++])!,
                            };
                        }

                        return {
                            done: true,
                            value: undefined,
                        };
                    },
                };
            },
        };
    }

    /**
     * @returns an iterable of the keys in the map, in the order they were inserted.
     */
    public keys(): IterableIterator<K> {
        return this.#keys[Symbol.iterator]();
    }

    public override equals(o: unknown): boolean {
        if (!(o instanceof OrderedHashMap)) {
            return false;
        }

        return super.equals(o);
    }
}
