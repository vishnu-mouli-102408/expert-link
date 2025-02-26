import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-console": [
        "error",
        {
          allow: ["info", "warn", "error"],
        },
      ],

      "no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",

      "@typescript-eslint/no-explicit-any": [
        "error",
        {
          fixToUnknown: true,
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "off",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      "react/no-unescaped-entities": "off",
      semi: ["error", "always"],
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "no-trailing-spaces": "error",
      quotes: ["error", "double"],
    },
  },
];

export default eslintConfig;
