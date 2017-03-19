'use strict';


const path = require('path');
const webpack = require('webpack');
const config = require('./build.config.js');

const isDev = process.env.NODE_ENV !== 'production';

let webpackConfig = {
  context: path.join(__dirname, 'src', 'js'),

  entry: isDev ?
    [
      require.resolve('webpack/hot/dev-server'),
      require.resolve('webpack-hot-middleware/client'),
      './index.js'
    ]
  :
    ['./index.js']
  ,

  output : {
    path       : path.join(__dirname, 'build', 'js'),
    filename   : 'bundle.js',
    publicPath : '/js/'
  },

  devtool : config.flags.isDev ? 'cheap-module-inline-source-map' : null, 

  resolve : {
    root : path.join(__dirname),
    modulesDirectories : ['node_modules', 'src/js'],
    extensions         : ['', '.js']
  },

  resolveLoader : {
    modulesDirectories : ['node_modules'],
    moduleTemplates    : ['*-loader'],
    extensions         : ['', '.js'] 
  },

  module : {
    loaders : [
      {
        test    : /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query:
        {
          presets:['react'],
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.endpoint$/,
        loader: 'file'
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite?' + JSON.stringify({
          name: '[name]_[hash]',
          prefixize: true
        })
      }
    ],
    postLoaders: [
      {
        test: path.join(__dirname, 'src', 'js', 'config', 'endpoints.js'),
        loader: 'transform?envify'
      }
    ]
  },

  plugins :
    isDev?
      [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
          React : 'react'
        })
      ]
    :
      [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress : {
            warnings     : false,
            drop_console : true,
            unsafe       : true
          }
        }),
        new webpack.ProvidePlugin({
          React : 'react'
        })
      ]
};

if(config.flags.isProd) {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        warnings     : false,
        drop_console : true,
        unsafe       : true
      }
    })
  );
}

module.exports = webpackConfig;
