// miniprogram/space/space.js
const app = getApp()
var pageInstance
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAvatarUrl: "",
    myName: "",
    isLogin: false,
    isBinding: true
  },
  getUserInfo: function() {
    wx.getUserInfo({
      success: res => {
        getPartnerId(app.globalData.userId)
        app.globalData.name = res.userInfo.nickName
        app.globalData.avatarUrl = res.userInfo.avatarUrl
        this.setData({
          myAvatarUrl: res.userInfo.avatarUrl,
          myName: res.userInfo.nickName,
          isLogin: true
        })
        updateUserInfo(app.globalData.userId, res.userInfo.nickName, res.userInfo.avatarUrl)

      },
      fail: res => {
        console.log(res)
      }
    })
  },
  invite: function() {
    invitePartner()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    pageInstance = this
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log("onLoad:" + app.globalData.name)
    if (app.globalData.name == null || app.globalData.name == undefined) {
      this.setData({
        isLogin: false
      })
    } else {
      getPartnerId(app.globalData.userId)
      this.setData({
        myName: app.globalData.name,
        myAvatarUrl: app.globalData.avatarUrl,
        isLogin:true
      })
    }
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
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation']) {
          getLocation()
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              getLocation()
            }
          })
        }
      }
    })
    
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

  onShareAppMessage: function(options) {
    console.log(options)
    if (options.from == "button") {
      return {
        title: '加入我们的爱情微步',
        path: '/pages/invite/invite?partnerId=' + app.globalData.userId,
        success: function(options) {
          console.log(options)
        },
        fail: function(options) {
          console.log(options)
        }
      }
    } else {
      return {
        title: '来微步玩呀',
        path: '/pages/time/time?partnerId=' + app.globalData.userId,
        success: function(options) {
          console.log(options)
        },
        fail: function(options) {
          console.log(options)
        }
      }
    }

  }

})

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
      app.globalData.name = name
    },
    fail(res) {
      console.log(res)
    }
  })
}



function getPartnerId(userId) {
  wx.cloud.callFunction({
    name: "getPartnerId",
    data: {
      
      userId: userId
    },
    success(res) {
      console.log("getPartnerId success:" + res)
      console.log("getPartnerId success:" + JSON.stringify(res))
      app.globalData.partnerId = res.result.partnerId
      console.log("app.globalData.parnterId" + app.globalData.partnerId)
      checkBinding()
    },
    fail(res) {
      console.log("getPartnerId error:" + res)
      checkBinding()
    }
  })
}

function checkBinding() {
  var result = true
  if (app.globalData.partnerId == null || app.globalData.partnerId == undefined || app.globalData.partnerId == ""){
      result = false
  }
  pageInstance.setData({
    isBinding: result
  })
  console.log(app.globalData.partnerId)
  console.log(result)
}

function getLocation() {
  wx.getLocation({
    type: 'wgs84',
    success(res) {
      const latitude = res.latitude
      const longitude = res.longitude
      const speed = res.speed
      const accuracy = res.accuracy
      console.log("lat:" + latitude + ",lon:" + longitude)
    }
  })
}