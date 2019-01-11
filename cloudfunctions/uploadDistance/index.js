const cloud = require('wx-server-sdk')

cloud.init({
  env: "dong1994"
})

// 云函数入口函数
exports.main = async(event, context) => {
  console.log("event:" + JSON.stringify(event))
  console.log("bindingId:" + event.bindingId)
  console.log("distance:" + event.distance)
  const db = cloud.database()
  const result = await db.collection("binding").where({
    bindingId: event.bindingId
  }).update({
    data: {
      distance: event.distance
    }
  })
  const count = await db.collection("binding").count()
  console.log("count:" + count.total)
  var find = false
  var rank = 0
  for (var i = 0; i < count.total;) {
    const temp = await db.collection("binding").orderBy('distance', 'asc').limit(100).get()
    console.log("temp:" + i + ":" + JSON.stringify(temp.data))
    console.log("temp:length:" + temp.data.length)
    for (var j = 0; j < temp.data.length; j++) {
      console.log("1 for:" + (temp.data)[j].bindingId)
      if (event.bindingId == (temp.data)[j].bindingId) {
        console.log("in for:" + (temp.data)[j].bindingId)
        find = true
        rank = i + j
        break
      }
    }
    if (find) {
      break
    } else {
      i += temp.data.length
      rank = i
    }
  }
  console.log("rank:" + rank)
  var percent = (count.total - rank) * 100 / count.total
  await db.collection("binding").where({
    bindingId: event.bindingId
  }).update({
    data: {
      ranking: percent
    }
  })
  return {
    percent: percent
  }
}