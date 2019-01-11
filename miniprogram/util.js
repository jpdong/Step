const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function toast(message) {
  wx.showToast({
    title: message,
    image:"../../images/image_wtf.png",
    duration:3000
  })
}

function dialog(message) {
  wx.showModal({
    title: 'log',
    content: '' + message,
  });
}

function checkNotNull(object) {
  if (object == null || object == undefined){
    return false
  } else {
    return true
  }
}

function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(3);
}

module.exports = {
  formatTime: formatTime,
  toast:toast,
  dialog:dialog,
  checkNotNull: checkNotNull,
  getDistance: getDistance
}
