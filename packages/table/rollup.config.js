import path from 'path'
import RollupTypescript from '@rollup/plugin-typescript'
import RollupBabel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import RollupCommonjs from '@rollup/plugin-commonjs'
import RollupAlias from '@rollup/plugin-alias'
import RollupPostcss from 'rollup-plugin-postcss'
import pkg from './package.json'

const resolveFile = (source) => path.resolve(__dirname, source)

const externalPackages = [
  'react',
  'react-dom',
  '@tarojs/components',
  '@tarojs/runtime',
  '@tarojs/taro',
  '@tarojs/react',
]
export default {
  input: resolveFile('src/index.ts'),
  output: [
    {
      file: resolveFile(pkg.publishConfig.main),
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    },
    {
      file: resolveFile(pkg.publishConfig.module),
      format: 'es',
      sourcemap: true,
      exports: 'auto',
    },
  ],
  external: externalPackages,
  plugins: [
    RollupAlias({
      entries: [{ find: '@', replacement: resolveFile('src') }],
    }),
    RollupPostcss({
      extract: resolveFile(pkg.css),
      minimize: true,
    }),
    nodeResolve(),
    RollupCommonjs(),
    RollupBabel({
      exclude: 'node_modules/**',
    }),
    RollupTypescript(),
  ],
}
