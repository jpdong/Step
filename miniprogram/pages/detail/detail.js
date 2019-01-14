// miniprogram/pages/detail/detail.js
const Day = require("../../day.js")
const Util = require("../../util.js")
const app = getApp()

var pageInstance
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: {}
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const days = Day.daysFromNow(e.detail.value)
    var currentDay = pageInstance.data.day
    currentDay.days = days
    currentDay.date = e.detail.value
    this.setData({
      day: currentDay
    })
  },
  save: function(event) {
    console.log("save" + event)
    save()
  },
  inputTitle: function(event) {
    console.log("input title:" + event.detail.value)
    var currentDay = pageInstance.data.day
    currentDay.title = event.detail.value.trim()
    this.setData({
      day: currentDay
    })
  },
  onLoad: function(options) {
    pageInstance = this
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

function save() {
  const day = pageInstance.data.day
  console.log("data:" + day.date + ",title:" + day.title)
  if (Util.checkNotNull(day.date) && day.date != "" && day.title != "" && Util.checkNotNull(day.title)) {
    Day.save(day)
  } else {
    wx.showToast({
      title: '请完整输入',
      icon: 'none',
      duration: 1000
    })
  }
}