module.exports = {
  mode: 'development',
  entry: './src/proxyTrackIndex.js',
  output: {
    filename: './bundle.js'
  },
  module: {
    rules: [
      {
        // test: /\.js$/,
        // use: [ '' ]
      },
    ]
  }
};
