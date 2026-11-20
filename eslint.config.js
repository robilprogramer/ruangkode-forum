import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import daStyle from 'eslint-config-dicodingacademy';

export default [
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'storybook-static/**'] },
  js.configs.recommended,
  // Dicoding Academy JavaScript Style Guide
  daStyle,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node, ...globals.vitest },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'eqeqeq': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
    },
  },
  {
    // Test, story, dan konfigurasi Storybook bukan modul komponen untuk Fast Refresh.
    files: ['src/test/**', '**/*.test.{js,jsx}', '**/*.stories.{js,jsx}', '.storybook/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      globals: { ...globals.mocha, cy: 'readonly', Cypress: 'readonly' },
    },
  },
];
