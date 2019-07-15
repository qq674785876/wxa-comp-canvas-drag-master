// pages/user/addr/index.js
let app = getApp();
let user = wx.getStorageSync('user') || {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    addrArr: [],
    drawer: {
      title: '地址信息',
    },
    region: ['', '', ''],
    addInfo: {
      id: '',
      name: '',
      phone: '',
      addr: ''
    }
  },
  getAddrList: function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: '/addresslist',
      data: {
        pagesize: 1000,
        pagenum: 0,
        isuse: '',
        userid: user.userid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      success: function (res) {
        wx.hideLoading()
        let data = res.data;
        if (data.error === 0) {
          _this.setData({
            addrArr: data.result.list
          })
        }
      }
    })
  },
  addAddr: function(){
    let _this = this;
    _this.setData({
      showModalStatus: true
    })
  },
  editAddr: function(e){
    let _this = this;
    let item = e.currentTarget.dataset.item;
    _this.setData({
      showModalStatus: true,
      'addInfo.id': item.Address_id,
      'addInfo.name': item.Address_user_name,
      'addInfo.phone': item.Address_user_phone,
      region: [item.Province, item.City, item.Regoin],
      'addInfo.addr': item.Detail_address
    })
  },
  deleteAddr: function(e){
    let item = e.currentTarget.dataset.item;
  },
  saveAddr: function(){
    let _this = this;
    wx.showLoading({
      title: '保存中',
    })
    let params = {
      addressUserName: _this.data.addInfo.name,
      addressUserPhone: _this.data.addInfo.phone,
      province: _this.data.region[0],
      city: _this.data.region[1],
      regoin: _this.data.region[2],
      detailAddress: _this.data.addInfo.addr,
      userid: user.userid,
      isDefault: 1
    };
    let url = '/adduseraddress';
    if(_this.data.addInfo.id){
      url = '/updateuseraddress';
      params.addressid = _this.data.addInfo.id;
      params.isUse = 1;
    }
    app.request({
      url: url,
      data: params,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      success: function (res) {
        wx.hideLoading()
        let data = res.data;
        if (data.error === 0) {
          _this.setData({
            showModalStatus: false
          })
          _this.getAddrList();
        }else{
          wx.showToast({
            title: data.reason,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  inputName: function(e){
    this.setData({
      'addInfo.name': e.detail.value
    })
  },
  inputPhone: function (e) {
    this.setData({
      'addInfo.phone': e.detail.value
    })
  },
  inputAddr: function (e) {
    this.setData({
      'addInfo.addr': e.detail.value
    })
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
    this.getAddrList();
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