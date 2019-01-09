// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "dong1994"
})
const db = cloud.database()
const cmd = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event.partnerId + " and " + event.userId)
  if (event.partnerId == null || event.userId == null) {
    return
  }
  const info = await db.collection("user").doc(event.userId).get()
  console.log(info)
  console.log(info.data.partnerId)
  console.log("----error")
  if (info.data.partnerId == null || info.data.partnerId == undefined) {
    console.log("no binding yet")
    const bindingId = event.userId + "_" + event.partnerId
    await db.collection("binding").add({
      data: {
        bindingId: bindingId,
        distance:null,
        ranking:null
      }
    })
    await db.collection("user").doc(event.userId).update({
      data: {
        bindingId: bindingId,
        partnerId: event.partnerId
      }
    })
    console.log("first finish")
    await db.collection("user").doc(event.partnerId).update({
      data: {
        bindingId: bindingId,
        partnerId: event.userId
      }
    })
  }　
  console.log("----error")

  const userInfo = await db.collection("user").doc(event.userId).get()
  console.log(userInfo)
  console.log(userInfo.data.partnerId)
  return {
    partnerId: userInfo.data.partnerId
  }
}