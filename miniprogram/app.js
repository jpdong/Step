//app.js
App({
  onLaunch: function () {
    const value = wx.getLaunchOptionsSync()
    console.log(value)
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      name:"",
      avatarUrl:"",
      userId:"",
      location:{},
      partnerId:"",
      bindingId:"",
      user:{},
      partner:{
        id:"",
        name:"",
        avatarUrl:"",
        location:{}
      }
    }
  }
})
