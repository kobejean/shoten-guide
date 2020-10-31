import svelte from "rollup-plugin-svelte";
import sveltePreprocess from 'svelte-preprocess'
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

const isDev = Boolean(process.env.ROLLUP_WATCH);

const preprocess = sveltePreprocess()

const browserBundlePlugins = [
	json(),
	svelte({
		hydratable: true,
		preprocess,
		css: css => {
			css.write("bundle.css");
		}
	}),
	resolve(),
	commonjs(),
	// App.js will be built after bundle.js, so we only need to watch that.
	// By setting a small delay the Node server has a chance to restart before reloading.
	isDev &&
		livereload({
			watch: "public/App.js",
			delay: 300
		}),
	!isDev && terser()
]

export default [
	// Browser module bundle
	{
		input: "src/main.js",
		output: {
			name: "app",
			sourcemap: true,
			format: "es",
			dir: "public/module",
			// file: "public/module/main.js",
			// inlineDynamicImports: true,
		},
		plugins: browserBundlePlugins
	},
	// Browser nomodule bundle
	{
		input: "src/main.js",
		output: {
			name: "app",
			sourcemap: true,
			format: "system",
			dir: "public/nomodule",
			// file: "public/nomodule/main.js",
			// inlineDynamicImports: true,
		},
		plugins: browserBundlePlugins
	},
	// Server bundle
	{
		input: "src/App.svelte",
		output: {
			sourcemap: false,
			format: "es",
			name: "app",
			file: "public/App.js",
			inlineDynamicImports: true
		},
		plugins: [
			json(),
			svelte({
				hydratable: true,
				preprocess,
				generate: "ssr"
			}),
			resolve(),
			commonjs(),
			!isDev && terser()
		]
	}
];