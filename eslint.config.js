import eslint from '@eslint/js';
import astroPlugin from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript rules for TS/TSX files
  ...tseslint.configs.recommended,

  // Astro recommended rules
  ...astroPlugin.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off', // Allow ts-ignore and ts-expect-error

      // General rules
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-console': 'off', // Allow console statements for development
    },
  },

  // Specific config for JavaScript files
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'public/**',
      '*.d.ts',
      'wrangler.toml',
      'worker-configuration.d.ts',
    ],
  },
];
