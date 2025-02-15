import js from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.jsx", "**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest, // ✅ Add Jest globals
        chrome: true, // ✅ Allow Chrome API usage
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // ✅ Enable JSX parsing
        },
      },
    },
    plugins: {
      react,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn", // ⛔ Prevent unnecessary errors
      "no-undef": "off", // ✅ Ignore undefined testing globals
    },
  },
];
