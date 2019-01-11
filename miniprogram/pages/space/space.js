// miniprogram/space/space.js
const Util = require("../../util.js")
const app = getApp()
const globalData = app.globalData
var pageInstance
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAvatarUrl: "",
    myName: "",
    isLogin: false,
    isBinding: true,
    markers: [{
      id: 0,
      width: 50,
      height: 50,
      callout: {
        borderRadius: 25
      }
    }, {
      id: 1,
      width: 50,
      height: 50,
      callout: {
        borderRadius: 25
      }
    }],
    myLocation: {},
    partnerLocation: {},
    distance: 0,
    percent:0
  },
  getUserInfo: function() {
    wx.getUserInfo({
      success: res => {
        getPartner(app.globalData.userId)
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
      getPartner(app.globalData.userId)
      this.setData({
        myName: app.globalData.name,
        myAvatarUrl: app.globalData.avatarUrl,
        isLogin: true
      })
    }
  },

  onReady: function() {
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

  onShow: function() {

  },

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function(options) {
    console.log(options)
    if (options.from == "button") {
      return {
        title: '加入我们的爱情纪念日',
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
        title: '来纪念日玩呀',
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



function getPartner(userId) {
  wx.cloud.callFunction({
    name: "getPartner",
    data: {
      userId: userId
    },
    success(res) {
      console.log("getPartner success:" + res)
      console.log("getPartner success:" + JSON.stringify(res))
      app.globalData.partnerId = res.result.partnerId
      console.log("app.globalData.parnterId" + app.globalData.partnerId)
      globalData.partner.id = res.result.partnerId
      checkBinding(res)
    },
    fail(res) {
      console.log("getPartner error:" + res)
      checkBinding()
    }
  })
}

function checkBinding(res) {
  var result = true
  if (app.globalData.partnerId == null || app.globalData.partnerId == undefined || app.globalData.partnerId == "") {
    result = false
  } else {
    globalData.partner.name = res.result.partner.name
    globalData.partner.avatarUrl = res.result.partner.avatarUrl
    globalData.bindingId = res.result.partner.bindingId
    globalData.partner.location = JSON.parse(res.result.partner.location)
    if (Util.checkNotNull(globalData.partner.location)) {
      var partnerLocation = pageInstance.data.markers[1]
      partnerLocation.latitude = globalData.partner.location.latitude
      partnerLocation.longitude = globalData.partner.location.longitude
      partnerLocation.iconPath = globalData.partner.avatarUrl
      pageInstance.data.partnerLocation = partnerLocation
      pageInstance.setData({
        markers: [pageInstance.data.myLocation, partnerLocation]
      })
      const myLocation = pageInstance.data.myLocation
      const distance = Util.getDistance(myLocation.latitude, myLocation.longitude, partnerLocation.latitude, partnerLocation.longitude)
      pageInstance.setData({
        distance: distance
      })
      uploadDistance(distance)
    }
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
    altitude: true,
    success(res) {
      const latitude = res.latitude
      const longitude = res.longitude
      console.log("lat:" + latitude + ",lon:" + longitude)
      var myLocation = pageInstance.data.markers[0]
      pageInstance.data.partnerLocation = pageInstance.data.markers[1]
      myLocation.latitude = latitude
      myLocation.longitude = longitude
      myLocation.iconPath = pageInstance.data.myAvatarUrl
      pageInstance.data.myLocation = myLocation
      pageInstance.setData({
        markers: [myLocation, pageInstance.data.partnerLocation]
      })
      console.log("check userId:" + Util.checkNotNull(app.globalData.userId))
      if (Util.checkNotNull(app.globalData.userId)) {
        uploadLocation(app.globalData.userId, latitude, longitude)
        const partnerLocation = pageInstance.data.partnerLocation
        const distance = Util.getDistance(myLocation.latitude, myLocation.longitude, partnerLocation.latitude, partnerLocation.longitude)
        pageInstance.setData({
          distance: distance
        })
        uploadDistance(distance)
      }
    }
  })
}

function uploadLocation(userId, lat, longit) {
  wx.cloud.callFunction({
    name: "uploadLocation",
    data: {
      userId: userId,
      location: {
        latitude: lat,
        longitude: longit
      }
    },
    success(res) {
      console.log("uploadLocation success:" + res)
      console.log("uploadLocation success:" + JSON.stringify(res))
    },
    fail(res) {
      console.log("uploadLocation error:" + res)

    }
  })
}

function uploadDistance(distance) {
  if (Util.checkNotNull(globalData.bindingId)) {
    wx.cloud.callFunction({
      name: "uploadDistance",
      data: {
        bindingId: globalData.bindingId,
        distance:distance
      },
      success(res) {
        console.log("uploadDistance success:" + res)
        console.log("uploadDistance success:" + JSON.stringify(res))
        pageInstance.setData({
          percent: Math.round(res.result.percent)
        })
      },
      fail(res) {
        console.log("uploadDistance error:" + res)

      }
    })
  }
}