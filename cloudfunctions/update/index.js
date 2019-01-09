// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dong1994"
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event:" + JSON.stringify(event))
  console.log("context:" + JSON.stringify(context))
  console.log("name:"+ event.name)
  const db = cloud.database()
  const result = db.collection("user").doc(event.userId).update({
    data: {
      name: event.name,
      avatarUrl: event.avatarUrl
    }
  })
  return result
}