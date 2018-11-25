const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 分离css插件
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HappyPack = require('happypack'); // node中打包的时候是单线程去一件一件事情的做，HappyPack可以开启多个子进程去并发执行，子进程处理完后把结果交给主进程

module.exports = {
  entry: {
    index: './src/js/index.js',
    list: './src/js/list.js',
    pmMonitor: './src/js/pmMonitor.js'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'js/[name].[hash:20].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=babel'
      },
      {
        test: /\.css$/,
        // loader: ['style-loader', 'css-loader']
        // use: ['style-loader', 'css-loader']
        use: ExtractTextPlugin.extract({ // 分离css(页面主要是css,js很少)
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
          ],
          publicPath: '../'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        }),
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|ttf|eot|woff(2)?)(\?[=a-z0-9]+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            outputPath: 'images/',
            name: '[name]_[hash:7].[ext]'
          }
        }]
      },
      {
        test: /\.(htm|html)$/i,
        use: ['html-withimg-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',     // html模板的路径地址
      filename: 'html/index.html',                  // 生成的文件名
      title: 'index',                          // 传入的参数
      chunks: ['index', 'pmMonitor'],                       // 需要引入的chunk
      hash: true,                              // 在引入JS里面加入hash值 比如: <script src='index.js?2f373be992fc073e2ef5'></script>
      minify: {
        collapseWhitespace: true, // 折叠空白区域 也就是压缩代码
        removeAttributeQuotes: true            // 去掉引号，减少文件大小
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/html/list.html',
      filename: 'html/list.html',
      title: 'list',
      chunks: ['list'],
      hash: true,
      minify: {
        collapseWhitespace: true, // 折叠空白区域 也就是压缩代码
        removeAttributeQuotes: true
      }
    }),
    // 需要在plugins里加入插件name: chunk名字 contenthash:8: 根据内容生成hash值取前8位
    new ExtractTextPlugin('css/[name].[hash:20].css'),
    // 打包前自动删除dist目录，保证dist目录下是当前打包后的文件
    new CleanWebpackPlugin([path.join(__dirname, '../dist')], {
      root: path.join(__dirname, '../')
    }),
    new HappyPack({
      id: 'babel',
      threads: 4,
      loaders: ['babel-loader']
    })
  ]
}