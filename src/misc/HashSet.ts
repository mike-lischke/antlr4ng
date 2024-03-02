/*
 * Copyright (c) 2012-2017 The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { MurmurHash } from "../utils/MurmurHash.js";
import { DefaultEqualityComparator } from "./DefaultEqualityComparator.js";
import { EqualityComparator } from "./EqualityComparator.js";

export class HashSet<T> implements Iterable<T> {
    static readonly #defaultLoadFactor = 0.75;
    static readonly #initialCapacity = 16; // must be power of 2

    #comparator: EqualityComparator<T>;
    #buckets: Array<T[] | undefined>;

    /** How many elements in set */
    #itemCount = 0;

    #threshold: number;

    public constructor(comparator?: EqualityComparator<T>, initialCapacity?: number);
    public constructor(set: HashSet<T>);
    public constructor(
        comparatorOrSet?: EqualityComparator<T> | HashSet<T>,
        initialCapacity = HashSet.#initialCapacity) {

        if (comparatorOrSet instanceof HashSet) {
            this.#comparator = comparatorOrSet.#comparator;
            this.#buckets = comparatorOrSet.#buckets.slice(0);
            for (let i = 0; i < this.#buckets.length; i++) {
                const bucket = this.#buckets[i];
                if (bucket) {
                    this.#buckets[i] = bucket.slice(0);
                }
            }

            this.#itemCount = comparatorOrSet.#itemCount;
            this.#threshold = comparatorOrSet.#threshold;
        } else {
            this.#comparator = comparatorOrSet ?? DefaultEqualityComparator.instance;
            this.#buckets = this.createBuckets(initialCapacity);
            this.#threshold = Math.floor(HashSet.#initialCapacity * HashSet.#defaultLoadFactor);
        }
    }

    /**
     * Add `o` to set if not there; return existing value if already
     * there. This method performs the same operation as {@link #add} aside from
     * the return value.
     *
     * @param o the object to add to the set.
     *
     * @returns An existing element that equals to `o` if already in set, otherwise `o`.
     */
    public getOrAdd(o: T): T {
        if (this.#itemCount > this.#threshold) {
            this.expand();
        }

        const b = this.getBucket(o);
        let bucket = this.#buckets[b];

        // Need a new bucket.
        if (!bucket) {
            bucket = [o];
            this.#buckets[b] = bucket;
            ++this.#itemCount;

            return o;
        }

        // We have a bucket, look for element in it.
        for (const existing of bucket) {
            if (this.#comparator.equals(existing, o)) {
                return existing;
            }
        }

        // Bucket is full, have to expand it.
        bucket.push(o);
        ++this.#itemCount;

        return o;
    }

    public get(o: T): T | undefined {
        if (o == null) {
            return o;
        }

        const b = this.getBucket(o);
        const bucket = this.#buckets[b];
        if (!bucket) {
            // no bucket
            return undefined;
        }

        for (const e of bucket) {
            if (this.#comparator.equals(e, o)) {
                return e;
            }
        }

        return undefined;
    }

    public hashCode(): number {
        let hash = MurmurHash.initialize();
        for (const bucket of this.#buckets) {
            if (bucket == null) {
                continue;
            }

            for (const o of bucket) {
                if (o == null) {
                    break;
                }
                hash = MurmurHash.update(hash, this.#comparator.hashCode(o));
            }
        }

        hash = MurmurHash.finish(hash, this.size);

        return hash;
    }

    public equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof HashSet)) {
            return false;
        }

        if (o.size !== this.size) {
            return false;
        }

        return this.containsAll(o);
    }

    public add(t: T): boolean {
        const existing: T = this.getOrAdd(t);

        return existing === t;
    }

    public contains(o: T): boolean {
        return this.containsFast(o);
    }

    public containsFast(obj: T): boolean {
        if (obj == null) {
            return false;
        }

        return this.get(obj) !== undefined;
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.toArray();
    }

    public toArray(): T[] {
        const a = new Array<T>(this.size);

        // Copy elements from the nested arrays into the destination array
        let i = 0; // Position within destination array
        for (const bucket of this.#buckets) {
            if (bucket == null) {
                continue;
            }

            for (const o of bucket) {
                if (o == null) {
                    break;
                }
                a[i++] = o;
            }
        }

        return a;
    }

    public containsAll(collection: Iterable<T>): boolean {
        if (collection instanceof HashSet) {
            for (const bucket of collection.#buckets) {
                if (bucket == null) {
                    continue;
                }

                for (const o of bucket) {
                    if (o == null) {
                        break;
                    }

                    if (!this.containsFast(o as T)) {
                        return false;
                    }
                }
            }
        } else {
            for (const o of collection) {
                if (!this.containsFast(o)) {
                    return false;
                }
            }
        }

        return true;
    }

    public addAll(c: Iterable<T>): boolean {
        let changed: boolean = false;

        for (const o of c) {
            const existing: T = this.getOrAdd(o);
            if (existing !== o) {
                changed = true;
            }
        }

        return changed;
    }

    public clear(): void {
        this.#buckets = this.createBuckets(HashSet.#initialCapacity);
        this.#itemCount = 0;
        this.#threshold = Math.floor(HashSet.#initialCapacity * HashSet.#defaultLoadFactor);
    }

    public toString(): string {
        if (this.size === 0) {
            return "{}";
        }

        let buf = "{";
        let first: boolean = true;
        for (const bucket of this.#buckets) {
            if (bucket == null) {
                continue;
            }

            for (const o of bucket) {
                if (o == null) {
                    break;
                }
                if (first) {
                    first = false;
                } else {
                    buf += ", ";
                }
                buf += o.toString();
            }
        }
        buf += "}";

        return buf;
    }

    public toTableString(): string {
        let buf = "";
        for (const bucket of this.#buckets) {
            if (bucket == null) {
                buf += "null\n";
                continue;
            }
            buf += "[";
            let first: boolean = true;
            for (const o of bucket) {
                if (first) {
                    first = false;
                } else {
                    buf += " ";
                }
                if (o == null) {
                    buf += "_";
                } else {
                    buf += o.toString();
                }
            }
            buf += "]\n";
        }

        return buf;
    }

    protected getBucket(o: T): number {
        const hash = this.#comparator.hashCode(o);
        const b = hash & (this.#buckets.length - 1); // assumes len is power of 2

        return b;
    }

    protected expand(): void {
        const old = this.#buckets;
        const newCapacity = this.#buckets.length * 2;
        const newTable: Array<T[] | undefined> = this.createBuckets(newCapacity);
        this.#buckets = newTable;
        this.#threshold = Math.floor(newCapacity * HashSet.#defaultLoadFactor);

        // rehash all existing entries
        for (const bucket of old) {
            if (!bucket) {
                continue;
            }

            for (const o of bucket) {
                const b = this.getBucket(o);
                let newBucket: T[] | undefined = this.#buckets[b];
                if (!newBucket) {
                    newBucket = [];
                    this.#buckets[b] = newBucket;
                }

                newBucket.push(o);
            }
        }
    }

    public get size(): number {
        return this.#itemCount;
    }

    public get isEmpty(): boolean {
        return this.#itemCount === 0;
    }

    /**
     * Return an array of `T[]` with length `capacity`.
     *
     * @param capacity the length of the array to return
     * @returns the newly constructed array
     */
    private createBuckets(capacity: number): Array<T[] | undefined> {
        return new Array<T[]>(capacity);
    }
}
