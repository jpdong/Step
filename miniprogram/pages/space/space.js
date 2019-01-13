// miniprogram/space/space.js
const Util = require("../../util.js")
const User = require("../../user.js")

const app = getApp()
const globalData = app.globalData
var pageInstance
Page({
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
    percent: 0,
    user: {
      name:"",
      avatarUrl:""
    },
    partner: {
      name: "",
      avatarUrl: ""
    }
  },
  getUserInfo: function() {
    wx.getUserInfo({
      success: res => {
        getPartner(app.globalData.user.id)
        app.globalData.user.name = res.userInfo.nickName
        app.globalData.user.avatarUrl = res.userInfo.avatarUrl
        this.setData({
          user: app.globalData.user,
          isLogin: true
        })
        updateUserInfo(app.globalData.user.id, res.userInfo.nickName, res.userInfo.avatarUrl)
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  invite: function() {
    invitePartner()
  },

  unbind: function() {
    User.unbind(app.globalData.user.id)
  },

  onLoad: function(options) {
    pageInstance = this
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log("onLoad:" + app.globalData.user.name)
    if (Util.checkNotNull(app.globalData.user.name)) {
      getPartner(app.globalData.user.id)
      this.setData({
        user:app.globalData.user,
        isLogin: true
      })
    } else {
      this.setData({
        isLogin: false
      })
    }
  },

  onReady: function() {},

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
        path: '/pages/invite/invite?partnerId=' + app.globalData.user.id,
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
      console.log("getPartner success:" + JSON.stringify(res))
      app.globalData.partnerId = res.result.partnerId
      console.log("app.globalData.parnterId" + app.globalData.partnerId)
      globalData.partner.id = res.result.partnerId
      checkBinding(res)
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
    fail(res) {
      console.log("getPartner error:" + res)
    }
  })
}

function checkBinding(res) {
  console.log("checkBinding-----------------------------")
  var result = true
  if (Util.checkNotNull(res.result.partnerId)) {
    console.log("checkBinding:partnerId" + res.result.partnerId)
    const partner = new User.User(res.result.partnerId, res.result.partner.name, res.result.partner.avatarUrl)
    partner.location = JSON.parse(res.result.partner.location)
    partner.bindingId = res.result.partner.bindingId
    app.globalData.partner = partner
    pageInstance.data.partner = partner
    if (Util.checkNotNull(partner.location)) {
      console.log("partner.location:" + JSON.stringify(partner.location))
      var partnerMarker = pageInstance.data.markers[1]
      console.log(partner.location.latitude)
      console.log(partner.location.longitude)
      console.log(partnerMarker)
      partnerMarker.latitude = partner.location.latitude
      partnerMarker.longitude = partner.location.longitude
      partnerMarker.id = 1
      partnerMarker.iconPath = partner.avatarUrl
      pageInstance.setData({
        markers: [pageInstance.data.markers[0], partnerMarker]
      })
      const myLocation = pageInstance.data.markers[0]
      const distance = Util.getDistance(myLocation.latitude, myLocation.longitude, partner.location.latitude, partner.location.longitude)
      pageInstance.setData({
        distance: distance
      })
      uploadDistance(distance)
    }
  } else {
    result = false

  }
  pageInstance.setData({
    isBinding: result
  })
  console.log(app.globalData.partner.id)
  console.log(result)
}

function getLocation() {
  console.log("getLocation---------------------")
  wx.getLocation({
    type: 'wgs84',
    altitude: true,
    success(res) {
      const lati = res.latitude
      const longi = res.longitude
      console.log("lat:" + lati + ",lon:" + longi)
      var myMarker = pageInstance.data.markers[0]
      myMarker.latitude = lati
      myMarker.longitude = longi
      myMarker.iconPath = pageInstance.data.user.avatarUrl
      pageInstance.setData({
        markers: [myMarker, pageInstance.data.markers[1]]
      })
      console.log("check userId:" + Util.checkNotNull(app.globalData.userId))
      if (Util.checkNotNull(app.globalData.user.id)) {
        const location = pageInstance.data.user.location
        uploadLocation(app.globalData.user.id, lati, longi)
        console.log("partnerId" + app.globalData.user.partnerId)
        if (Util.checkNotNull(app.globalData.user.partnerId)){
          console.log("partnerId:" + app.globalData.user.partnerId)
          const partner = pageInstance.data.partner
          var partnerMarker = pageInstance.data.markers[1]
          partnerMarker.latitude = partner.location.latitude
          partnerMarker.longitude = partner.location.longitude
          partnerMarker.id = 1
          partnerMarker.iconPath = partner.avatarUrl
          console.log("partnerMarker:" + partnerMarker)
          pageInstance.setData({
            markers: [pageInstance.data.markers[0], partnerMarker]
          })
          const distance = Util.getDistance(lati, longi, partnerMarker.latitude, partnerMarker.longitude)
          pageInstance.setData({
            distance: distance
          })
          uploadDistance(distance)
        }
        
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
  if (Util.checkNotNull(globalData.partner.bindingId)) {
    wx.cloud.callFunction({
      name: "uploadDistance",
      data: {
        bindingId: globalData.partner.bindingId,
        distance: distance
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