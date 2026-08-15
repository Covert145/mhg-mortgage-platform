import { baseConfig } from "./base.mjs";

/** @type {import('eslint').Linter.Config[]} */
export const nextjsConfig = [
  ...baseConfig,
  {
    rules: {
      // Next.js server actions/route handlers legitimately export non-component values.
      "@typescript-eslint/no-misused-promises": "off",
    },
  },
];

export default nextjsConfig;
