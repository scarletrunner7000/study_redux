const webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const NODE_PROD = (NODE_ENV === 'production');
const filename = NODE_PROD ? '[name]-[chunkhash:7].bundle' : '[name]-[chunkhash:7].bundle';
const nodeModulePath = path.resolve(path.dirname(__dirname), 'node_modules');

module.exports = {
  entry: {
    app: ['./src/index.jsx'],
    vendor: Object.keys(require('./package.json').dependencies).concat([
      'bootstrap/dist/css/bootstrap.css'
    ])
  },
  output: {
    path: path.resolve('dist'),
    filename: `${filename}.js`
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: nodeModulePath,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.jsx?$/,
        exclude: nodeModulePath,
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }],
            'react'
          ],
          plugins: ['transform-object-rest-spread'],
        }
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader', // inject CSS to page
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS modules
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader', // Run post css actions
              options: {
                parser: 'postcss-scss',
                plugins: [ // post css plugins, can be exported to postcss.config.js
                  require('precss'),
                  require('autoprefixer')({
                    browsers: ['last 2 versions']
                  }),
                ]
              }
            },
            {
              loader: 'sass-loader' // compiles SASS to CSS
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: NODE_PROD ? '[name]-[hash:7].[ext]' : '[name]-[hash:7].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.es6']
  },
  devtool: NODE_PROD ? false : 'source-map',
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new HtmlWebpackPlugin({
      title: 'Hello World!',
      template: 'src/assets/index.ejs',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: `${filename}.js`,
      minChunks: Infinity,
    }),
    new ExtractTextWebpackPlugin(`${filename}.css`, {
      allChunks: true
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  }
};

