import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import url from '@rollup/plugin-url'
import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import babel from '@rollup/plugin-babel'
import json from './rollup/plugins/json.js'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
import fs from 'fs'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
  (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning)

const preprocess = sveltePreprocess({
  // replace: [['@styles', path.resolve(__dirname, 'src/styles')]],
  scss: {
    includePaths: ['theme'],
  },
})

const mapkitSecret =
  process.env.MAPKIT_SECRET ||
  fs.readFileSync('./certificates/mapkit.p8', 'utf8')

const commonReplacements = {
  'process.env.NODE_ENV': JSON.stringify(mode),
  'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now(),
  'process.env.MAPKIT_SECRET': JSON.stringify(mapkitSecret),
}
// to get it to work with vercel we need to add exports param
const serverOutput = { ...config.server.output(), exports: 'default' }
const jsonOptions = { compact: !dev }

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      json(jsonOptions),
      replace({
        preventAssignment: true,
        'process.browser': true,
        ...commonReplacements,
      }),
      svelte({
        compilerOptions: {
          dev,
          hydratable: true,
        },
        preprocess,
        emitCss: true,
      }),
      url({
        sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
        publicPath: '/client/',
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),

      legacy &&
        babel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          babelHelpers: 'runtime',
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
          format: { comments: false },
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: serverOutput,
    plugins: [
      json(jsonOptions),
      replace({
        preventAssignment: true,
        'process.browser': false,
        ...commonReplacements,
      }),
      svelte({
        compilerOptions: {
          dev,
          generate: 'ssr',
          hydratable: true,
        },
        preprocess,
      }),
      url({
        sourceDir: path.resolve(__dirname, 'src/node_modules/images'),
        publicPath: '/client/',
        emitFiles: false, // already emitted by client build
      }),
      resolve({
        dedupe: ['svelte'],
      }),
      commonjs(),
      replace({
        'lodash-es': 'lodash', // server does not like lodash-es
      }),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules
    ),

    preserveEntrySignatures: 'strict',
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        preventAssignment: true,
        'process.browser': true,
        ...commonReplacements,
      }),
      commonjs(),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
}
