import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        includeSource: ["src/**/*.{js,ts}"],
        logHeapUsage: true,
        isolate: false,
        environment: "node",
        pool: "threads",
    },
});
