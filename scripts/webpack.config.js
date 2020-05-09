const path = require("path");
const chalk = require("chalk");
const yargsParser = require("yargs-parser");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const styledComponentsTransformer = require("typescript-plugin-styled-components").default();
const { ifDevelopment, log } = require("./utils");

const args = process.argv.slice(2);
const parsedArgs = yargsParser(args);
const dist = parsedArgs.dist || "dist";
const context = parsedArgs.context || path.resolve("src");
const main = parsedArgs.main || "./index.tsx";
const tsconfigPath = path.resolve("tsconfig.json");
const mode = ifDevelopment("development", "production");

log("webpack", `Bundling in ${chalk.magenta(mode)} mode`);

const webpackConfig = {
  mode,

  context,

  entry: [
    main,
    // Hot Module Reloading (HMR) is tricky to set up. To simplify things,
    // in development mode, we use HMR but only to reload the entire page.
    ifDevelopment("webpack-hot-middleware/client?reload=true"),
  ].filter(Boolean),

  output: {
    path: path.resolve(dist),
    filename: ifDevelopment("[name].js", "[name].[chunkhash].js"),
    chunkFilename: ifDevelopment("[name].js", "[name].[chunkhash].js"),
    publicPath: "./",
    // Include info about the modules path, e.g. require(/* ./test */23)
    pathinfo: ifDevelopment(),
    // Rename jsonp function to something else other than "webpackJsonP" to avoid conflicting with old
    // webpackJsonP function (e.g. webpack v3's jsonp function).
    // The old webpackJsonP is a function, while the new webpackJsonP is an array.
    // See: https://github.com/webpack/webpack/issues/6985
    jsonpFunction: "wbpkJsonP",
  },

  optimization: {
    // Enable code splitting for vendor and app bundles.
    // See: https://webpack.js.org/guides/code-splitting/
    splitChunks: {
      chunks: "all",
    },
  },

  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: tsconfigPath,
            // Transpile only. No type checks.
            transpileOnly: true,
            onlyCompileBundledFiles: true,
            ...(ifDevelopment()
              ? {
                  // Enable friendly styled-component names for development mode
                  getCustomTransformers: () => ({
                    before: [styledComponentsTransformer],
                  }),
                }
              : undefined),
          },
        },
        exclude: /node_modules/,
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },

      // Inline PNGs in Base64 if it is smaller than 10KB; otherwise, emmit files using file-loader.
      {
        test: /\.(png|jp(e?)g)$/,
        use: {
          loader: "url-loader",
          options: {
            mimetype: "image/png",
            limit: 10000,
            outputPath: "assets",
            publicPath: "assets",
            name: "[name]-[hash:6].[ext]",
          },
        },
      },

      {
        test: /\.pdf$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "assets",
            publicPath: "assets",
            name: "[name]-[hash:6].[ext]",
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      favicon: "favicon.png",
    }),

    ifDevelopment() && new webpack.HotModuleReplacementPlugin(),

    // Type checks
    new ForkTsCheckerWebpackPlugin({
      tsconfig: tsconfigPath,
      formatter: "codeframe",
    }),
  ].filter(Boolean),

  devtool: ifDevelopment("cheap-module-eval-source-map"),

  stats: { modules: false },

  performance: { hints: false },
};

module.exports = webpackConfig;
