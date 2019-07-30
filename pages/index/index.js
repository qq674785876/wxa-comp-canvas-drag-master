//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    moduleArr: [{
      name: 'T恤',
      bgColor: '#fff',
      Product_id: 9,
      imgSrc: '/assets/images/blackTshirt.jpg'
    },{
      name: '无帽文化衫',
        bgColor: '#fff', 
        Product_id: 10,
        imgSrc: '/assets/images/blackNoCap.jpg'
    },{
      name: '带帽文化衫',
        bgColor: '#fff', 
        Product_id: 11,
        imgSrc: '/assets/images/blackHoodedCap.jpg'
    },{
      name: '暂无',
        bgColor: '#fff',
    }],
    startPoint: {},//触摸开始
    activeNavIndex: 0,
    moveX: 0,
    menuDeg: 0
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {

  },
  tapModule: function(e){
    let item = e.currentTarget.dataset.item;
    let Product_id = item.Product_id;
    if (Product_id){
      wx.navigateTo({
        url: '/pages/customized/index?type=' + Product_id
      })
    }
  },
  // 菜单拖动的三个方法
  buttonStart: function (e) {
    var touches = e.touches[0];
    this.setData({
      startPoint: touches
    })
  },
  buttonMove: function (e) {
    var that = this;
    var touches = e.touches[0];
    var startX = this.data.startPoint.clientX;
    var startY = this.data.startPoint.clientY;
    var moveX = touches.clientX - startX;
    var moveY = touches.clientY - startY;
    this.setData({
      moveX: moveX
    })
  },
  buttonEnd: function (e) {
    // 计算，每秒移动的角度 
    var that = this;
    var moveX = this.data.moveX;
    var menuDeg = this.data.menuDeg;
    var activeNavIndex = this.data.activeNavIndex;
    if (moveX > 0) {
      menuDeg += 90
      activeNavIndex--;
      activeNavIndex = activeNavIndex < 0 ? 3 : activeNavIndex;
    } else {
      menuDeg -= 90
      activeNavIndex++;
      activeNavIndex = activeNavIndex > 3 ? 0 : activeNavIndex;
    }
    this.setData({
      menuDeg: menuDeg,
      activeNavIndex: activeNavIndex
    })
    
  },
  jumpMyPage: function(){
    wx.navigateTo({
      url: '/pages/user/index/index'
    })
  }
})
