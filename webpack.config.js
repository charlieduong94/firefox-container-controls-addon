const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    'popup/main': './src/popup/main',
    background: './src/background'
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js'
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
    // both outputs are relatiive to dist
    new ExtractTextPlugin('./popup/styles.css'),
    new CopyPlugin([
      {
        from: 'src/popup/index.html',
        to: './popup/index.html'
      }
    ])
  ]
}
