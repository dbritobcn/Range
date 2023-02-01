module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest-dom/recommended',
    "plugin:cypress/recommended"
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', "jest-dom"],
  root: true,
  rules: {
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off"
  },
  env: {
    "browser": true,
    "amd": true,
    "node": true
  }
};
