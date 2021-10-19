/* Development config:
   ========================================================================== */

const webpack = require("webpack");
const { merge } = require('webpack-merge');
const baseWebpackConfig = require("./webpack.base");

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    static: {
      directory: baseWebpackConfig.externals.paths.build,
    },
    compress: true,
    port: 3200
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map"
    })
  ]
});

module.exports = new Promise((resolve) => {
  resolve(devWebpackConfig);
});
