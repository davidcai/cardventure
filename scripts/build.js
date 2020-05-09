#!/usr/bin/env node

const path = require("path");
const spawn = require("cross-spawn");
const rimraf = require("rimraf");
const yargsParser = require("yargs-parser");
const { getEnv, resolveBin } = require("./utils");

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);
const { dist = "dist" } = parsedArgs;
const config = ["--config", "scripts/webpack.config.js"];

rimraf.sync(path.resolve(dist));

const result = spawn.sync(resolveBin("webpack"), [...config, ...args], {
  stdio: "inherit",
  env: getEnv(),
});

process.exit(result.status);
