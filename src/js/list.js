require("../css/list")
import moment from 'moment'
import $ from 'jquery'

console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
document.getElementById("time").innerHTML = moment().format('YYYY-MM-DD HH:mm:ss');


$("body").css({
  "background-color": "red"
})