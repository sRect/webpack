// require("../css/index")
import $ from 'jquery'
import moment from 'moment'
import "../css/index"
import Identicon from 'identicon.js';
import createHash from 'create-hash';


if (module.hot) {
  // 实现热更新
  module.hot.accept();
}

const async = (flag) => {
  return new Promise((resolve, reject) => {
    if (flag) {
      resolve("success")
    } else {
      reject("error")
    }
  })
}

async(true).then(data => {
  console.log(data)
}).catch(error => {
  console.log(error)
})

$("#test").css({ "color": 'red' }).html(moment().format('YYYY-MM-DD HH:mm:ss'))

// 头像随机生成

let hash = createHash('md5');
hash.update('sRect');
let result = hash.digest('hex');

let options = {
  foreground: [0, 152, 255, 255],               // rgba black
  background: [240, 240, 240, 255],         // rgba white
  margin: 0.1,                              // 20% margin
  size: 200,                                // 420px square
  format: 'png'                             // use SVG instead of PNG
};

let imgData = new Identicon(result, options).toString();
let imgUrl = 'data:image/png;base64,' + imgData; // 这就是头像的base64码
$("#avatar")[0].src = imgUrl;
