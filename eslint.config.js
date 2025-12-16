import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    plugins: {
      prettier,
    },
    languageOptions: {
      sourceType: 'commonjs',  
      globals: {                
        ...globals.node,
      },
      parserOptions: {
        ecmascriptFeatures: {
          impliedStrict: true,
        },
      },
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
