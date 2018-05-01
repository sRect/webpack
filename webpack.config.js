const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 压缩js
const HtmlPlugin = require('html-webpack-plugin') // 打包html
const ExtractTextPlugin = require('extract-text-webpack-plugin') //分离css

const website = {
  publicPath: "http://192.168.1.105:8080/"
}

module.exports = {
  entry: {
    entry: './src/entry.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: website.publicPath
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // loader: ['style-loader', 'css-loader']
        // use: ['style-loader', 'css-loader']
        // use: [
        //   {
        //     loader: 'style-loader'
        //   },
        //   {
        //     loader: 'css-loader'
        //   }
        // ]
        use: ExtractTextPlugin.extract({ // 分离css(页面主要是css,js很少)
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(png|jpg|gif)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5000,
              outputPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/i,
        use:[ 'html-withimg-loader'] 
    }
    ]
  },
  plugins: [
    new UglifyJsPlugin(),
    new HtmlPlugin({
      minify: {
        removeAttributeQuotes: true
      },
      hash: true,
      template: './src/index.html'
    }),
    new ExtractTextPlugin('css/index.css')
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '192.168.1.105',
    compress: true,
    port: 8080
  }
}