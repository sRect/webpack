const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const base = require('./webpack.base');

const prod = {
  // webpack4中废弃了webpack.optimize.CommonsChunkPlugin插件,用新的配置项替代,把多次import的文件打包成一个单独的common.js
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {  // 抽离自己写的公共代码
          chunks: "initial",
          name: "common", // 打包后的文件名，任意命名
          minChunks: 2,//最小引用2次
          minSize: 0 // 只要超出0字节就生成一个新包
        },
        vendor: {  // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 2,
          name: 'vendor', // 打包后的文件名，任意命名
          priority: 10 // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        }
      }
    }
  },
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