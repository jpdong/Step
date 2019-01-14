const cloud = require('wx-server-sdk')

cloud.init({
  env: "dong1994"
})
const db = cloud.database()
const cmd = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event day title:" + event.title)
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  return db.collection("day").add({
    data:{
      openId:openId,
      title:event.title,
      time:event.time,
      createAt:new Date().getTime()
    }
  })
}