const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const promise = require('eslint-plugin-promise');

module.exports = tseslint.config(
  {
    // Global ignores
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.js',
      '*.mjs',
      '*.cjs',
      'coverage/**',
      '.nyc_output/**'
    ]
  },
  
  // Base configurations
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  promise.configs['flat/recommended'],
  
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_', 'caughtErrorsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      
      // General rules  
      'no-console': 'off', // CLI tool - console output is expected
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-floating-promises': 'error'
    }
  }
); 