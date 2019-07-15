
//app.js
App({
  onLaunch: function () {
    var _this = this;
    _this.getUserInfo();
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  request: function(option){
    let _this = this;
    wx.request({
      url: _this.apiHost + option.url,
      method: option.method,
      data: option.data,
      header: option.header || { 'content-type': 'application/x-www-form-urlencoded' },
      success: function(res){
        option.success(res);
      },
      error: function(){
        option.error();
      }
    })
  },
  globalData: {
    userInfo: null
  },
  apiHost: 'http://106.13.66.152:8686'
})