/** @type {import("prettier").Config} */
export default {
  // Core formatting options
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',

  // Plugins
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],

  // Astro support
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],

  // Import sorting
  importOrder: ['^(react|astro)', '<THIRD_PARTY_MODULES>', '^@/', '^[./]'],
};
