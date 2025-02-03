import * as esbuild from "esbuild";
import { singleModulesPlugin } from "esbuild-plugin-single-modules";

const input = "./src/index.js";
const distFolder = "dist";

const options = {
  entryPoints: [input],
  outdir: distFolder,
  target: "esnext",
  format: "esm",
  // sourcemap: "external", // disabled if not required
  outExtension: { ".js": ".mjs" }, // file extension for modules
  bundle: true, // required for singleModulesPlugin to work
  keepNames: true,
  logLevel: "info", // output a few esbuild infos
  mainFields: ["module", "main"],
  plugins: [
    singleModulesPlugin({
      numLevelsInputPathToDrop: 1, // remove "src/" path segment from inputs
      transformImportExtensions: true, // convert import extensions according to outExtension
    }),
  ],
};

console.log(`Start build with "${input}" to "${distFolder}"`);

console.time("Took");
await esbuild.build(options);
console.timeEnd("Took");
