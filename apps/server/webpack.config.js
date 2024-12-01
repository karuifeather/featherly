const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { join } = require('path');

const entryFile = process.env.ENTRY_FILE || './src/main.ts';
const isProduction = process.env.NODE_ENVIRONMENT === 'production';

module.exports = {
  entry: entryFile,
  output: {
    path: join(__dirname, '../../dist/apps/server'),
    filename: 'main.js', // Output file name
    libraryTarget: 'commonjs2', // Required for AWS Lambda compatibility
  },
  target: 'node', // Target Node.js
  resolve: {
    extensions: ['.ts', '.js'], // Resolve TypeScript and JavaScript
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: isProduction, // Minify only in production
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false, // Remove comments
          },
        },
        extractComments: false, // Do not extract comments into a separate file
      }),
    ],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: entryFile,
      tsConfig: './tsconfig.app.json',
      optimization: isProduction,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
