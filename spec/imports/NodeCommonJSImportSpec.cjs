/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

const antlr4 = require("antlr4ng");

describe("Antlr4 Node CommonJs", () => {
    it("should use the CommonJS module on Node.js", () => {
        expect(antlr4).toBeDefined();
    });
});
