import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { mhgPlugin } from "./no-unscoped-prisma.mjs";

/** @type {import('eslint').Linter.Config[]} */
export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { mhg: mhgPlugin },
    rules: {
      "mhg/no-unscoped-prisma": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/prisma/generated/**",
      "**/storybook-static/**",
      "**/next-env.d.ts",
    ],
  },
];

export default baseConfig;
