const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    popup: './src/popup/index.js',
    background: './src/background.js'
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].bundle.js'
  },
  resolve: {
    extensions: [ '.js', '.elm' ]
  },
  module: {
    rules: [
      {
        test: /\.elm$/,
        use: 'elm-webpack-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [ 'css-loader' ]
        })
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
}
