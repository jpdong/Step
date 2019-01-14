const cloud = require('wx-server-sdk')

cloud.init({
  env: "dong1994"
})
const db = cloud.database()
const cmd = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  console.log("skip:" + event.skip + ",size:" + event.size)
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  return db.collection("day").where({
    openId: openId
  })
  .orderBy("createAt", "desc")
  .skip(event.skip)
  .limit(event.size)
  .get()
}