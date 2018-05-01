const path = require('path')
const glob = require('glob')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 压缩js
const HtmlPlugin = require('html-webpack-plugin') // 打包html
const ExtractTextPlugin = require('extract-text-webpack-plugin') //分离css
const PurifyCssPlugin = require('purifycss-webpack')

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
        use: ExtractTextPlugin.extract({ // 分离css(页面主要是css,而js很少)
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      },
      {
        test: /\.less$/,
        // use: [
        //   {
        //     loader: 'style-loader'
        //   },
        //   {
        //     loader: 'css-loader'
        //   },
        //   {
        //     loader: 'less-loader'
        //   }
        // ]
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'less-loader'
            }
          ]
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
    new ExtractTextPlugin('css/index.css'),
    new PurifyCssPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '192.168.1.105',
    compress: true,
    port: 8080
  }
}