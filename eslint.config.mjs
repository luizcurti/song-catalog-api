import parserTs from '@typescript-eslint/parser';
import pluginTs from '@typescript-eslint/eslint-plugin';
import pluginJest from 'eslint-plugin-jest';
import pluginImport from 'eslint-plugin-import';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/coverage/',
    '**/build/',
    '**/models/',
    '**/config/',
    '**/errors/'
  ]),
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      jest: pluginJest,
      import: pluginImport
    },
    rules: {
      'no-console': 'off',
      'class-methods-use-this': 'off',
      'import/first': 'off',
      'no-param-reassign': 'off',
      'no-restricted-syntax': 'off',
      'max-len': ['error', { code: 200 }],
      'no-promise-executor-return': 'off',
      'jest/no-conditional-expect': 'off',
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          js: 'never'
        }
      ]
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts']
        }
      }
    }
  }
]);
