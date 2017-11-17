const config = require('./webpack.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

config.plugins = [
  new UglifyJsPlugin(),
  ...config.plugins
]

module.exports = config
