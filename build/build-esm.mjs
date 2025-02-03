import * as esbuild from "esbuild";
import { singleModulesPlugin } from "esbuild-plugin-single-modules";
import path from "path";
import { fileURLToPath } from "url";

// --------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcFolder = "src";
const distFolder = "dist";

const projectRoot = path.dirname(__dirname);
const srcRoot = path.join(projectRoot, srcFolder);

// --------------------------------------------------------------------------

const params = process.argv.slice(2);

// extract flags from CLI arguments (simple toggle flags, no arguments allowed)
// https://esbuild.github.io/api/#source-maps
const sourcemap = params.includes("--sourcemap");

// remove any flags so that filename will be left
const paramsWithoutFlags = params.filter((param) => !param.startsWith("--"));

// input file
const input = paramsWithoutFlags.length > 0 ? paramsWithoutFlags[0] : "./src/index.js";
// output folder (based on input file)
const outputDir = outputDirForInput(input);

function outputDirForInput(input) {
  // absolute file path
  const absInput = path.resolve(input);
  // compute relative path based on input/source directory
  const relInputToSrc = path.relative(srcRoot, absInput);
  // compute relative path for output/dist directory
  return path.join(distFolder, path.dirname(relInputToSrc));
}

// --------------------------------------------------------------------------

const options = {
  entryPoints: [input],
  outdir: outputDir,
  target: "esnext",
  format: "esm",
  outExtension: { '.js': '.mjs' },
  // resolveExtensions: ['.ts', '.js', '.mjs'],
  bundle: true,
  keepNames: true,
  logLevel: "info",
  mainFields: ["module", "main"],
  plugins: [singleModulesPlugin({ numLevelsInputPathToDrop: 1, transformImportExtensions: true })]
};

if (sourcemap) {
  Object.assign(options, { sourcemap: "external" });
}

// --------------------------------------------------------------------------

console.log(`Start build with "${input}" to "${distFolder}"`);

console.time("Took");
await esbuild.build(options);
console.timeEnd("Took");
