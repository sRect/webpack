# webpack4.x demo
> webpack4.x demo

## 项目目录结构
![Image text](https://raw.githubusercontent.com/sRect/webpack3.x_demo/webpack4.x/src/images/screen.png)


## 项目配置文件
1. webpack.base.js
```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // 分离css插件
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HappyPack = require('happypack'); // node中打包的时候是单线程去一件一件事情的做，HappyPack可以开启多个子进程去并发执行，子进程处理完后把结果交给主进程

module.exports = {
  entry: {
    index: './src/js/index.js',
    list: './src/js/list.js'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'js/[name].[hash:20].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css', '.json'],
  },
  // webpack4中废弃了webpack.optimize.CommonsChunkPlugin插件,用新的配置项替代,把多次import的文件打包成一个单独的common.js
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         chunks: 'initial',
  //         minChunks: 2,
  //         maxInitialRequests: 5,
  //         minSize: 2,
  //         name: 'common'
  //       }
  //     }
  //   }
  // },
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
          use: "css-loader"
        })
      },
      {
        test: /\.less$ /,
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
            query: {
              limit: 3000,
              name: 'images/[name]_[hash:7].[ext]',
            }
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/index.html',     // html模板的路径地址
      filename: 'html/index.html',                  // 生成的文件名
      title: 'index',                          // 传入的参数
      chunks: ['index'],                       // 需要引入的chunk
      hash: true,                              // 在引入JS里面加入hash值 比如: <script src='index.js?2f373be992fc073e2ef5'></script>
      minify: {
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
        removeAttributeQuotes: true
      }
    }),
    // 需要在plugins里加入插件name: chunk名字 contenthash:8: 根据内容生成hash值取前8位
    new ExtractTextPlugin('css/[name].css'),
    // 打包前自动删除dist目录，保证dist目录下是当前打包后的文件
    new CleanWebpackPlugin([path.join(__dirname, '../dist/*.*')], {
      root: path.join(__dirname, './dist')
    }),
    new HappyPack({
      id: 'babel',
      threads: 4,
      loaders: ['babel-loader']
    })
  ]
}
```
2. webpack.dev.js
```
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base');

const dev = {
  devServer: {
    contentBase: path.join(__dirname, './dist'), // 静态文件地址
    port: 8080,
    host: 'localhost',
    overlay: true, // 如果出错，则在浏览器中显示出错误
    compress: true, // 服务器返回浏览器的时候是否启动gzip压缩
    open: true, // 打包完成自动打开浏览器
    hot: true, // 模块热替换 需要webpack.HotModuleReplacementPlugin插件
    inline: true, // 实时构建
    progress: true //  显示打包进度
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin() // 显示模块的相对路径
  ]

}

module.exports = merge(base, dev);
```
3. webpack.prod.js
```
const path = require('path');
const merge = require('webpack-merge');
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const base = require('./webpack.base');

const prod = {
  plugins: [
    new WebpackParallelUglifyPlugin({
      uglifyJS: {
        mangle: true, //  是否混淆代码
        output: {
          beautify: false, // 代码压缩成一行 true为不压缩 false压缩
          comments: true // 去掉注释
        },
        compress: {
          warnings: false, //  在删除没用到代码时 不输出警告
          drop_console: true, //  删除console
          collapse_vars: true, // 把定义一次的变量，直接使用，取消定义变量
          reduce_vars: true // 合并多次用到的值，定义成变量
        }
      }
    })
  ]

}

module.exports = merge(base, prod);
```
4. webpack.config.js
```
const devModule = require("./webpack-config/webpack.dev")
const prodModule = require("./webpack-config/webpack.prod")

let ENV = process.env.NODE_ENV;     //此处变量可由命令行传入
let finalModule = {};

switch (ENV) {
  case 'dev':
    finalModule = devModule;
    break;
  case 'prod':
    finalModule = prodModule;
    break;
  default:
    break;
}

module.exports = finalModule;
```

5. package.json
```
"scripts": {
  "server": "cross-env NODE_ENV=dev webpack-dev-server --open",
  "dev": "cross-env NODE_ENV=dev webpack",
  "prod": "cross-env NODE_env=prod webpack"
}
```