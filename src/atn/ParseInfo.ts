/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import { DFA } from "../index.js";
import { DecisionInfo, ProfilingATNSimulator } from "./index.js";

/**
 * This class provides access to specific and aggregate statistics gathered
 * during profiling of a parser.
 *
 * @since 4.3
 */

export class ParseInfo {
  protected readonly atnSimulator: ProfilingATNSimulator;

  constructor(atnSimulator: ProfilingATNSimulator) {
    this.atnSimulator = atnSimulator;
  }

  getDecisionInfo(): DecisionInfo[] {
    return this.atnSimulator.getDecisionInfo();
  }

  getLLDecisions(): number[] {
    const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
    const LL: number[] = [];
    for (let i = 0; i < decisions.length; i++) {
      const fallBack = decisions[i].LL_Fallback;
      if (fallBack > 0) LL.push(i);
    }
    return LL;
  }

  getTotalTimeInPrediction(): number {
    const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
    let t = 0;
    for (let i = 0; i < decisions.length; i++) {
      t += decisions[i].timeInPrediction;
    }
    return t;
  }

  getTotalSLLLookaheadOps(): number {
    const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
    let k = 0;
    for (let i = 0; i < decisions.length; i++) {
      k += decisions[i].SLL_TotalLook;
    }
    return k;
  }

  getTotalLLLookaheadOps(): number {
    const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
    let k = 0;
    for (let i = 0; i < decisions.length; i++) {
      k += decisions[i].LL_TotalLook;
    }
    return k;
  }

  getTotalSLLATNLookaheadOps(): number {
    const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
    let k = 0;
    for (let i = 0; i < decisions.length; i++) {
      k += decisions[i].SLL_ATNTransitions;
    }
    return k;
  }

  getTotalLLATNLookaheadOps(): number {
    const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
    let k = 0;
    for (let i = 0; i < decisions.length; i++) {
      k += decisions[i].LL_ATNTransitions;
    }
    return k;
  }

  getTotalATNLookaheadOps(): number {
    const decisions: DecisionInfo[] = this.atnSimulator.getDecisionInfo();
    let k = 0;
    for (let i = 0; i < decisions.length; i++) {
      k += decisions[i].SLL_ATNTransitions;
      k += decisions[i].LL_ATNTransitions;
    }
    return k;
  }

  // getDFASize(): number {
  //   let n = 0;
  //   const decisionToDFA: DFA[] = this.atnSimulator.decisionToDFA;
  //   for (let i = 0; i < decisionToDFA.length; i++) {
  //     n += this.getDFASize(i);
  //   }
  //   return n;
  // }

  getDFASize(decision: number): number {
    const decisionToDFA: DFA = this.atnSimulator.decisionToDFA[decision];
    return decisionToDFA.states.length;
  }
}
