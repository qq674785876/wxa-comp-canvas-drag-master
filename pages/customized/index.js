//index.js
import CanvasDrag from '../../components/canvas-drag/canvas-drag';

Page({
    data: {
        graph: {},
        demoImg: {
          src: '/assets/images/T-shirt.jpg',
          height: '',
          width: ''
        },
        downCanvas: {
          context: null,
          height: wx.getSystemInfoSync().windowWidth,
          width: wx.getSystemInfoSync().windowWidth
        },
        dragWidth: wx.getSystemInfoSync().windowWidth * .4,
        dragHeight: wx.getSystemInfoSync().windowWidth * .5
    },
    imageLoad:function(e){
      this.setData({
        'demoImg.height': e.detail.height,
        'demoImg.width': e.detail.width,
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
      context.drawImage(demoImg.src, 0, 0, windowWidth, windowWidth / demoImg.width * demoImg.height);
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
              console.log(data);
              console.log(imgWidth);
              console.log(imgHeight);
              var context = this.data.downCanvas.context;
              var windowWidth = wx.getSystemInfoSync().windowWidth;
              context.drawImage(filePath, (windowWidth - _this.data.dragWidth) * .5, _this.data.dragHeight * .5, _this.data.dragWidth, _this.data.dragHeight);
              // wx.previewImage({
              //   urls: [filePath]
              // })
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
      wx.showLoading({
        title: '图片生成中',
      })
      setTimeout(function(){
        wx.canvasToTempFilePath({
          canvasId: 'downCanvas',
          destWidth: wx.getSystemInfoSync().windowWidth,
          destHeight: wx.getSystemInfoSync().windowWidth,
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
                let dragWidth = _this.data.dragWidth;
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
