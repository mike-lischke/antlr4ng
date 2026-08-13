/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { describe, expect, it } from "vitest";

import { DFA, DFAState } from "../../src/index.js";
import type { ATNConfigSet } from "../../src/index.js";

/**
 * `DFA` indexes its states by `ATNConfigSet.hashCode()`. A 32-bit hash is not injective, so the
 * table has to disambiguate a shared hash with `ATNConfigSet.equals()`; without that, two
 * different configuration sets are conflated and the simulator is handed a state describing a
 * decision it did not ask about. That surfaces far from here, as a spurious "no viable
 * alternative" on input that parses correctly in isolation, and — because the generated
 * recognizers share one `decisionToDFA` array across parses — it persists for the life of the
 * process, so whichever input populates the bucket first permanently breaks the other.
 *
 * A collision is impractical to provoke through a real grammar in a unit test, so these stubs
 * pin the hash directly. That is exactly the contract under test: `DFA` must not assume the hash
 * identifies the configuration set.
 *
 * @param hash The hash code the stub reports, so a collision can be forced.
 * @param id Identity of the stub, used by `equals` to tell colliding sets apart.
 *
 * @returns A configuration set stub with the given hash and identity.
 */
const configs = (hash: number, id: string): ATNConfigSet => {
    const stub = {
        id,
        hashCode: () => {
            return hash;
        },
        equals: (other: ATNConfigSet) => {
            return (other as unknown as { id: string; }).id === id;
        },
    };

    return stub as unknown as ATNConfigSet;
};

describe("DFA state table", () => {
    it("keeps different configuration sets that share a hash apart", () => {
        const dfa = new DFA(null, 0);
        const first = DFAState.fromConfigs(configs(42, "first"));
        const second = DFAState.fromConfigs(configs(42, "second"));

        dfa.addState(first);
        dfa.addState(second);

        expect(dfa.getState(first)).toBe(first);
        expect(dfa.getState(second)).toBe(second);
        expect(dfa.getStateForConfigs(second.configs)).toBe(second);
        expect(dfa.length).toBe(2);
        expect(first.stateNumber).not.toBe(second.stateNumber);
        expect(dfa.getStates()).toEqual([first, second]);
    });

    it("still returns the stored state for an equal configuration set", () => {
        const dfa = new DFA(null, 0);
        const stored = DFAState.fromConfigs(configs(42, "same"));
        const equivalent = DFAState.fromConfigs(configs(42, "same"));

        dfa.addState(stored);
        dfa.addState(equivalent);

        expect(dfa.getState(equivalent)).toBe(stored);
        expect(dfa.length).toBe(1);
    });

    it("reports no state for a hash that is present but does not match", () => {
        const dfa = new DFA(null, 0);
        const stored = DFAState.fromConfigs(configs(42, "stored"));
        dfa.addState(stored);

        expect(dfa.getStateForConfigs(configs(42, "absent"))).toBeNull();
    });
});
