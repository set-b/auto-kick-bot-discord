import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import parser from 'eslint-parser';

export default [
  js.configs.recommended,
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      parserOptions: {
        ecmascriptFeatures: {
          impliedStrict: true,
        },
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
