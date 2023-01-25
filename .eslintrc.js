module.exports = {
  env: {
    node: true,
  },
  plugins: ['vue', 'sonarjs'],
  extends: [
    'airbnb-base',
    'plugin:unicorn/recommended',
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:sonarjs/recommended',
    'prettier',
  ],
  rules: {
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'unicorn/relative-url-style': ['error', 'always'],
    'unicorn/filename-case': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-optional-catch-binding': 'off',
    'unicorn/catch-error-name': 'off',
    'unicorn/prefer-module': 'off'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
      },
    },
  },
};
