import css from "./css/index.css";
import less from "./css/hello.less";

let isTrue = true;

document.querySelector("#app").innerHTML = "hello webpack";
console.log("hello")

function async() {
  return new Promise((resolve, reject) => {
    if(isTrue) {
      resolve("jack")
    }else {
      reject("rose")
    }
  })
}

async().then(data => {
  console.log(data)
}).catch(error => {
  console.log(error)
})