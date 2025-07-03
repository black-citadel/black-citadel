import type { ModuleOptions } from 'webpack';

export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  // CSS rule for Monaco Editor - without PostCSS
  {
    test: /\.css$/,
    include: /monaco-editor/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" }
    ],
  },
  // CSS rule for all other CSS files - with PostCSS for Tailwind
  {
    test: /\.css$/,
    exclude: /monaco-editor/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      { loader: "postcss-loader" }
    ],
  },
  {
    test: /\.(svg|png|jpg|jpeg|gif)$/,
    type: 'asset/resource',
  },
];
