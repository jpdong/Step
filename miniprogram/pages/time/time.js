// miniprogram/pages/time.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.callFunction({
      name: "test",
      data: {},
      success(res) {
        console.log(res)
      }
    })
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

function login(){
  wx.cloud.callFunction({
    name: "login",
    data: {},
    success(res) {
      console.log(res)
      app.globalData.openid = res.result.openid
      const userId = res.result.userid
      console.log(res.result.userid)
      app.globalData.userId = res.result.userid
      app.globalData.name = res.result.userName
    },
    fail(res) {
      console.log(res)
    }
  })
}

function updateUserInfo(id,name,imageUrl){
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