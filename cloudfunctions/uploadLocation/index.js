const cloud = require('wx-server-sdk')

cloud.init({
  env: "dong1994"
})

// 云函数入口函数
exports.main = async(event, context) => {
  console.log("event:" + JSON.stringify(event))
  console.log("context:" + JSON.stringify(context))
  console.log("userId:" + event.userId)
  const db = cloud.database()
  //const location = {latitude:event.latitude,longitude:event.longitude}
  console.log(event.location)
  const result = db.collection("user").doc(event.userId).update({
    data: {
      location: JSON.stringify(event.location)
    }
  })
  return result
}