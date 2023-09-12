#!/usr/bin/env node

/*
 * Copyright (c) The ANTLR Project. All rights reserved.
 * Use of this file is governed by the BSD 3-clause license that
 * can be found in the LICENSE.txt file in the project root.
 */

const child_process = require('child_process');
const path = require('path');
const process = require('process');

const value = ['-jar', path.join(__dirname, 'antlr4-4.13.2-SNAPSHOT-complete.jar')]
    .concat(process.argv.slice(2));
const child = child_process.spawn("java", value, { stdio: "inherit" });

child.on('close', function (code) {
    process.exitCode = code;
    code && console.log("child process exited with code ", code);
});
