import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import * as path from 'path';

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@context': path.resolve(__dirname, 'src/renderer/context'),
      '@hooks': path.resolve(__dirname, 'src/renderer/hooks'),
      '@utils': path.resolve(__dirname, 'src/renderer/utils'),
      '@views': path.resolve(__dirname, 'src/renderer/views'),
      '@templates': path.resolve(__dirname, 'src/renderer/templates'),
      '@help': path.resolve(__dirname, 'src/renderer/help')
    }
  },
};
