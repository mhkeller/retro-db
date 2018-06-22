import svelte from 'rollup-plugin-svelte';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript';

export default [
	{
		input: ['src/main.ts', 'src/launcher.ts', 'src/project.ts'],
		output: {
			dir: 'dist',
			format: 'cjs',
			sourcemap: true
		},
		plugins: [
			resolve(),
			svelte({
				css: css => {
					css.write('assets/svelte.css')
				},
				nestedTransitions: true,
				skipIntroByDefault: true
			}),
			commonjs(),
			json(),
			typescript({
				typescript: require('typescript')
			})
		],
		experimentalCodeSplitting: true,
		experimentalDynamicImport: true,
		external: [
			'electron',
			'child_process',
			'fs',
			'util',
			'events',
			'net',
			'tls',
			'crypto',
			'assert',
			'stream',
			'string_decoder',
			'dns',
			'path',
			'url',
			'node-pty',
			'default-shell',
			'xterm',
			'pg/native',
			'pg-native',
			'rimraf',
			'module',
			'os'
		]
	}
];
