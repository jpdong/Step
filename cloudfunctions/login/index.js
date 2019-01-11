// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: "dong1994"
})



/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async(event, context) => {
  console.log(event)
  console.log(context)
  console.log("----------log1----------")

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()
  const database = cloud.database()
  const count = await database.collection("user").where({
      openid: wxContext.OPENID
    })
    .count()
  console.log("count:" + count.total)
  if (count.total <= 0) {
    await database.collection("user").add({
      data: {
        name: null,
        avatarUrl: null,
        openid: wxContext.OPENID,
        unionid: wxContext.UNIONID,
        location: null,
        partnerId:null,
        bindingId:null
      }
    })
  }
  const userId = await database.collection("user").where({
    openid: wxContext.OPENID
  }).get()
  console.log(userId)
  console.log((userId.data)[0]._id)

  // .then(function(res) {
  //   console.log(res)
  //   return new Promise(function(resolve, reject) {
  //     console.log("count:" + res.total)
  //     if (res.total <= 0) {
  //       resolve()
  //     } else {
  //       reject()
  //     }
  //   })
  // })
  // .then(function(res) {
  //   await database.collection("user").add({
  //     data: {
  //       name: null,
  //       avatarUrl: null,
  //       openid: wxContext.OPENID,
  //       unionid: wxContext.UNIONID,
  //       location: null
  //     }
  //   })
  //   console.log(res)
  //   // const userId = await database.collection("user").where({
  //   //   openid: wxContext.OPENID
  //   // }).get()
  //   // console.log(userId)
  //   // return {
  //   //   event,
  //   //   openid: wxContext.OPENID,
  //   //   appid: wxContext.APPID,
  //   //   unionid: wxContext.UNIONID,
  //   // }
  // })
  // .catch(function(res) {
  //   console.log(res)
  //   // const userId = await database.collection("user").where({
  //   //   openid: wxContext.OPENID
  //   // }).get()
  //   // console.log(userId)

  // })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    userid: (userId.data)[0]._id,
    userName: (userId.data)[0].name,
    avatarUrl: (userId.data)[0].avatarUrl,
    userData: userId.data
  }

}