const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "../src"),
  // build: path.join(__dirname, "../build"),
  build: path.join(__dirname, "../../backend-js/src/frontend")
};

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    index: path.join(__dirname, '../src/js/index.js')
  },
  output: {
    filename: `js/[name].min.js`,
    path: PATHS.build,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/"
      },
      {
        test: /_icons\.js/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader", options: { url: false } },
          { loader: "webfonts-loader" }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: () => ({
                plugins: [
                  require('autoprefixer'),
                  require('cssnano')({
                    preset: [
                      'default', {
                        discardComments: {
                          removeAll: true
                        }
                      }
                    ]
                  })
                ]
              })
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/images`, to: './images/' },
        { from: `${PATHS.src}/static`, to: './' }
      ]
    }),

    new HtmlWebpackPlugin({
      template: `${PATHS.src}/index.html`,
      filename: `./index.html`,
    })
  ]
};
