/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

// Fixes https://github.com/antlr/antlr4/issues/413
// "Tree pattern compilation doesn't check for a complete parse"
export class StartRuleDoesNotConsumeFullPatternError extends Error {
};
