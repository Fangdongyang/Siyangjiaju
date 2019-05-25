function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + second + "秒";
}

module.exports = {
  formatTime: formatTime
}