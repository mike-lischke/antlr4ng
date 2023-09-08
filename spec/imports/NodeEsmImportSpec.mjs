/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import * as antlr4 from "antlr4ng";

describe("Antlr4 Node Esm", () => {
    it("should use the Esm module on Node.js", () => {
        expect(antlr4).toBeDefined();
    });
});

export { };
