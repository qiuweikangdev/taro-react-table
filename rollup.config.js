import path from 'path';
import RollupTypescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import less from 'less';
import RollupDts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const resolveFile = source => path.resolve(__dirname, source);

const externalPackages = [
  'react',
  'react-dom',
  '@tarojs/components',
  '@tarojs/runtime',
  '@tarojs/taro',
  '@tarojs/react'
];

const processLess = function(context, payload) {
  return new Promise((resolve, reject) => {
    less.render(
      {
        file: context
      },
      function(err, result) {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );

    less.render(context, {}).then(
      function(output) {
        if (output && output.css) {
          resolve(output.css);
        } else {
          reject({});
        }
      },
      function(err) {
        reject(err);
      }
    );
  });
};

const plugins = [
  postcss({
    extract: true,
    namedExports: true,
    minimize: true,
    process: processLess
  }),
  RollupTypescript({
    tsconfig: resolveFile('tsconfig.json'),
    useTsconfigDeclarationDir: true
  })
];

const config = [
  {
    input: resolveFile(pkg.source),
    output: [
      {
        file: resolveFile(pkg.main),
        format: 'es',
        plugins: [terser()]
      },
      {
        file: resolveFile(pkg.umd),
        format: 'umd',
        name: 'taro-react-table'
      }
    ],
    external: externalPackages,
    plugins
  }
  // {
  //   input: resolveFile(pkg.source),
  //   output: {
  //     file: resolveFile(pkg.types),
  //     format: 'es'
  //   },
  //   // plugins: [postcss(), RollupDts()]
  //   plugins: [...plugins, RollupDts()]
  // }
];
export default config;
