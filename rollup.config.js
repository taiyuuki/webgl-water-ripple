import { defineConfig } from 'rollup'
import ts from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import babelPlugin from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import builtins from 'rollup-plugin-node-builtins'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'

const config = defineConfig([
    {
        input: ['src/index.ts'],
        output: [
            {
                dir: 'dist/esm',
                format: 'esm',
                preserveModules: true,
            },
            {
                dir: 'dist/cjs',
                format: 'cjs',
                preserveModules: true,
            },
        ],
        plugins: [
            ts(),
            babelPlugin({
                exclude: '**/node_modules/**',
                extensions: ['.ts'],
                babelHelpers: 'bundled',
            }),
            commonjs(),
        ],
    },
    {
        input: 'src/umd.ts',
        output: [
            {
                file: 'dist/umd/index.js',
                format: 'umd',
                name: 'webglWR',
            },
        ],
        plugins: [
            ts(),
            babelPlugin({
                exclude: '**/node_modules/**',
                extensions: ['.ts'],
                babelHelpers: 'bundled',
            }),
            commonjs(),
            resolve({ preferBuiltins: true, mainFields: ['browser'] }),
            globals(),
            builtins(),
            terser(),
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            dir: 'dist/types',
            format: 'esm',
            preserveModules: true,
        },
        plugins: [dts()],
    },
])

export default config
