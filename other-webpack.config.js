const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');

module.exports = {
  module : {
  //   rules: [
  //     {
  //       test   : /\.scss$/,
  //       loader : 'postcss-loader',
  //       options: {
  //         ident  : 'postcss',
  //         plugins: () => [
  //           require('postcss-short')(),
  //         ]
  //       }
  //     }
  //   ]
  },
  plugins: [
    new WebpackNotifierPlugin({
      alwaysNotify: true,
      title       : 'App Name',
      contentImage: path.join(__dirname, 'image.png')
    }),
  ],

  resolve: {
    extensions: ['.js'],
    alias: {
      fs: path.resolve(__dirname, 'src/mocks/fs.mock.js'),
      child_process: path.resolve(
        __dirname,
        'src/mocks/child_process.mock.js'
      ),
      'https-proxy-agent': path.resolve(
        __dirname,
        'src/mocks/https-proxy-agent.mock.js',
      ),
      crypto: path.resolve(
        __dirname,
        'node_modules/crypto-browserify/index.js'
      ),
      Buffer: path.resolve(
        __dirname,
        'node_modules/buffer/index.js'
      ),
      stream: path.resolve(
        __dirname,
        'node_modules/stream-browserify/index.js'
      )
      // inherits: path.resolve(
      //   __dirname,
      //   'src/mocks/inherits.mock.js'
      //   )
    },
  },

};
