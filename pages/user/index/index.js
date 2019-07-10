// pages/user/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      head: '/assets/images/account.png'
    },
    modelArr: [{
      name: '我的订单',
      iconClass: 'icondd',
      path: '/pages/user/order/index'
    },{
      name: '收货地址',
      iconClass: 'iconshouhuodizhi',
      path: '/pages/user/addr/index'
    }]
  },
  setPath: function (e){
    let path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'//页面标题为路由参数
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