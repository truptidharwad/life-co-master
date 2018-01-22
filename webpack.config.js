const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const loadModules = fs
  .readdirSync('node_modules')
  .reduce(function(acc, mod) {
    if (mod === '.bin') {
      return acc
    }

    acc[mod] = 'commonjs ' + mod
    return acc
  })

const extractSass = new ExtractTextPlugin({
  filename: 'style.css',
  disable: false,
  allChunks: true,
})

const copyImages = new CopyWebpackPlugin([
  {context: 'client/img', from: '**/*', to: 'img/'},
])

let clientPlugins = [
  extractSass,
  copyImages,
]

module.exports = (env) => {
  if (env === 'production_client') {
    clientPlugins = clientPlugins.concat(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true,
        },
        compress: {
          screw_ie8: true,
        },
        comments: false,
      })
    )
  }
  return [
    {
      target: 'web',
      entry: [
        path.resolve(__dirname, 'client', 'index'),
        path.resolve(__dirname, 'client', 'style', 'main.scss'),
      ],
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
      },
      resolve: {
        extensions: [ '.js', '.jsx', '.json' ],
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: [ 'es2015', 'react' ],
            },
          },
          {
            test: /\.s[ac]ss$/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader!sass-loader',
            }),
          },
        ],
      },
      plugins: clientPlugins,
    },
    {
      target: 'node',
      entry: path.resolve(__dirname, 'server', 'index'),
      output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.js',
      },
      externals: [ loadModules ],
      node: {
        console: false,
        global: false,
        process: false,
        __filename: false,
        __dirname: false,
        Buffer: false,
      },
      resolve: {
        extensions: [ '.js', '.jsx', '.json' ],
        alias: {
          'pg-hstore': path.join(__dirname, '.alias', 'pg-hstore'),
        },
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: [ 'es2015', 'react', 'stage-0' ],
            },
          },
          {
            test: /\.s[ac]ss$/,
            loader: 'ignore-loader',
          },
        ],
      },
      plugins: [
       new webpack.DefinePlugin({ "global.GENTLY": false })
      ],
    },
  ]
}
