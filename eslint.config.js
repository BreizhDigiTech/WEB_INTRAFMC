import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'

export default [
    // Ignore common folders and build artifacts
    { ignores: ['dist', 'node_modules', 'coverage'] },

    // Base JS recommended
    js.configs.recommended,

    // Vue 3 essential rules
    ...vue.configs['flat/essential'],

    // Global defaults (browser)
    {
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 'latest',
            sourceType: 'module'
        }
    },

    // Vue SFCs: use vue-eslint-parser with TS as sub-parser
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue']
            }
        },
        plugins: {
            vue,
            '@typescript-eslint': typescript
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            // use TS variant of unused vars and ignore names starting with _
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'vue/no-unused-vars': 'warn'
        }
    },

    // TypeScript files
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        plugins: {
            '@typescript-eslint': typescript
        },
        rules: {
            // Let TypeScript handle undefined variables
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
        }
    },

    // Node/config files
    {
        files: [
            '*.config.*',
            'vite.config.ts',
            'vitest.config.ts',
            'tailwind.config.js',
            'postcss.config.js',
            '.eslintrc.js',
            'eslint.config.js'
        ],
        languageOptions: {
            globals: globals.node
        },
        rules: {
            'no-undef': 'off'
        }
    },

    // Test files (Vitest globals)
    {
        files: ['**/*.test.ts', 'src/test/**/*.ts'],
        languageOptions: {
            globals: { ...globals.node, ...globals.browser, ...(globals.vitest || {}) }
        }
    },

    // Project rules common
    {
        rules: {
            'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
        }
    },

    // Prettier last to disable stylistic rules
    prettier
]
