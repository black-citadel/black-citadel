import type { Configuration } from 'webpack';
import webpack from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import * as path from 'path';

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    // Add DefinePlugin to handle Node.js globals that Monaco might use
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@context': path.resolve(__dirname, 'src/renderer/context'),
      '@hooks': path.resolve(__dirname, 'src/renderer/hooks'),
      '@utils': path.resolve(__dirname, 'src/renderer/utils'),
      '@views': path.resolve(__dirname, 'src/renderer/views'),
      '@templates': path.resolve(__dirname, 'src/renderer/templates'),
      '@help': path.resolve(__dirname, 'src/renderer/help'),
      '@assets': path.resolve(__dirname, 'src/renderer/assets'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    },
    fallback: {
      // Monaco Editor might try to use some Node.js modules, provide empty mocks
      "path": false,
      "fs": false,
      "crypto": false,
      "os": false,
    }
  },
  ignoreWarnings: [
    // Ignore the critical dependency warning from Monaco Editor
    /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
  ],
};
