require("../css/list")
import moment from 'moment'

console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
document.getElementById("time").innerHTML = moment().format('YYYY-MM-DD HH:mm:ss');