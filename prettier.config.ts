import { type Config } from 'prettier';

const config: Config = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-astro',
    'prettier-plugin-css-order',
  ],
  printWidth: 100,
  singleQuote: true,

  // @ianvs/prettier-plugin-sort-imports
  importOrder: ['<BUILTIN_MODULES>', '<THIRD_PARTY_MODULES>', '^#(.*)$', '^[.]'],

  overrides: [
    // prettier-plugin-astro
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
