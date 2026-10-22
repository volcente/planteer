import { defineConfig } from 'oxlint';

export default defineConfig({
	options: {
		typeAware: true,
	},
	plugins: [
		'eslint',
		'import',
		'jsdoc',
		'oxc',
		'promise',
		'typescript',
		'vitest',
	],
});
