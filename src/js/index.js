// require("../css/index")
import $ from 'jquery'
import moment from 'moment'
import "../css/index"


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