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
  console.log(" userId: " + event.userId)
  if (event.userId == null) {
    return {
      msg:"no user id"
    }
  }
  const info = await db.collection("user").doc(event.userId).get()
  console.log(info)
  console.log(info.data.partnerId)
  await db.collection("binding").where({bindingId:info.data.bindingId}).remove()
  return db.collection("user").doc(event.userId).update({
    data:{
      partnerId:"",
      bindingId:""
    }
  })
}