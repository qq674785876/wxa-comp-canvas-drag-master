//index.js
import CanvasDrag from '../../components/canvas-drag/canvas-drag';
let app = getApp();
let user = wx.getStorageSync('user') || {};

Page({
    data: {
        graph: {},
        type: 0,
        Product_id: 0,
        isShowTextInput: false,
        isShowParams: false,
        activeFamilyIndex: 0,
        textInput: {
          bottom: 0,
          cont: ''
        },
        familyArr: [{
          name: '楷体',
          type: 'KaiTi'
        },{
          name: '微软雅黑',
          type: 'Microsoft YaHei'
        },{
          name: '仿宋',
          type: 'FangSong'
        },{
          name: '黑体',
          type: 'SimHei'
        },{
          name: '新宋体',
          type: 'NSimSun'
        }],
        demoImg: {
          src: '',
          height: '',
          width: ''
        },
        demoImgArr: [
          {
            img: ['/assets/images/whiteTshirt.jpg', '/assets/images/blackTshirt.jpg'],
            dragWidth: wx.getSystemInfoSync().windowWidth * .38,
            dragHeight: wx.getSystemInfoSync().windowWidth * .48,
            margin: wx.getSystemInfoSync().windowWidth * .26 + 'px ' + wx.getSystemInfoSync().windowWidth * .295 + 'px '
          },
          {
            img: ['/assets/images/whiteNoCap.jpg', '/assets/images/blackNoCap.jpg'],
            dragWidth: wx.getSystemInfoSync().windowWidth * .4,
            dragHeight: wx.getSystemInfoSync().windowWidth * .5,
            margin: wx.getSystemInfoSync().windowWidth * .2 + 'px auto'
          },
          {
            img: ['/assets/images/whiteHoodedCap.jpg', '/assets/images/blackHoodedCap.jpg'],
            dragWidth: wx.getSystemInfoSync().windowWidth * .3,
            dragHeight: wx.getSystemInfoSync().windowWidth * .3,
            margin: wx.getSystemInfoSync().windowWidth * .34 + 'px auto'
          }
        ],
        paramsArr: [],
        activeParamsIndexArr: [],
        previewCanvas:{
          context: null,
          display: 'block',
          height: wx.getSystemInfoSync().windowWidth,
          width: wx.getSystemInfoSync().windowWidth
        },
        downCanvas: {
          context: null,
          height: wx.getSystemInfoSync().windowWidth * 4,
          width: wx.getSystemInfoSync().windowWidth * 4
        },
        activeProductParams: {
          pid: 0,
          id: 0
        },
        price: 10
    },
    //获取商品参数
    getProductparam: function () {
      let _this = this;
      wx.showLoading({
        title: '加载中',
      })
      app.request({
        url: '/getproductparam',
        data: {
          productid: _this.data.Product_id,
          userid: user.userid
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        success: function (res) {
          wx.hideLoading();
          let data = res.data;
          if (data.error === 0 && data.result.productParams) {
            let productParams = data.result.productParams;
            let activeParamsIndexArr = [];
            for (let i = 0; i < productParams.length; i++) {
              activeParamsIndexArr.push(productParams[i].params[0]);
            }
            _this.setData({
              paramsArr: productParams,
              activeParamsIndexArr: activeParamsIndexArr
            })
          }
        }
      })
    },
    activeParamsSon: function(e){
      let _this = this;
      let item = e.currentTarget.dataset.item;
      let pindex = e.currentTarget.dataset.pindex;
      let index = e.currentTarget.dataset.index;
      let paramsArr = _this.data.paramsArr;
      let activeParamsIndexArr = _this.data.activeParamsIndexArr;
      activeParamsIndexArr[pindex] = paramsArr[pindex].params[index];
      _this.setData({
        activeParamsIndexArr: activeParamsIndexArr
      })
    },
    creatOrder: function(){
      let _this = this;
      _this.initDownCanvas();
    },
    onLoad: function(options){
      let _this  = this;
      let Product_id = options.Product_id || 9;
      let type = 0;
      if (Product_id == 9){
        type = 0;
      } else if (Product_id == 10) {
        type = 1;
      } else if (Product_id == 11) {
        type = 2;
      }
      let demoImgArr = _this.data.demoImgArr;
      let imgSrc = demoImgArr[type].img[0];
      _this.setData({
        'demoImg.src': imgSrc,
        'Product_id': Product_id,
        'type': type
      })
      _this.setImageInfo(imgSrc);
      _this.getProductparam();
    },
    bindkeyboardheightchange: function(e){

    },
    confirmInput: function(){
      let _this = this;
      let text = _this.data.textInput.cont;
      let activeFamilyIndex = _this.data.activeFamilyIndex;
      let familyArr = _this.data.familyArr;
      if (text){
        _this.onAddText(text, 'black', 'normal 400px ' + familyArr[activeFamilyIndex].type);
      }else{
        // wx.showToast({
        //   title: '请输入文字',
        //   icon: 'none',
        //   duration: 2000
        // })
      }
      _this.setData({
        isShowTextInput: false,
        'previewCanvas.display': 'block'
      })
    },
    bindKeyInput: function (e) {
      this.setData({
        'textInput.cont': e.detail.value
      })
    },
    initPreviewCanvas: function(){
      let _this = this;
      let context = wx.createCanvasContext('previewCanvas');
      let windowWidth = wx.getSystemInfoSync().windowWidth;
      let demoImg = this.data.demoImg;
      _this.setData({
        'previewCanvas.context': context
      })
      context.drawImage(demoImg.src, 0, 0, _this.data.previewCanvas.width, _this.data.previewCanvas.width / demoImg.width * demoImg.height);
      //绘制图片
      context.draw();
    },
    setImageInfo: function (filePath){
      let _this = this;
      wx.getImageInfo({
        src: filePath,
        success: data => {
          _this.setData({
            'demoImg.src': filePath,
            'demoImg.height': data.height,
            'demoImg.width': data.width,
          })
          _this.initPreviewCanvas();
        }
      })
    },  
    onShow: function(){

    },
    addText: function () {
      this.setData({
        isShowTextInput: true,
        'previewCanvas.display': 'none',
        'textInput.cont': ''
      })
    },
    bindtapFamily: function(e){
      let index = e.currentTarget.dataset.index;
      this.setData({
        activeFamilyIndex: index
      })
    },
    initDownCanvas: function(){
      var _this = this;
      this.setData({
        'downCanvas.context': wx.createCanvasContext('downCanvas')
      })
      var context = this.data.downCanvas.context;
      var windowWidth = wx.getSystemInfoSync().windowWidth;
      var demoImg = this.data.demoImg;
      context.drawImage(demoImg.src, 0, 0, _this.data.downCanvas.width, _this.data.downCanvas.width / demoImg.width * demoImg.height);
      CanvasDrag.export()
        .then((filePath) => {
          console.log(filePath);
          // 获取图片大小
          wx.getImageInfo({
            src: filePath,
            success: data => {
              let imgWidth = data.width;
              let imgHeight = data.height;
              let dragWidth = _this.data.demoImgArr[_this.data.type].dragWidth;
              let dragHeight = _this.data.demoImgArr[_this.data.type].dragHeight;
              let downCanvas = _this.data.downCanvas;
              var context = this.data.downCanvas.context;
              var windowWidth = wx.getSystemInfoSync().windowWidth;
              console.log(downCanvas.width - dragWidth + ',' + dragHeight);
              context.drawImage(filePath, (windowWidth - dragWidth) * 2, (windowWidth - dragHeight) * 2, dragWidth * 4, dragHeight * 4);
              // wx.previewImage({
              //   urls: [filePath]
              // })
              context.mozImageSmoothingEnabled = false;
              context.webkitImageSmoothingEnabled = false;
              context.msImageSmoothingEnabled = false;
              context.imageSmoothingEnabled = false;
              //绘制图片
              context.draw();
              _this.generateImg();
            }
          });
          // wx.previewImage({
          //     urls: [filePath]
          // })
        })
        .catch((e) => {
          console.error(e);
        })
    },
    onComplete: function(){
      let _this = this;
      _this.setData({
        isShowParams: true
      })
    },
    hideMc: function(e){
      let _this = this;
      _this.setData({
        isShowParams: false
      })
    },
    generateImg: function(){
      let _this = this;
      wx.showLoading({
        title: '图片生成中',
      })
      setTimeout(function(){
        _this.onExportJSON(function(imgArr){
          wx.canvasToTempFilePath({
            canvasId: 'downCanvas',
            destWidth: wx.getSystemInfoSync().windowWidth * 2,
            destHeight: wx.getSystemInfoSync().windowWidth * 2,
            success: (res) => {
              // _this.saveImage();
              let activeParamsIndexArr = _this.data.activeParamsIndexArr;
              let product_param_ids = '';
              for (let i = 0; i < activeParamsIndexArr.length; i++) {
                if (i > 0) product_param_ids += ',';
                product_param_ids += activeParamsIndexArr[i].id;
              }

              wx.navigateTo({
                url: '/pages/order/index/index?filePath=' +
                  res.tempFilePath +
                  '&product_id=' + _this.data.Product_id +
                  '&product_param_ids=' + product_param_ids +
                  '&design_text=' + JSON.stringify({
                    previewImg: res.tempFilePath,
                    designs: imgArr
                  })
              })
            },
            fail: (e) => {
              reject(e);
            },
          }, this);
        });
      }, 500)
    },
    saveImage: function(path){
      wx.saveImageToPhotosAlbum({
        filePath: path,   //这个只是测试路径，没有效果
        success(res) {
          wx.hideLoading();
          console.log("success");
        },
        fail: function (res) {
          wx.hideLoading();
          console.log(res);
        }
      })
    },
    /**
     * 添加测试图片
     */
    onAddTest() {
        this.setData({
            graph: {
                w: 120,
                h: 120,
                type: 'image',
                url: '../../assets/images/test.jpg',
            }
        });
    },

    /**
     * 添加图片
     */
    onAddImage() {
      var _this = this;
      wx.chooseImage({
          success: (res) => {
            let imgUrl = res.tempFilePaths[0];
            // 获取图片大小
            wx.getImageInfo({
              src: imgUrl,
              success: data => {
                let imgWidth = data.width;
                let imgHeight = data.height;
                let dragWidth = _this.data.demoImgArr[_this.data.type].dragWidth;
                let dragHeight = _this.data.demoImgArr[_this.data.type].dragHeight;
                this.setData({
                  graph: {
                    w: dragWidth * .5,
                    h: imgHeight * (dragWidth / imgWidth) * .5,
                    type: 'image',
                    url: imgUrl,
                  }
                });
              }
            });
          }
      })
    },

    /**
     * 添加文本
     */
    onAddText(text, color, font) {
        this.setData({
            graph: {
              type: 'text',
              text: text,
              color: color,
              font: font
            }
        });
    },

    /**
     * 导出图片
     */
    onExport() {
      CanvasDrag.export(1000, 1000)
            .then((filePath) => {
                console.log(filePath);
                // wx.previewImage({
                //     urls: [filePath]
                // })
            })
            .catch((e) => {
                console.error(e);
            })
    },

    /**
  * 保存图片
  */
    onSaveImage: function () {
      CanvasDrag.export(1000, 1000)
        .then((filePath) => {
          console.log(filePath);
          // wx.previewImage({
          //     urls: [filePath]
          // })
          wx.saveImageToPhotosAlbum({
            filePath: filePath,   //这个只是测试路径，没有效果
            success(res) {
              console.log("success");
            },
            fail: function (res) {
              console.log(res);
            }
          })
        })
        .catch((e) => {
          console.error(e);
        })
    },

    /**
     * 改变文字颜色
     */
    onChangeColor() {
        CanvasDrag.changFontColor('blue');
    },

    /**
     * 改变背景颜色
     */
    onChangeBgColor() {
        CanvasDrag.changeBgColor('yellow');
    },

    /**
     * 改变背景照片
     */
    onChangeBgImage() {
        CanvasDrag.changeBgImage('../../assets/images/test.jpg');
    },
    /**
     * 导出当前画布为模板
     */
    onExportJSON(fct){
      let _this = this;
        CanvasDrag.exportJson()
          .then((imgArr) => {
            fct(imgArr);
        })
          .catch((e) => {
              console.error(e);
          });
    },

    onImport(){
        // 有背景
        // let temp_theme = [{"type":"bgColor","color":"yellow"},{"type":"image","url":"../../assets/images/test.jpg","y":98.78423143832424,"x":143.78423143832424,"w":104.43153712335152,"h":104.43153712335152,"rotate":-12.58027482265038,"sourceId":null},{"type":"text","text":"helloworld","color":"blue","fontSize":24.875030530031438,"y":242.56248473498428,"x":119.57012176513672,"w":116.73966979980469,"h":34.87503053003144,"rotate":8.873370699754087}];
        // 无背景
        let temp_theme = [{"type":"image","url":"../../assets/images/test.jpg","y":103,"x":91,"w":120,"h":120,"rotate":0,"sourceId":null},{"type":"text","text":"helloworld","color":"blue","fontSize":20,"y":243,"x":97,"rotate":0}];

        CanvasDrag.initByArr(temp_theme);
    },

     onClearCanvas:function(event){
        let _this = this;
        _this.setData({canvasBg:null});
        CanvasDrag.clearCanvas();
    },
});
