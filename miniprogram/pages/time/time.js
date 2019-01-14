// miniprogram/pages/time.js
const User = require("../../user.js")
const Day = require("../../day.js")

const SIZE = 20
const app = getApp()
var pageInstance
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    days: [],
    skip:0,
    noMore:false
  },

  addEvent: function() {

  },
  onLoad: function(options) {
    pageInstance = this
    loadData(0,20)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    login()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (pageInstance.data.noMore) {
      wx.showToast({
        title: '暂无更多',
        icon: 'none',
        duration: 1000
      })
    } else {
      loadData(pageInstance.data.skip, SIZE)
    }
      
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})

function login() {
  // wx.cloud.callFunction({
  //   name: "login",
  //   data: {},
  //   success(res) {
  //     console.log(res)
  //     app.globalData.openid = res.result.openid
  //     const userId = res.result.userid
  //     console.log(res.result.userid)
  //     app.globalData.userId = res.result.userid
  //     app.globalData.name = res.result.userName
  //     app.globalData.avatarUrl = res.result.avatarUrl
  //   },
  //   fail(res) {
  //     console.log(res)
  //   }
  // })
  User.login()
    .then(function(res) {
      console.log("then1:" + JSON.stringify(res))
      const currentUser = new User.User(res.result.userid, res.result.userName, res.result.avatarUrl)
      currentUser.partnerId = res.result.userData.partnerId
      currentUser.bindingId = res.result.userData.bindingId
      app.globalData.user = currentUser
      console.log("current user:" + JSON.stringify(currentUser))
    })
    .catch(function(res) {
      console.log("catch:" + JSON.stringify(res))
    })
}

// function updateUserInfo(id,name,imageUrl){
//   wx.cloud.callFunction({
//     name: "update",
//     data: {
//       userId: id,
//       name: name,
//       avatarUrl: imageUrl
//     },
//     success(res) {
//       console.log(res)
//     },
//     fail(res) {
//       console.log(res)
//     }
//   })
// }
function loadData(skip,size) {
  Day.getDayList(skip,size)
    .then(function (res) {
      const days = res.result.data
      console.log("data:" + JSON.stringify(res))
      console.log("size" + days.length)
      pageInstance.data.skip  += days.length
      console.log(pageInstance.data.skip)
      pageInstance.setData({
        days:days
      })
    })
    .catch(function (res) {
      console.log("catch:" + JSON.stringify(res))
    })
}