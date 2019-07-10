// pages/user/addr/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    addrArr: [{
      name: '忘记了',
      phone: 18870652563,
      addr: '北京市东城区123'
    },{
      name: '哦哦哦',
      phone: 110,
      addr: '天津市123456'
    }],
    drawer: {
      title: '地址信息',
    },
    region: ['', '', '']
  },
  addAddr: function(){
    let _this = this;
    _this.setData({
      showModalStatus: true
    })
  },
  saveAddr: function(){

  },
  bingRegionChange: function(e){
    this.setData({
      region: e.detail.value
    })
  },
  powerDrawer: function(){
    let _this = this;
    _this.setData({
      showModalStatus: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '收货地址'//页面标题为路由参数
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