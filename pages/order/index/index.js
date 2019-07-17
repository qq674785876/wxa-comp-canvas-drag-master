// pages/order/index/index.js
let app = getApp();
let user = wx.getStorageSync('user') || {};
let md5 = require('../../../utils/md5.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrInfo: null,
    product_num: 1,
    remark: '',
    orderInfo: {

    },
    price: 58,
    fileArr: [],
    uploadNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      orderInfo: options
    })
    _this.getAddrList();
  },
  selectAddr: function(){
    wx.navigateTo({
      url: '/pages/user/addr/index?type=select',
    })
  },
  payOrder: function(){
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: 'MD5',
      paySign: '',
      success(res) {
        console.log(res);
      },
      fail(res) { 
        console.log(res);
      }
    })
  },
  createorder: function () {
    let _this = this;
    if (!_this.data.addrInfo){
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '订单生成中',
    })

    //上传图片
    let orderInfo = _this.data.orderInfo;
    let design_text = JSON.parse(orderInfo.design_text);
    let designs = design_text.designs;
    let fileArr = [design_text.previewImg];
    for (let i = 0; i < designs.length; i++){
      if (designs[i].type === 'image'){
        fileArr.push(designs[i].url);
      }
    }
    _this.setData({
      uploadNum: 0
    })

    _this.uploadAllFile(fileArr, design_text, function(){
      let orderInfo = _this.data.orderInfo;
      let sign = 'user_id=' + user.userid + '&product_id=' + orderInfo.product_id +
        '&product_num=' + _this.data.product_num + '&address_id=' + _this.data.addrInfo.Address_id +
        '&coupon_id=' + (_this.data.coupon_id || 0) + '&product_param_ids=' + orderInfo.product_param_ids +
        '&design_text=' + JSON.stringify(orderInfo.design_text) + '&dzb';
      // createorder
      app.request({
        url: '/createorder',
        header: { 'Content-Type': 'application/json' },
        data: {
          product_id: Number(orderInfo.product_id),
          product_num: _this.data.product_num,
          address_id: _this.data.addrInfo.Address_id,
          coupon_id: _this.data.coupon_id || 0,
          product_param_ids: orderInfo.product_param_ids,
          design_text: JSON.stringify(orderInfo.design_text),
          remark: _this.data.remark,
          sign: md5.hexMD5(sign),
          openid: user.openid,
          user_id: user.userid
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        success: function (res) {
          wx.hideLoading();
          let data = res.data;
          if (data.error == 0) {
            _this.payOrder();
          } else {
            wx.showToast({
              title: data.reason,
              icon: 'none'
            })
          }
        }
      })
    });

    
  },
  //"{"previewImg":"http://tmp/wx8b784f9bb81fc4ab.o6zAJs4S8lfO2oUu39KZEK2Vbp20.6uDRgsEAHeD7b7de3bb3b0b4a446a0a5e1a66d42405c.png","designs":[{"type":"text","text":"sds","color":"black","fontSize":20,"y":30,"x":30.654296875,"w":31.30859375,"h":30,"rotate":0},{"type":"image","url":"http://tmp/wx8b784f9bb81fc4ab.o6zAJs4S8lfO2oUu39KZEK2Vbp20.JtJ6GHjOypGt4c0b5b5689ec7480fe8b4fd65e303187.jpg","y":30,"x":30,"w":60.8,"h":81.06666666666666,"rotate":0,"sourceId":null}]}"
  uploadAllFile: function (fileArr, design_text, fct) {
    let _this = this;
    if (_this.data.uploadNum === fileArr.length) {
      fct();
    } else {
      _this.setData({
        uploadNum: ++_this.data.uploadNum
      });
      let uploadNum = _this.data.uploadNum;
      wx.uploadFile({
        url: app.apiHost + '/uploadimage', //仅为示例，非真实的接口地址
        filePath: fileArr[uploadNum - 1],
        name: 'image',
        formData: {
          'isThumb': '0'
        },
        success(res) {
          const data = JSON.parse(res.data);
          const result = data.result;
          if (uploadNum === 1){
            _this.setData({
              'orderInfo.design_text.previewImg': result.imageurl
            })
          }else{
            let designs = design_text.designs;
            for (let i = 0; i < designs.length; i++){
              if (designs[i].type === 'image'){
                designs[i].url = result.imageurl;
                break;
              }
            }
            _this.setData({
              'orderInfo.design_text.designs': designs
            })
          }
          _this.uploadAllFile(fileArr, design_text, fct);
        }
      })
    }
  },
  getAddrList: function () {
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
          let list = data.result.list;
          if (list){
            _this.setData({
              addrInfo: list[0]
            })
          }
        }
      }
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
  onShow: function (options) {
    console.log(options);
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