const webpack = require('webpack');
const path = require('path');
const rootPath = path.resolve(__dirname, '../');
const isPro = process.env.NODE_ENV === 'production';


module.exports = {
  entry: {
    vendor: ['jquery', 'moment'],
  },
  output: {
    path: path.join(rootPath, 'dist/site'),
    filename: 'dll_[name].js',
    library: "[name]_[hash]"
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(rootPath, "dist/site", "[name]-manifest.json"),
      name: "[name]_[hash]"
    }),
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require('../dist/site/vendor-manifest.json'),
    }
  ]
};