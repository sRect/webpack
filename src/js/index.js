// require("../css/index")
import "../css/index"

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