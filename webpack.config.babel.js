import webpack from 'webpack';

export default {
  output: {
    filename: 'main.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader']
    }]
  }
}
