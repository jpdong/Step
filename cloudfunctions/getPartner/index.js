// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dong1994"
})
const db = cloud.database()
const cmd = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("userId:" + event.userId)
  const userInfo = await db.collection("user").doc(event.userId).get()
  console.log(userInfo)
  console.log(userInfo.data.partnerId)
  var partnerData
  if (userInfo.data.partnerId != null && userInfo.data.partnerId != undefined) {
    const partner = await db.collection("user").doc(userInfo.data.partnerId).get()
    partnerData = partner.data
  }
  return {
    partnerId: userInfo.data.partnerId,
    partner:partnerData
  }
}