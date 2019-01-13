// miniprogram/pages/invite/invite.js
const User = require("../../user.js")
const Util = require("../../util.js")
const app = getApp()
const db = wx.cloud.database({
  env: "dong1994"
})
var pageInstance
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partnerId: "",
    partnerName: "",
    partnerImage: "",
    partner: {},
    isAgree: true,
    isWelcome: false
  },

  getInfoAndAgree: function(event) {
    agree()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    pageInstance = this
    console.log(options)
    console.log(options.partnerId)
    console.log("-------log")
    login()
    pageInstance.data.parnterId = options.partnerId
    db.collection("user").doc(options.partnerId).get({
      success(res) {
        console.log(res)
        const userInfo = res.data
        const partner = new User.User(userInfo._id, userInfo.name, userInfo.avatarUrl)
        app.globalData.partner = partner
        console.log("partner:" + JSON.stringify(partner))
        pageInstance.setData({
          // partnerId:userInfo._id,
          // partnerName:userInfo.name,
          // partnerImage:userInfo.avatarUrl
          partner: partner
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {},
  onShareAppMessage: function() {}
})

function agree() {
  // wx.cloud.callFunction({
  //   name: "login",
  //   data: {},
  //   success(res) {
  //     console.log(res)
  //     app.globalData.openid = res.result.openid
  //     const userId = res.result.userid
  //     console.log(res.result.userid)
  //     app.globalData.userId = res.result.userid
  //     binding(pageInstance.data.partnerId,app.globalData.userId)
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.name = res.userInfo.nickName
  //         app.globalData.avatarUrl = res.userInfo.avatarUrl
  //         updateUserInfo(app.globalData.userId, res.userInfo.nickName, res.userInfo.avatarUrl)
  //       },
  //       fail: res => {
  //         console.log(res)
  //       }
  //     })

  //   },
  //   fail(res) {
  //     console.log(res)
  //   }
  // })
  User.login()
    .then(function(res) {
      console.log("then1:" + JSON.stringify(res))
      const currentUser = new User.User(res.result.userid, res.result.userName, res.result.avatarUrl)
      app.globalData.user = currentUser
      console.log("current user:" + JSON.stringify(currentUser))
      if (Util.checkNotNull(app.globalData.user.name)) {

      } else {
        wx.getUserInfo({
          success: res => {
            app.globalData.name = res.userInfo.nickName
            app.globalData.avatarUrl = res.userInfo.avatarUrl
            updateUserInfo(app.globalData.user.id, res.userInfo.nickName, res.userInfo.avatarUrl)
          },
          fail: res => {
            console.log(res)
          }
        })
      }
      return new Promise(function(resolve, reject) {
        console.log("resolve:" + currentUser.id)
        resolve({
          partnerId: app.globalData.partner.id,
          userId: currentUser.id
        })
      })
    })
    .then(function(res) {
      console.log("then2:Pid:" + res.partnerId + ",uid:" + res.userId)
      return User.binding(res.partnerId, res.userId)
    })
    .then(function(res) {
      console.log("then3:" + JSON.stringify(res))
      app.globalData.partner.id = res.result.partnerId
      pageInstance.setData({
        isAgree: true,
        isWelcome: true
      })
    })
    .catch(function(res) {
      console.log("catch:" + JSON.stringify(res))
    })
}

function updateUserInfo(id, name, imageUrl) {
  wx.cloud.callFunction({
    name: "update",
    data: {
      userId: id,
      name: name,
      avatarUrl: imageUrl
    },
    success(res) {
      console.log(res)
    },
    fail(res) {
      console.log(res)
    }
  })
}

function binding(partnerId, userId) {
  wx.cloud.callFunction({
    name: "binding",
    data: {
      partnerId: partnerId,
      userId: userId
    },
    success(res) {
      console.log("binding success:" + JSON.stringify(res))
      app.globalData.partnerId = res.result.partnerId
      pageInstance.setData({
        isAgree: true
      })
    },
    fail(res) {
      console.log("binding error:" + res)
    }
  })
}

function getPartner(userId) {
  wx.cloud.callFunction({
    name: "getPartner",
    data: {
      userId: userId
    },
    success(res) {
      console.log("getPartner success:" + JSON.stringify(res))
      app.globalData.partnerId = res.result.partnerId
      console.log("app.globalData.parnterId" + app.globalData.partnerId)
      app.globalData.partner.id = res.result.partnerId
      if (Util.checkNotNull(app.globalData.partner.id)) {
        pageInstance.setData({
          isWelcome: true
        })
      }
    },
    fail(res) {
      console.log("getPartner error:" + res)
    }
  })
}

function login() {
  User.login()
    .then(function(res) {
      console.log("then1:" + JSON.stringify(res))
      const currentUser = new User.User(res.result.userid, res.result.userName, res.result.avatarUrl)
      currentUser.partnerId = res.result.userData.partnerId
      currentUser.bindingId = res.result.userData.bindingId
      app.globalData.user = currentUser
      if (Util.checkNotNull(currentUser.partnerId)) {
        pageInstance.setData({
          isWelcome: true
        })
      } else {
        pageInstance.setData({
          isAgree: false
        })
      }
    })
    .catch(function(res) {
      console.log("catch:" + JSON.stringify(res))
    })
}