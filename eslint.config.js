// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // React Compiler-era rules from eslint-config-expo 57; the flagged
    // patterns were fixed in the animation/effects refactor. The few
    // remaining sites carry justified inline eslint-disable comments
    // (Reanimated SharedValue worklet API, web hydration pattern).
    rules: {
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/immutability": "error",
    },
  },
]);
