function login() {
  return wx.cloud.callFunction({
    name: "login"
    // data: {},
    // success(res) {
    //   console.log(res)
    //   app.globalData.openid = res.result.openid
    //   const userId = res.result.userid
    //   console.log(res.result.userid)
    //   app.globalData.userId = res.result.userid
    //   app.globalData.name = res.result.userName
    //   app.globalData.avatarUrl = res.result.avatarUrl
    // },
    // fail(res) {
    //   console.log(res)
    // }
  })
}

function updateUserInfo(id, name, imageUrl) {
  return wx.cloud.callFunction({
    name: "update",
    data: {
      userId: id,
      name: name,
      avatarUrl: imageUrl
    }
  })
}

function getPartner(userId) {
  return wx.cloud.callFunction({
    name: "getPartner",
    data: {
      userId: userId
    },
    // success(res) {
    //   console.log("getPartner success:" + res)
    //   console.log("getPartner success:" + JSON.stringify(res))
    //   app.globalData.partnerId = res.result.partnerId
    //   console.log("app.globalData.parnterId" + app.globalData.partnerId)
    //   globalData.partner.id = res.result.partnerId
    //   checkBinding(res)
    // },
    // fail(res) {
    //   console.log("getPartner error:" + res)
    //   checkBinding()
    // }
  })
}

function binding(partnerId, userId) {
  return wx.cloud.callFunction({
    name: "binding",
    data: {
      partnerId: partnerId,
      userId: userId
    }
    // success(res) {
    //   console.log("binding success:" + JSON.stringify(res))
    //   app.globalData.partnerId = res.result.partnerId
    //   pageInstance.setData({
    //     isAgree: true
    //   })
    // },
    // fail(res) {
    //   console.log("binding error:" + res)
    // }
  })
}

function unbind(userId) {
  return wx.cloud.callFunction({
    name: "unbind",
    data: {
      userId: userId
    }
  })
}

class User{
  constructor(id,name,avatarUrl) {
    this.id = id;
    this.name = name;
    this.avatarUrl= avatarUrl;
  }

  // constructor(id, name, avatarUrl,location,bindingId) {
  //   this.id = id;
  //   this.name = name;
  //   this.avatarUrl = avatarUrl;
  //   this.location = location;
  //   this.bindingId = bindingId
  // }
}

class Location{
  constructor(latitude,longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

module.exports = {
  login:login,
  updateUserInfo: updateUserInfo,
  getPartner: getPartner,
  binding: binding,
  unbind: unbind,
  User:User,
  Location:Location
}