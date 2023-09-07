
const antlr4 = require("antlr4ng");

describe("Antlr4 Node CommonJs", () => {
    it("should use the CommonJS module on Node.js", () => {
        expect(antlr4).toBeDefined();
    });
});
