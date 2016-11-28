var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
//var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  entry: {
    index: './src/js/index.js',
    main: './src/javascripts/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{from: 'src/templates'}])//默认输出到dist
  ]
};
