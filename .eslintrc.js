module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['erb', 'plugin:react/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    indent: 'off',
    'react/react-in-jsx-scope': 'off',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'trace'],
      },
    ],
    eqeqeq: 2, // 要求使用 === 和 !==
    'react/jsx-key': 2, // 在数组或迭代器中验证JSX具有key属性
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-filename-extension': 'off',
    'react/function-component-definition': 'off',
    'import/extensions': 'off',
    'no-tabs': 'off',
    'prettier/prettier': 'warn',
    'no-unused-vars': 'error',
    'no-useless-return': 'off',
    'prefer-regex-literals': 'off',
    'prefer-promise-reject-errors': 'off',
    'promise/always-return': 'off',
    'consistent-return': 'off',
    'max-len': [1, { code: 150, tabWidth: 4 }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
  },
};
