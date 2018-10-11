var path = require('path')
var webpack = require('webpack')
var packagejson = require('./package.json')
var HtmlWebpackPlugin = require('html-webpack-plugin')
//var ExtractTextPlugin = require("extract-text-webpack-plugin");

let HTML_PATH = __dirname+ '/public';
let tpl = __dirname+'/index.html'
module.exports = {
  entry: {
    vendor: Object.keys(packagejson.dependencies),//分离框架
    app: './src/main.js' },
  output: {
    filename: "bundle.js?[hash]",
    path: path.resolve(__dirname, 'public/build'), //打包后的文件存放的地方
    publicPath: "/build/", //引入HTML文件中的路径
  },
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    overlay: true,
  },
  performance: {
    hints: false
  },
  //devtool: '#eval-source-map'
}

let plugins_arr = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({ name: ['vendor', 'runtime'], filename: '[name].bundle.js?[hash]' }),
  new HtmlWebpackPlugin({
    filename: HTML_PATH + '/index.html',
    template: tpl,
    inject: 'body',
    minify: {
      removeComments: true, //去注释
      collapseWhitespace: true, //压缩空格
    }
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true
  })
]
// if (process.env.NODE_ENV === 'production') {
//module.exports.devtool = '#source-map'
// http://vue-loader.vuejs.org/en/workflow/production.html
module.exports.plugins = (module.exports.plugins || []).concat(plugins_arr)
// }
