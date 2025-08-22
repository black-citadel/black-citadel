import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const rendererConfig: webpack.Configuration = {
  mode: 'development',
  target: 'web',
  entry: './src/renderer/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'index.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /monaco-editor/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.css$/,
        include: /monaco-editor/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.svg'],
    alias: {
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@views': path.resolve(__dirname, 'src/renderer/views'),
      '@utils': path.resolve(__dirname, 'src/renderer/utils'),
      '@store': path.resolve(__dirname, 'src/renderer/store'),
      '@providers': path.resolve(__dirname, 'src/renderer/providers'),
      '@types': path.resolve(__dirname, 'src/renderer/types'),
      '@templates': path.resolve(__dirname, 'src/renderer/templates'),
      '@help': path.resolve(__dirname, 'src/renderer/help'),
      '@context': path.resolve(__dirname, 'src/renderer/context'),
      '@assets': path.resolve(__dirname, 'src/renderer/assets'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};

export default rendererConfig;