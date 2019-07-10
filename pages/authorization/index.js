// pages/authorization/index.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let user = wx.getStorageSync('user') || {};
    wx.showLoading({
      title: '授权登录中',
    })
    if (!user.openid){
      wx.login({
        success: function(res){
          if(res.code){
            wx.getUserInfo({
              success: function (res) {
                wx.setStorageSync('userInfo', res.userInfo);
              }
            })
            wx.request({
              url: app.apiHost + '/code2Session',
              data: {
                js_code: res.code
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              // header: {}, // 设置请求的 header  
              success: function (res) {
                wx.hideLoading()
                let data = res.data;
                if(data.error === 0){
                  wx.setStorageSync('user', data.result);
                  _this.jumpIndex();
                }
              }
            })
          }
        }
      })
    }else{
      _this.jumpIndex();
    }

    // // 查看是否授权
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           wx.setStorageSync('userInfo', res.userInfo);
    //         }
    //       })
    //     }
    //   }
    // })
  },
  jumpIndex: function(){
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
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