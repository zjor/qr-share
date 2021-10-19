/* Build config:
   ========================================================================== */

const { merge } = require('webpack-merge');
const baseWebpackConfig = require("./webpack.base");

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  devtool: 'source-map',
  plugins: [],
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  }
});

module.exports = new Promise((resolve) => {
  resolve(buildWebpackConfig);
});
