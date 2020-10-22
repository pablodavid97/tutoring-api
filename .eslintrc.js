module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: [
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': "error",
    "prettier/prettier": "error",
    'class-mehtods-use-this': 'off',
    'lines-between-class-members': 'off'
  },
};
