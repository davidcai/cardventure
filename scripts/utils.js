const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const which = require("which");

const isEnv = (name) => name === (process.env.NODE_ENV || "development");
const isDevelopment = () => isEnv("development");
const isTest = () => isEnv("test");
const isProduction = () => isEnv("production");
const isCi = () =>
  typeof process.env.BUILD_NUMBER !== "undefined" ||
  typeof process.env.GIT_BRANCH !== "undefined";

const ifCond = (cond, t, f) =>
  t === undefined && f === undefined ? cond() : cond() ? t : f;
const ifCi = (t, f) => ifCond(isCi, t, f);
const ifDevelopment = (t, f) => ifCond(isDevelopment, t, f);
const ifTest = (t, f) => ifCond(isTest, t, f);
const ifProduction = (t, f) => ifCond(isProduction, t, f);

function getEnv() {
  // This is required to address an issue in cross-spawn
  // https://github.com/kentcdodds/kcd-scripts/issues/4
  return Object.keys(process.env)
    .filter((key) => process.env[key] !== undefined)
    .reduce(
      (envCopy, key) => ({
        ...envCopy,
        [key]: process.env[key],
      }),
      {}
    );
}

function log(prefix, message) {
  let msg = message;
  if (typeof message === "object") {
    msg = JSON.stringify(msg, null, 2);
  }

  // eslint-disable-next-line no-console
  console.log(
    msg
      .toString()
      .trim()
      .split("\n")
      .map((line) => `[${chalk.grey(prefix)}]: ${line}`)
      .join("\n")
  );
}

function resolveBin(
  modName,
  { executable = modName, cwd = process.cwd() } = {}
) {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {
    // ignore _error
  }

  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = require(modPkgPath);
    const binPath = typeof bin === "string" ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }

    return fullPathToBin.replace(cwd, ".");
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
}

/**
 * Creates a Express server with static routing for production mode or webpack setup
 * for development mode.
 *
 * @param {object} [opts] - Options
 * @param {string} [opts.dist="dist"]
 * A dist directory, relative to the package root, e.g. "dist".
 * @param {string} [opts.webpackConfig="scripts/webpack.config.js"]
 * Webpack config file, relative to the package root, e.g. "webpack.config.js".
 */
function createExpressApp(opts = {}) {
  const app = express();

  // Add catch-all route to enable HTML5 history for react-router's BrowserRouter
  // app.use(history());

  if (!ifDevelopment()) {
    app.use(express.static(path.resolve(opts.dist || "dist")));
  } else {
    const webpackConfigPath = path.resolve(
      opts.webpackConfig || "scripts/webpack.config.js"
    );
    const webpackConfig = require(webpackConfigPath);
    const webpackCompiler = webpack(webpackConfig);
    app.use(
      webpackDevMiddleware(webpackCompiler, {
        stats: "minimal",
        // To fix CORS issue with webpack dev server, add the following headers.
        // See: https://github.com/webpack/webpack-dev-server/issues/533
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
    );
    app.use(webpackHotMiddleware(webpackCompiler));
  }

  return app;
}

module.exports = {
  createExpressApp,
  getEnv,
  ifCi,
  ifDevelopment,
  ifProduction,
  ifTest,
  log,
  resolveBin,
};
