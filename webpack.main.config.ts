import type { Configuration } from 'webpack';
import * as path from 'path';

import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@context': path.resolve(__dirname, 'src/renderer/context'),
      '@hooks': path.resolve(__dirname, 'src/renderer/hooks'),
      '@utils': path.resolve(__dirname, 'src/renderer/utils'),
      '@views': path.resolve(__dirname, 'src/renderer/views'),
      '@templates': path.resolve(__dirname, 'src/renderer/templates'),
      '@help': path.resolve(__dirname, 'src/renderer/help')
    },
  },
};
