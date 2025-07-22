import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["webpack.config.js", "webpack.*.js", "babel.config.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
      ecmaVersion: 2022,
    },
  },
  eslintConfigPrettier,
]);
