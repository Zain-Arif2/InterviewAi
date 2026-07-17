import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/flatcompat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Global Ignores (Replaces the old .eslintignore file)
  // Note: A configuration object with ONLY an "ignores" key acts globally.
  {
    ignores: [
      ".next/**/*",
      "out/**/*",
      "dist/**/*",
      "node_modules/**/*",
      "coverage/**/*"
    ],
  },

  // 2. Legacy Plugin Compatibility Layers
  ...compat.extends("next/core-web-vitals"),

  // 3. Custom Project Rules overrides
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;