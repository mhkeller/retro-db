import svelte from 'rollup-plugin-svelte';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript';
import stylus from 'stylus'

export default [
	{
		input: ['src/main.ts', 'src/launcher.ts'],
		output: {
			dir: 'dist',
			format: 'cjs',
			sourcemap: true
		},
		plugins: [
			resolve(),
			svelte({
				preprocess: {
					style: ({content, attributes, filename}) => {
						var style = stylus(content)
						  .set('filename', filename)
						  .set('sourcemap', {comment: true});

						return new Promise(function (resolve, reject) {
							style.render(function (err, code) {
								if(err !== null) return reject(err);
								resolve({code, map: style.sourcemap});
							});
						});
					}
				},
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
