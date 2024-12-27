import pluginJs from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    ignores: ['**/.*', 'dist', 'node_modules'],
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettier,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
];
