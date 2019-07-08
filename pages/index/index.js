//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    menuArr: [{
      name: '菜单1',
      value: 1
    },{
      name: '菜单2',
      value: 2
    },{
      name: '菜单3',
      value: 3
    },{
      name: '菜单4',
      value: 3
    }],
    moduleArr: [{
      bgColor: 'red',
      path: '/pages/customized/index',
      imgSrc: '/assets/images/test.jpg'
    },{
      bgColor: 'black', 
    },{
      bgColor: 'blue', 
    },{
      bgColor: 'yellow', 
    }],
    startPoint: {},//触摸开始
    activeNavIndex: 0,
    moveX: 0,
    menuDeg: 0
  },
  tapModule: function(e){
    var item = e.currentTarget.dataset.item;
    console.log(item);
    if (item.path){
      wx.navigateTo({
        url: item.path
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
    console.log(activeNavIndex)
  }
})
