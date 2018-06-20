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