import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import prettier from 'eslint-plugin-prettier';
import checkFile from 'eslint-plugin-check-file';

export default tseslint.config(
        {
          languageOptions: {
            parserOptions: {
              projectService: true,
              tsconfigRootDir: new URL('.', import.meta.url).pathname,
            },
          },
          files: ['**/*.ts'],
          plugins: {
            prettier,
            'check-file': checkFile,
          },
          extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            ...angular.configs.tsRecommended,
          ],
          processor: angular.processInlineTemplates,

          rules: {
            // Angular-Specific Rules
            '@angular-eslint/directive-selector': [
              'error',
              { type: 'attribute', prefix: 'app', style: 'camelCase' },
            ],
            '@angular-eslint/component-selector': [
              'error',
              { type: 'element', prefix: 'app', style: 'kebab-case' },
            ],

            'prettier/prettier': [
              'error',
              {
                singleQuote: true,
                trailingComma: 'all',
                semi: true,
              },
            ],
            'no-inline-comments': 'warn',
            'no-warning-comments': ['warn', { terms: ['todo', 'fixme'], location: 'anywhere' }],

            '@typescript-eslint/naming-convention': [
              'warn',
              { selector: 'default', format: ['camelCase'] },
              { selector: 'variableLike', format: ['camelCase'] },
              { selector: 'typeLike', format: ['PascalCase'] },
              { selector: 'property', format: ['camelCase'], leadingUnderscore: 'allow' },
              { selector: 'enumMember', format: ['UPPER_CASE'] },
              {
                selector: 'parameter',
                modifiers: ['unused'],
                format: null,
                custom: { regex: '^_.*$', match: true },
              },
            ],
            'check-file/filename-naming-convention': [
              'error',
              {
                '**/*.{ts,js}': 'KEBAB_CASE',
                '**/*.component.ts': 'KEBAB_CASE',
                '**/*.service.ts': 'KEBAB_CASE',
                '**/*.module.ts': 'KEBAB_CASE',
                '**/*.gql.ts': 'KEBAB_CASE',
              },
              { ignoreMiddleExtensions: true },
            ],
            'check-file/folder-naming-convention': [
              'error',
              { 'src/**/': 'KEBAB_CASE' },
            ],

            'no-magic-numbers': [
              'warn',
              {
                ignore: [0],
                ignoreArrayIndexes: true,
                ignoreClassFieldInitialValues: true,
                enforceConst: true,
                detectObjects: false,
              },
            ],
            'max-lines': [
              'warn',
              { max: 300, skipBlankLines: true, skipComments: true },
            ],
            'max-lines-per-function': [
              'warn',
              { max: 30, skipBlankLines: true, skipComments: true, IIFEs: true },
            ],
            'max-depth': ['warn', { max: 3 }],
            'complexity': ['warn', { max: 10 }],
            '@typescript-eslint/prefer-readonly': 'warn',
            '@typescript-eslint/no-extraneous-class': 'warn',
            '@typescript-eslint/no-explicit-any': 'error',

            'check-file/no-index': 'error',
            'check-file/folder-match-with-fex': [
              'warn',
              {
                '*.component.ts': '**/{components,pages}/**',
                '*.service.ts': '**/services/',
                '*.model.ts': '**/models/',
              },
            ],
          },
        },

        {
          files: ['src/app/app.component.ts'],
          rules: {
            'check-file/folder-match-with-fex': 'off',
          },
        },
        {
          files: ['**/*.spec.ts'],
          rules: {
            'max-lines-per-function': 'off',
            'no-magic-numbers': 'off',
          },
        },

        {
          files: ['**/*.html'],
          extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
          ],
          rules: {},
        },
);
