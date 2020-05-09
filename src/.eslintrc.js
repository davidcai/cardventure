const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  globals: {
    Promise: true,
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "prettier/@typescript-eslint",
    // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors.
    // NOTE: Make sure this is always the last configuration in the extends array.
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "react-hooks", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    sourceType: "module", // Allows for the use of imports
  },
  ignorePatterns: ["__snapshots__/", ".tmp/", "assets/"],
  rules: {
    "@typescript-eslint/ban-ts-ignore": OFF,
    "@typescript-eslint/explicit-function-return-type": OFF,
    "@typescript-eslint/explicit-member-accessibility": OFF,
    "@typescript-eslint/interface-name-prefix": [ERROR, "always"],
    "@typescript-eslint/no-empty-function": OFF,
    "@typescript-eslint/no-explicit-any": OFF,
    "@typescript-eslint/no-non-null-assertion": OFF,
    "@typescript-eslint/no-object-literal-type-assertion": OFF,
    "@typescript-eslint/no-unused-vars": ERROR,
    "import/default": OFF,
    "import/extensions": [
      ERROR,
      "ignorePackages",
      { js: "never", jsx: "never", ts: "never", tsx: "never" },
    ],
    "import/no-extraneous-dependencies": OFF,
    "import/no-unresolved": [ERROR, { ignore: ["^@fei/"] }],
    "import/order": [
      ERROR,
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [
          {
            pattern: "..",
            group: "parent",
          },
        ],
        "newlines-between": "always",
      },
    ],
    "import/prefer-default-export": OFF,
    "jsx-a11y/anchor-is-valid": OFF,
    "jsx-a11y/click-events-have-key-events": OFF,
    "jsx-a11y/label-has-for": OFF,
    "jsx-a11y/no-static-element-interactions": OFF,
    "no-nested-ternary": OFF,
    "no-plusplus": OFF,
    "no-underscore-dangle": OFF,
    "prefer-destructuring": OFF,
    "prettier/prettier": ERROR,
    "react/destructuring-assignment": OFF,
    "react/jsx-curly-newline": OFF,
    "react/jsx-filename-extension": [ERROR, { extensions: [".jsx", ".tsx"] }],
    "react/jsx-indent": OFF,
    "react/jsx-one-expression-per-line": OFF,
    "react/jsx-props-no-spreading": OFF,
    "react/jsx-wrap-multilines": OFF,
    "react/no-array-index-key": ERROR,
    "react/no-unescaped-entities": [ERROR, { forbid: [">", "}"] }],
    "react/no-unused-state": OFF,
    "react/prop-types": OFF, // TypeScript already covered prop types. Disable this rule.
    "react-hooks/exhaustive-deps": ERROR,
    "react-hooks/rules-of-hooks": ERROR,
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    "import/resolver": {
      node: {
        // A list of file extensions that will be parsed as modules and inspected for exports.
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
