import path from 'path';
import RollupTypescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import less from 'less';
import RollupDts from 'rollup-plugin-dts';

import { terser } from 'rollup-plugin-terser';

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
        // output.css = string of css
        // output.map = string of sourcemap
        // output.imports = array of string filenames of the imports referenced
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

const config = [
  {
    input: resolveFile('src/index.ts'),
    output: [
      {
        file: resolveFile('dist/index.js'),
        format: 'es'
        // plugins: [terser()]
      },
      {
        file: resolveFile('dist/index.umd.js'),
        format: 'umd',
        name: 'taro-react-table'
      }
    ],
    external: externalPackages,
    plugins: [
      postcss({
        extract: true,
        namedExports: true,
        minimize: true,
        process: processLess
      }),
      // RollupTypescript({
      //   tsconfig: resolveFile('tsconfig.rollup.json')
      // })
      RollupTypescript()
    ]
  }
  // {
  //   input: resolveFile('src/index.ts'),
  //   output: {
  //     file: resolveFile('dist/index.d.ts'),
  //     format: 'es'
  //   },
  //   plugins: [RollupDts()]
  // }
];
export default config;

// export default {
//   input: resolveFile('src/index.ts'),
//   output: [
//     {
//       file: resolveFile('dist/index.d.ts'),
//       format: 'es'
//     },
//     {
//       file: resolveFile('dist/index.js'),
//       format: 'es'
//       // plugins: [terser()]
//     }
//   ],
//   external: externalPackages,
//   plugins: [
//     postcss({
//       extract: true,
//       // namedExports: true,
//       minimize: true,
//       process: processLess
//     }),
//     // RollupDts()
//     RollupTypescript({
//       tsconfig: resolveFile('tsconfig.rollup.json')
//     })
//   ]
// };
