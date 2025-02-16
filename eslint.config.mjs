import eslint from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tseslintParser from '@typescript-eslint/parser'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
	{
		ignores: ['dist/**', '.eslintrc.cjs'],
	},
	eslint.configs.recommended,
	{
		files: ['**/*.js'],
		languageOptions: {
			globals: {
				// Node.js globals
				require: true,
				__dirname: true,
				__filename: true,
			},
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tseslintParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			'react-refresh': reactRefresh,
			'react-hooks': reactHooks,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				Phaser: 'readonly',
				process: 'readonly',
				console: 'readonly',
			},
		},
	},
]
