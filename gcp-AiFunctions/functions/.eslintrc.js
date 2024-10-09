module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',  // TypeScript support
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],  // Ensure this points to the correct tsconfig.json
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*',  // Ignore built files
    '/generated/**/*',  // Ignore generated files
    '/node_modules/**/*',  // Ignore node_modules
    '*.js',  // Optionally ignore JavaScript files
  ],
  plugins: [
    '@typescript-eslint',  // Support for TypeScript linting
    'import',  // Linting support for import/export syntax
  ],
  rules: {
    'max-len': ['error', { 'code': 100 }],  // Set maximum line length to 100
    'no-unused-vars': 'off',  // Handled by TypeScript
    '@typescript-eslint/no-unused-vars': ['error'],  // Enable TS-specific unused var rule
    '@typescript-eslint/explicit-function-return-type': 'off',  // Do not require return types on functions
    '@typescript-eslint/no-explicit-any': 'warn',  // Warn when using 'any' type
    'import/no-unresolved': 'error',  // Flag unresolved imports
  },
};
