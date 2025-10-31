const next = require('eslint-config-next');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

const projectConfig = {
	files: ['**/*.ts', '**/*.tsx'],
	languageOptions: {
		parser: tsParser,
		parserOptions: {
			project: './tsconfig.json',
			tsconfigRootDir: __dirname,
		},
	},
	plugins: {
		'@typescript-eslint': tsPlugin,
	},
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports',
				disallowTypeAnnotations: false,
			},
		],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true,
			},
		],
	},
};

const importSortingConfig = {
	files: ['**/*.{js,jsx,ts,tsx}'],
	plugins: {
		'simple-import-sort': simpleImportSort,
	},
	rules: {
		'next/no-css-tags': 'off',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
	},
};

const vitestConfig = {
	files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
	languageOptions: {
		globals: {
			...globals.vitest,
		},
	},
};

const ignores = {
	ignores: [
		'node_modules/',
		'.next/',
		'coverage/',
		'playwright-report/',
		'test-results/',
		'pnpm-lock.yaml',
		'.turbo/',
		'.vercel/',
		'public/',
		'.vscode/',
		'.mcp/',
	],
};

module.exports = [ignores, ...next, importSortingConfig, projectConfig, vitestConfig, prettier];
