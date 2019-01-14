class Day {
  constructor(title,time) {
    this.title = title;
    this.time = time;
  }
}

function daysFromNow(date) {
  var current = new Date().getTime()
  var start = new Date(date.replace(/-/g, "/")).getTime();
  var daysMilis = current - start;
  var days = parseInt(daysMilis / (1000 * 60 * 60 * 24));
  return days
}

function save(day) {
  const time = new Date(day.date.replace(/-/g, "/")).getTime();
  return wx.cloud.callFunction({
    name: "addDay",
    data: {
      title: day.title,
      time:time
    }
  })
}

function getDayList(skip,size) {
  return wx.cloud.callFunction({
    name: "getDayList",
    data:{
      skip:skip,
      size:size
    }
  })
}

module.exports = {
  Day:Day,
  daysFromNow: daysFromNow,
  getDayList: getDayList,
  save:save
}