//index.js
import CanvasDrag from '../../components/canvas-drag/canvas-drag';

Page({
    data: {
        graph: {},
        type: 0,
        demoImg: {
          src: '',
          height: '',
          width: ''
        },
        demoImgArr: [
          {
            img: ['/assets/images/whiteTshirt.jpg', '/assets/images/blackTshirt.jpg'],
            dragWidth: wx.getSystemInfoSync().windowWidth * .38,
            dragHeight: wx.getSystemInfoSync().windowWidth * .48
          },
          {
            img: ['/assets/images/whiteHoodedCap.jpg', '/assets/images/blackHoodedCap.jpg'],
            dragWidth: wx.getSystemInfoSync().windowWidth * .3,
            dragHeight: wx.getSystemInfoSync().windowWidth * .3,
            margin: wx.getSystemInfoSync().windowWidth * .34 + 'px auto'
          },
          {
            img: ['/assets/images/whiteNoCap.jpg', '/assets/images/blackNoCap.jpg'],
            dragWidth: wx.getSystemInfoSync().windowWidth * .4,
            dragHeight: wx.getSystemInfoSync().windowWidth * .5
          }
        ],
        previewCanvas:{
          context: null,
          height: wx.getSystemInfoSync().windowWidth,
          width: wx.getSystemInfoSync().windowWidth
        },
        downCanvas: {
          context: null,
          height: wx.getSystemInfoSync().windowWidth * 4,
          width: wx.getSystemInfoSync().windowWidth * 4
        }
    },
    onLoad: function(options){
      let _this  = this;
      let type = options.type || '1';
      let demoImgArr = _this.data.demoImgArr;
      let imgSrc = demoImgArr[type].img[0];
      _this.setData({
        'demoImg.src': imgSrc,
        'type': type
      })
      _this.setImageInfo(imgSrc);
    },
    initPreviewCanvas: function(){
      let _this = this;
      let context = wx.createCanvasContext('previewCanvas');
      let windowWidth = wx.getSystemInfoSync().windowWidth;
      let demoImg = this.data.demoImg;
      _this.setData({
        'previewCanvas.context': context
      })
      console.log(demoImg);
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
    initDownCanvas: function(){
      var _this = this;
      this.setData({
        'downCanvas.context': wx.createCanvasContext('downCanvas')
      })
      var context = this.data.downCanvas.context;
      var windowWidth = wx.getSystemInfoSync().windowWidth;
      var demoImg = this.data.demoImg;
      context.drawImage(demoImg.src, 0, 0, _this.data.downCanvas.width, _this.data.downCanvas.width / demoImg.width * demoImg.height);
    },
    onComplete: function(){
      var _this = this;
      this.initDownCanvas();
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
              _this.downImg();
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
    downImg: function(){
      let _this = this;
      wx.showLoading({
        title: '图片生成中',
      })
      setTimeout(function(){
        _this.onExportJSON();
        wx.canvasToTempFilePath({
          canvasId: 'downCanvas',
          destWidth: wx.getSystemInfoSync().windowWidth * 2,
          destHeight: wx.getSystemInfoSync().windowWidth * 2,
          success: (res) => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,   //这个只是测试路径，没有效果
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
          fail: (e) => {
            reject(e);
          },
        }, this);
      }, 500)
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
    onAddText() {
        this.setData({
            graph: {
                type: 'text',
                text: 'helloworld',
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
    onExportJSON(){
        CanvasDrag.exportJson()
          .then((imgArr) => {
            console.log(JSON.stringify(imgArr));
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
