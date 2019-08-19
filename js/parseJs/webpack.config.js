module.exports = {
  mode: 'development',
  entry: './src/index.js',
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
