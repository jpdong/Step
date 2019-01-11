// miniprogram/pages/invite/invite.js
const app = getApp()
const db = wx.cloud.database({
  env:"dong1994"
})
var pageInstance
Page({

  /**
   * 页面的初始数据
   */
  data: {
    partnerId:"",
    partnerName:"",
    partnerImage:"",
    isAgree:false
  },

  getInfoAndAgree:function(event) {
    login()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageInstance = this
    console.log(options)
    console.log(options.partnerId)
    console.log("-------log")
    pageInstance.data.parnterId = options.partnerId
    db.collection("user").doc(options.partnerId).get({
      success(res) {
        console.log(res)
        const userInfo = res.data
        pageInstance.setData({
            partnerId:userInfo._id,
            partnerName:userInfo.name,
            partnerImage:userInfo.avatarUrl
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

  
})

function login() {
  wx.cloud.callFunction({
    name: "login",
    data: {},
    success(res) {
      console.log(res)
      app.globalData.openid = res.result.openid
      const userId = res.result.userid
      console.log(res.result.userid)
      app.globalData.userId = res.result.userid
      binding(pageInstance.data.partnerId,app.globalData.userId)
      wx.getUserInfo({
        success: res => {
          app.globalData.name = res.userInfo.nickName
          app.globalData.avatarUrl = res.userInfo.avatarUrl
          updateUserInfo(app.globalData.userId, res.userInfo.nickName, res.userInfo.avatarUrl)
        },
        fail: res => {
          console.log(res)
        }
      })

    },
    fail(res) {
      console.log(res)
    }
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

function binding(partnerId,userId) {
  wx.cloud.callFunction({
    name: "binding",
    data: {
      partnerId:partnerId,
      userId:userId
    },
    success(res) {
      console.log("binding success:" + JSON.stringify(res))
      app.globalData.partnerId = res.result.partnerId
      pageInstance.setData({
        isAgree:true
      })
    },
    fail(res) {
      console.log("binding error:" + res)
    }
  })
}