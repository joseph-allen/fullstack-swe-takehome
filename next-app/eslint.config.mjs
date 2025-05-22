import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js and TypeScript defaults
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Apply Prettier plugin and rule
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          semi: true,
          singleQuote: true,
          printWidth: 80,
          trailingComma: 'es5',
          tabWidth: 2,
          useTabs: false,
        },
      ],
    },
  },

  // Disable ESLint rules that conflict with Prettier
  {
    rules: configPrettier.rules,
  },
];
