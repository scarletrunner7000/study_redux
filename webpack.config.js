const webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const NODE_PROD = (NODE_ENV === 'production');
const filename = NODE_PROD ? '[name]-[chunkhash:7].bundle' : '[name].bundle';
const nodeModulePath = path.resolve(path.dirname(__dirname), 'node_modules');

module.exports = {
  entry: {
    'app': ['./src/index.jsx'],
    vendor: Object.keys(require('./package.json').dependencies).concat([
      // 'bootstrap/dist/css/bootstrap.css'
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
        test: /\.js$/,
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
          ]
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                parser: 'postcss-scss',
                plugins: [
                  require('autoprefixer')({
                    browsers: ['last 2 versions']
                  }),
                  // ...(NODE_PROD ? require('./postcss.plugins.production') : [])
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: NODE_PROD ? '[name]-[hash:7].[ext]' : '[name].[ext]'
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
    // ...(NODE_PROD ? require('./plugins.production') : [])
  ],
  node: {
    __dirname: false,
    __filename: false,
  }
};

