// pages/user/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNavIndex: 0,
    navArr: [{
      name: '全部',
      value: 0
    },{
      name: '待付款',
      value: 1
    },{
      name: '待发货',
      value: 2
    },{
      name: '待收货',
      value: 3
    },{
      name: '已完成',
      value: 4
    }],
    orderArr: []
  },
  activeNav: function(e){
    let _this = this;
    let value = e.currentTarget.dataset.value;
    _this.setData({
      activeNavIndex: value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的订单'//页面标题为路由参数
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