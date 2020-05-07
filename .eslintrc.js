const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  plugins: ["prettier"],
  ignorePatterns: [
    ".tmp/",
    "coverage/",
    "dist/",
    "docs/",
    "node_modules/",
    "typings/",
  ],
  rules: {
    "global-require": OFF,
    "import/default": OFF,
    "import/no-dynamic-require": OFF,
    "import/no-extraneous-dependencies": OFF,
    "import/prefer-default-export": OFF,
    "no-nested-ternary": OFF,
    "prettier/prettier": ERROR,
  },
};
