// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // New React Compiler-era rules introduced with eslint-config-expo 57.
    // They flag long-standing patterns in the codebase; downgrade to
    // warnings until they are fixed file by file (see plans/).
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
]);
