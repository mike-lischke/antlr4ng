/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const buildConfig = (platform, extensions) => ({
    mode: "production",
    entry: `./src/antlr4/index.js`,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `antlr4.${extensions}`,
        chunkFormat: extensions === "mjs" ? "module" : "commonjs",
        library: {
            type: extensions === "mjs" ? "module" : "commonjs"
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }]
    },
    resolve: {
        extensions: ['.js'],
    },
    target: platform,
    plugins: [new ESLintPlugin()],
    devtool: "source-map",
    experiments: {
        outputModule: extensions === "mjs"
    },
});


export default [
    buildConfig("node", "mjs"),
];
