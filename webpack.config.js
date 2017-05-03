var path = require('path');

module.exports = {
  entry: "./lib/entry.js",
  output: {
      filename: "./bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '*']
  }
};
