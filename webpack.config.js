'use strict';
let path = require('path');

module.exports = {
  entry: {
    'bootstrap': './src/main.ts',
    'bootstrap.aot': './src/main.aot.ts'
  },

  output: {
    path: './bin',
    filename: '[name].bundle.js'
  },

  module: {
    preLoaders: [{
      test: /\.ts$/,
      loader: 'tslint',
      query: {
        configFileName: 'tsconfig.json'
      }
    }],
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        query: {
          configFileName: 'tsconfig.json'
        }
      }
    ]
  },

  resolve: {
    root: [ path.join(__dirname, 'src') ],
    extensions: ['', '.ts', '.js']
  },

  devtool: 'source-map'
};