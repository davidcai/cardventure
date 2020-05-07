#!/usr/bin/env node

const yargsParser = require("yargs-parser");
const chalk = require("chalk");
const { createExpressApp, ifDevelopment, log } = require("./utils");

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);
const { port = 8080, dist, webpackConfig } = parsedArgs;

const mode = ifDevelopment("development", "production");
log("server", `Serving in ${chalk.magenta(mode)} mode`);

createExpressApp({
  dist,
  webpackConfig,
}).listen(port, (err) => {
  if (err) {
    throw err;
  }

  log("server", `Hosting app at ${chalk.cyan(`http://localhost:${port}`)}`);
});
