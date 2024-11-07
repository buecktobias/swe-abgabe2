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
            '@typescript-eslint/naming-convention': [
                'warn',
                {
                    selector: 'default',
                    format: ['camelCase'],
                },
                {
                    selector: 'variableLike',
                    format: ['camelCase'],
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                {
                    selector: 'property',
                    format: ['camelCase'],
                },
                {
                    selector: 'enumMember',
                    format: ['UPPER_CASE'],
                },
            ],
            'check-file/no-index': 'error',
            'check-file/folder-match-with-fex': [
                'warn',
                {
                    '*.component.ts': '**/{components,pages}/**',
                    '*.service.ts': '**/services/',
                    '*.model.ts': '**/models/',
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
                {
                    ignoreMiddleExtensions: true,
                },
            ],
            'check-file/filename-blocklist': [
                'error',
                {
                    '**/models/!(*.model).ts': '*.model.ts',
                },
            ],
            'check-file/folder-naming-convention': [
                'error',
                {
                    'src/**/': 'KEBAB_CASE',
                },
            ],
            'no-inline-comments': 'warn',
            'no-warning-comments': ['warn', { terms: ['todo', 'fixme'], location: 'anywhere' }],
            '@typescript-eslint/prefer-readonly': 'warn',
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    trailingComma: 'all',
                    semi: true,
                },
            ],
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],
        },
    },
    {
        files: ['src/app/app.component.ts'],
        rules: {
            'check-file/folder-match-with-fex': 'off', // Disable this rule for app.component.ts
        },
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
        rules: {},
    },
);
