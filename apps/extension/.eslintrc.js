/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    webextensions: true
  }
}
