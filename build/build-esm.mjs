import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcFolder = "src";
const distFolder = "dist/esm";

const projectRoot = path.dirname(__dirname);
const srcRoot = path.join(projectRoot, srcFolder);

// --------------------------------------------------------------------------

const params = process.argv.slice(2);
// console.debug("[process.argv]", params);

// extract flags from CLI arguments (simple toggle flags, no arguments allowed)
// https://esbuild.github.io/api/#source-maps
const sourcemap = params.includes("--sourcemap");
// https://esbuild.github.io/api/#metafile
const metafile = params.includes("--metafile");

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

const defaultBuildOptions = {
  bundle: true,
  outdir: outputDir,
  target: "esnext",
  format: "esm",
  keepNames: true,
  mainFields: ["module", "main"],
};

if (sourcemap) {
  Object.assign(defaultBuildOptions, { sourcemap: "external" });
}
if (metafile) {
  Object.assign(defaultBuildOptions, { metafile: true });
}

// --------------------------------------------------------------------------

// plugin that will start a new build for each imported filename

const splitFilesPluginSeen = new Set();

const splitFilesPlugin = {
  name: "split-files",
  setup(build) {
    const options = build.initialOptions;

    build.onResolve({ filter: /.*/ }, async (args) => {
      // console.debug("[split-files][onResolve][args]", args);

      // do nothing for "entry-point"
      if (args.kind === "entry-point") return;
      // check for supported processing
      if (args.kind !== "import-statement") {
        throw new Error(`Unknown import path type: "${args.kind}", expected "import-statement"`);
      }

      // this should now only be for "import-statement"
      const file = path.join(args.resolveDir, args.path);

      // only process (build) file once, then skip
      if (!splitFilesPluginSeen.has(file)) {
        splitFilesPluginSeen.add(file);

        // compute input and output names
        const relInput = "./" + path.relative(projectRoot, file);
        const relOutput = outputDirForInput(file);

        // run build for imported file as new entry-point
        // console.debug("[split-files][onResolve] build '%s' to '%s'", relInput, relOutput);
        await runBuild(relInput, { ...options, outdir: relOutput });
      }

      // set to external, so it will not be bundled
      return { external: true };
    });
  },
};

Object.assign(defaultBuildOptions, { plugins: [splitFilesPlugin] });

// --------------------------------------------------------------------------

const metafileAggregated = { inputs: {}, outputs: {} }

console.log(`Start build with "${input}" to "${distFolder}"`);
if (sourcemap) { console.log(`  - Will generate source maps`) };
if (metafile) { console.log(`  - Will generate metafile for bundle report`) };

console.time("Took");

// start recursive split bundling build
await runBuild(input, defaultBuildOptions);

if (metafile) {
  fs.writeFileSync(path.join(distFolder, "meta.json"), JSON.stringify(metafileAggregated))
}

console.timeEnd("Took");

// --------------------------------------------------------------------------

async function runBuild(input, options) {
  const result = await esbuild.build({
    ...options,
    entryPoints: [input],
    // write: false,
    metafile: true,
  });

  if (result.metafile) {
    Object.assign(metafileAggregated.inputs, result.metafile.inputs)
    Object.assign(metafileAggregated.outputs, result.metafile.outputs)
  }
}
